import {useEffect, useState} from 'react';
import EventList from "./components/EventList.jsx";
import CategoryList from "./components/CategoryList.jsx";
import SubscriptionList from "./components/SubscriptionList.jsx";
import TransactionList from "./components/TransactionList.jsx";
import UserList from "./components/UserList.jsx";
import "./index.css"
import RoleList from "./components/RoleList.jsx";
import VenueList from "./components/VenueList.jsx";



const App = () => {
const [data, setData] = useState(0);
    useEffect(() => {
        console.log(data)
    }, [data]);

    function changeNumber(){
        setData(2)
    }

    return (
        <div className="p-[50px]">
            <UserList/>
        </div>
    );
};

export default App;