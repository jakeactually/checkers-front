export const Tile = ({ tileSize, offset, cell, mouse, current, setCurrent, path, setPath }) => {
  const isOver = path.some(o => current && cell.x === o.x && cell.y === o.y);

  if (cell.isNone) {
    return <div
      className={`square ${isOver ? 'yellow' : ''}`}>
    </div>;
  }

  const image = '/checkers/' + ['None','Red','Blue','RedQueen','BlueQueen'][cell.tag] + '.svg';

  if (current && cell.x === current.x && cell.y === current.y) {
    return <div className={`square ${isOver ? 'yellow' : ''}`}>
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
    setPath([...path, { x: cell.x, y: cell.y }]);
    setCurrent({ x: cell.x, y: cell.y });
  };

  return <div
    className={`square ${isOver ? 'yellow' : ''}`}
    onMouseDown={start}
    onTouchStart={start}>
    <img src={image} className="tile" style={{
      left: cell.x * tileSize + tileSize / 2 + offset.x,
      top: cell.y * tileSize + tileSize / 2 + offset.y,
    }}></img>
  </div>;
};
