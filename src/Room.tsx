import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { makeConnect, mouseMovement, tileAndOffset, makeEnd, Board, Position, Params } from './util';
import { Tile } from './Tile';

export function Room() {
  const params = useParams() as unknown as Params;
  const [current, setCurrent] = useState<Position | null>(null);
  const [mouse, setMouse] = useState<Position>({ x: 0, y: 0 });
  const [board, setBoard] = useState<Board | null>(null);
  const [path, setPath] = useState<Position[]>([]);
  const [count, setSocketCount] = useState(0);
  const [{ connect }] = useState({ connect: makeConnect(params, setSocketCount) });
  const { tileSize, offset } = tileAndOffset();
  
  useEffect(() => {
    mouseMovement(setMouse);
    connect();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await axios.get(`/Room/${params.id}`);
      setBoard(res.data.board);
    })();
  }, [count]);

  const mouseTile = {
    x: Math.floor((mouse.x - offset.x) / tileSize),
    y: Math.floor((mouse.y - offset.y) / tileSize)
  };
  
  const isValid =
    mouseTile.x >= 0 &&
    mouseTile.x <= 7 &&
    mouseTile.y >= 0 &&
    mouseTile.y <= 7;
  
  const isBlack = mouseTile.x % 2 === mouseTile.y % 2;
  // console.log(path);
  
  if (current && isValid && isBlack && !path.some(o => mouseTile.x === o.x && mouseTile.y === o.y)) {
    setPath([...path, mouseTile]);
  }

  if (!board) {
    return <div className="Error">
      Room is already playing
    </div>;
  }

  const end = makeEnd(current, path, setBoard, setCurrent, setPath, params);

  return (
    <div className="App" onTouchEnd={end} onMouseUp={end}>
      <div className="board" >
        {board.map((row, y) => <div className="row" key={y}>
          {row.map((cell, x) =>
            <Tile
              key={x}
              tileSize={tileSize}
              offset={offset}
              cell={{ name: cell, x, y, isNoPiece: cell === 'NoPiece' }}
              mouse={mouse}
              current={current}
              setCurrent={setCurrent}
              path={path}
              setPath={setPath}>
            </Tile>
          )}
        </div>)}
      </div>
    </div>
  );
}

export default Room;
