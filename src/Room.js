import { useEffect, useState } from 'react';
import { useRouteMatch } from "react-router-dom";
import axios from 'axios';

export function Room() {
  const { tileSize, offset } = tileAndOffset();
  const { params } = useRouteMatch();
  const [current, setCurrent] = useState(null);
  const [mouse, setMouse] = useState([0, 0]);
  const [board, setBoard] = useState(null);

  useEffect(() => {
    effect(setMouse, setBoard, params);
  }, []);

  const over = {
    x: Math.floor((mouse.x - offset.x) / tileSize),
    y: Math.floor((mouse.y - offset.y) / tileSize)
  };

  if (!board) {
    return <div className="Error">
      Room is already playing
    </div>;
  }

  const end = makeEnd(board, current, over, setBoard, setCurrent, params);

  return (
    <div className="App" onTouchEnd={end} onMouseUp={end}>
      <div className="debug">
        {JSON.stringify(current)}
        {JSON.stringify(mouse)}
        {JSON.stringify(over)}
      </div>
      <div className="board" >
        {board.map((row, y) => <div className="row">
          {row.map((cell, x) =>
            renderTile(tileSize, offset, { ...cell, x, y }, mouse, current, setCurrent, over)
          )}
        </div>)}
      </div>
    </div>
  );
}

const tileAndOffset = () => {
  const tileSize = Math.min(window.innerHeight, window.innerWidth) / 8;
  const offsetAmount = Math.abs(window.innerHeight - window.innerWidth) / 2;

  const offset = window.innerWidth > window.innerHeight ?
    { x: offsetAmount, y: 0 } :
    { x: 0, y: offsetAmount };
  
  return { tileSize, offset };
};

const effect = (setMouse, setBoard, params) => {
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

  (async () => {
    const res = await axios.get(`/api/Room/${params.id}`);
    setBoard(res.data.board);
  })();
};

const makeEnd = (board, current, over, setBoard, setCurrent, params) => async () => {
  if (!current) return;

  const isBlack = over.x % 2 == over.y % 2;
  if (!isBlack) {
    setCurrent(null)
    return;
  }

  const res = axios.post(`/api/Turn/${params.id}`, { from: current, to: over });
  alert(JSON.stringify(res.data));

  setCurrent(null);
};

const renderTile = (tileSize, offset, cell, mouse, current, setCurrent, over) => {
  const isBlack = cell.x % 2 == cell.y % 2;
  const isOver = current && over && cell.x == over.x && cell.y == over.y;

  if (cell.value == 0) {
    return <div
      className={`square ${isBlack && isOver ? 'yellow' : ''}`}>
    </div>;
  }

  const image = cell.value == 1 ? "/red.svg" : "/blue.svg"

  if (current && cell.x == current.x && cell.y == current.y) {
    return <div className="square">
      <img
        src={image}
        className="tile"
        draggable={false}
        style={{
          left: mouse.x,
          top: mouse.y,
      }}></img>
    </div>;
  }

  const start = ev => {
    ev.preventDefault();
    setCurrent({ x: cell.x, y: cell.y });
  };

  return <div
    className="square"
    onMouseDown={start}
    onTouchStart={start}>
    <img src={image} className="tile" style={{
      left: cell.x * tileSize + tileSize / 2 + offset.x,
      top: cell.y * tileSize + tileSize / 2 + offset.y,
    }}></img>
  </div>;
};

export default Room;
