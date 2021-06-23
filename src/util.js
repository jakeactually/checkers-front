import axios from 'axios';

let count = 0;

export const makeConnect = (params, setSocketCount) => {
    const connect = () => {
        const socket = new WebSocket(
            `wss://jakeactually.com/checkers/api/State/${params.id}`
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

export const mouseMovement = (setMouse) => {
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

export const makeEnd = (current, path, offset, setBoard, setCurrent, setPath, setMouse, params, addToast) => async () => {
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
        const res = await axios.post(`Turn/${params.id}`, path);
        setBoard(res.data.board);
    } catch (exception) {
        addToast(exception.response.data, { appearance: 'error', autoDismiss: true });
    }

    setCurrent(null);
    setPath([]);
};
 