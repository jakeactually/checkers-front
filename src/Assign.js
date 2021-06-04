
import axios from 'axios';
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

export function Assign() {
    const history = useHistory();

    useEffect(() => {
        (async () => {
        const res = await axios.get('/api/Index');
        console.log(res.data);
        history.push(`/Room/${res.data}`);
        })();
    }, []);

    return null;
}
