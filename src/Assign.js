
import axios from 'axios';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Assign() {
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('Index').then(res => {
            console.log(res.data);
            navigate(`/Room/${res.data}`);
        });
    }, []);

    return null;
}
