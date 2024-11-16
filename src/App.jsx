// App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/forms/LoginForm.jsx';
import RegisterForm from './components/forms/RegisterForm.jsx';
import Profile from './pages/Profile.jsx';
import useAuthStore from "./stores/AuthStore.js";
import Header from './components/Header.jsx';
import EventFeed from "./pages/EventFeed.jsx";
import EventDetail from "./pages/EventDetail.jsx";
import NotFoundPage from './pages/NotFoundPage.jsx';
import AddEventForm from "./components/forms/AddEventForm.jsx";
import EventList from "./components/EventList.jsx";
import EventChart from "./components/EventChart.jsx";
import SubscriptionFeed from './pages/SubscriptionFeed.jsx';
import BackupsAndLogs from './pages/BackupsAndLogs.jsx';  // Новый компонент
import RoleChangeRequests from './pages/RoleChangeRequests.jsx';  // Новый компонент
import MyEvents from './pages/MyEvents.jsx';  // Новый компонент
import UpdateEvent from './components/forms/UpdateEvent.jsx';
import { useEffect } from "react";
import VenueEventChart from "./components/VenueEventChart.jsx";
import FileExportImport from "./pages/FileExportImport.jsx";
import {Charts} from "./pages/Charts.jsx";  // Новый компонент

const App = () => {
    const { user } = useAuthStore(); // Получаем пользователя из хранилища
    useEffect(() => {}, []);

    return (
        <Router>
            <div className="app-container">
                {/* Отображаем Header на всех страницах, кроме страницы регистрации */}
                {window.location.pathname !== '/register' && <Header />}
                <div className="content-container p-6">
                    <Routes>
                        {/* Главная страница с логином или лентой событий */}
                        <Route path="/" element={
                            !user ? (
                                <div className="h-[30vh] flex items-center justify-center">
                                    <LoginForm />
                                </div>
                            ) : (
                                <EventFeed />
                            )
                        } />

                        {/* Маршрут для регистрации */}
                        <Route path="/register" element={
                            <div className="h-[30vh] flex items-center justify-center">
                                <RegisterForm />
                            </div>
                        } />

                        {/* Страница добавления нового события */}
                        <Route path="/event/add" element={<AddEventForm />} />

                        {/* Страница профиля, если пользователь авторизован */}
                        <Route path="/profile" element={user ? <Profile /> : <LoginForm />} />

                        {/* Детали события */}
                        <Route path="/event/:id" element={<EventDetail />} />
                        <Route path="/events/:id" element={<EventDetail />} />

                        {/* Страницы для ролей */}
                        <Route path="/role-change-requests" element={<RoleChangeRequests />} />
                        <Route path="/db-management" element={<FileExportImport />} />
                        <Route path="/my-events" element={<MyEvents />} />
                        <Route path="/subscriptions" element={<SubscriptionFeed />} />
                        <Route path="/events" element={<EventList />} />
                        <Route path="/update-event/:eventId" element={<UpdateEvent />} />
                        <Route path="/charts" element={<Charts />} />
                        <Route path="/logs" element={<BackupsAndLogs />} />

                        {/* Страница 404 - для всех остальных маршрутов */}
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
