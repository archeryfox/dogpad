//src/components/cards/EventCart.jsx 
import {useEffect, useState} from 'react';
import "./index.css"

export const EventCart = () => {
    const [data, setData] = useState(0);

    useEffect(() => {
        console.log(data)
    }, [data]);

    return (
        <div className="">

        </div>
    );
};
