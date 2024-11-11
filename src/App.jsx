// src/App.jsx
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/forms/LoginForm.jsx';
import RegisterForm from './components/forms/RegisterForm';
import Profile from './pages/Profile.jsx';
import useAuthStore from "./stores/AuthStore.js";
import Header from './components/Header.jsx';  // Импортируем Header
import EventFeed from "./pages/EventFeed.jsx";
import EventCard from "./components/cards/EventCard.jsx";
import EventDetail from "./pages/EventDetail.jsx";

const App = () => {
    const { user } = useAuthStore(); // Получаем пользователя из хранилища

    return (
        <Router>
            <div className="app-container">
                {/* Отображаем Header на всех страницах */}
                {(window.location.pathname !== '/register') && <Header />}

                <div className="content-container p-6">
                    <Routes>
                        {/* Страница для логина и регистрации */}
                        <Route path="/" element={!user ?
                            <div className={`h-[30vh] items-center`}>
                                <LoginForm />
                            </div>
                            :
                            <div className={`h-[30vh] items-center`}>
                                <EventFeed />
                            </div>
                        } />
                        <Route path="/register" element={
                            <div className={`h-[30vh] items-center`}>
                                <RegisterForm />
                            </div>
                        } />
                        {/* Страница профиля */}
                        <Route path="/profile" element={user ? <Profile /> : <LoginForm />} />
                        <Route path="/event/:id" element={<EventDetail />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
