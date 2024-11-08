import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {useState} from "react";
import EventList from "./components/EventList.jsx";
import CategoryList from "./components/CategoryList.jsx";
import SubscriptionList from "./components/SubscriptionList.jsx";
import TransactionList from "./components/TransactionList.jsx";
import UserList from "./components/UserList.jsx";
import RoleList from "./components/RoleList.jsx";
import VenueList from "./components/VenueList.jsx";
import VenueEventChart from "./components/VenueEventChart.jsx";
import EventChart from "./components/EventChart.jsx";
import LoginForm from './components/forms/LoginForm.jsx';
import RegisterForm from './components/forms/RegisterForm';
import Profile from './pages/Profile.jsx';
import useAuthStore from "./stores/AuthStore.js";

const App = () => {
    const {user} = useAuthStore(); // Получаем пользователя из хранилища

    return (
        <Router>
            <div className="app-container">
                <Routes>
                    {/* Страница для логина и регистрации */}
                    <Route path="/" element={!user ?
                        <div className={`h-[30vh] items-center`}>
                            <LoginForm/>
                        </div>
                        :
                        <div className={`h-[30vh]  items-center`}>
                            <Profile/>
                        </div>
                    }/>
                    <Route path="/register" element={
                        <div className={`h-[30vh]  items-center`}>
                            <RegisterForm/>
                        </div>
                    }/>
                    {/* Страница профиля */}
                    <Route path="/profile" element={user ? <Profile/> : <LoginForm/>}/>
                </Routes>
            </div>
        </Router>
    );
};


export default App;
