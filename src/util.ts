import axios from 'axios';
import toast from 'react-hot-toast';

let count = 0;

export type PieceColor = "Blue" | "Red" | "NoPiece";

export type BoardRow = [
  PieceColor, PieceColor, PieceColor, PieceColor,
  PieceColor, PieceColor, PieceColor, PieceColor
];

export type Board = [
  BoardRow, BoardRow, BoardRow, BoardRow,
  BoardRow, BoardRow, BoardRow, BoardRow
];

export interface GameState {
  id: number;
  board: Board;
  users: number[];
  turn: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Cell {
  x: number;
  y: number;
  name: string;
  isNoPiece: boolean;
}

export interface TileProps {
  tileSize: number;
  offset: Position;
  cell: Cell;
  mouse: Position;
  current: Position | null;
  setCurrent: (position: Position | null) => void;
  path: Position[];
  setPath: (path: Position[]) => void;
}

export const makeConnect = (params: Params, setSocketCount: (_: number) => void) => {
    const connect = () => {
        const socket = new WebSocket(
            // `wss://jakeactually.com/checkers/api/State/${params.id}`
             `ws://localhost:5125/api/State/${params.id}`
        );

        socket.onmessage = ev => {
            setSocketCount(++count);
            console.log(ev);
        };

        socket.onerror = ev => {
            console.log(ev);
            setTimeout(connect, 1000);
        };
    };
    
    return connect;
};

export const mouseMovement = (setMouse: SetMouse) => {
    document.body.ontouchmove = ev => {
        const targetLocation = ev.targetTouches[0];

        setMouse({
        x: targetLocation.pageX,
        y: targetLocation.pageY
        })
    };

    document.body.onmousemove = ev => {
        setMouse({
        x: ev.clientX,
        y: ev.clientY
        })
    };
};

export const tileAndOffset = () => {
    const tileSize = Math.min(window.innerHeight, window.innerWidth) / 8;
    const offsetAmount = Math.abs(window.innerHeight - window.innerWidth) / 2;

    const offset = window.innerWidth > window.innerHeight ?
        { x: offsetAmount, y: 0 } :
        { x: 0, y: offsetAmount };

    return { tileSize, offset };
};

export interface Params {
  id: string;
}

type SetBoard = (board: Board) => void;
type SetCurrent = (position: Position | null) => void;
type SetMouse = (position: Position) => void;
type SetPath = (path: Position[]) => void;

export const makeEnd = (
  current: Position | null,
  path: Position[],
  setBoard: SetBoard,
  setCurrent: SetCurrent,
  setPath: SetPath,
  params: Params
): (() => Promise<void>) => async () => {
  if (!current || path.length < 2) {
    setCurrent(null);
    setPath([]);
    return;
  }

  const currentOver = path[path.length - 1];
  const isBlack = currentOver.x % 2 === currentOver.y % 2;

  if (!isBlack) {
    setCurrent(null);
    setPath([]);
    return;
  }

  try {
    const res = await axios.post<{ board: Board }>(`/Turn/${params.id}`, path);
    setBoard(res.data.board);
  } catch (exception: any) {
    toast.error(exception.response?.data || "An error occurred");
  }

  setCurrent(null);
  setPath([]);
};
