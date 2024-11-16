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
import {Charts} from "./pages/Charts.jsx";
import MySessions from "./pages/MySessions.jsx";  // Новый компонент

const App = () => {
    const { user } = useAuthStore(); // Получаем пользователя из хранилища
    useEffect(() => {}, []);

    // Проверка ролей пользователя
    const isAdmin = user?.role === 'admin';
    const isDbAdmin = user?.role === 'db_admin'; // Добавляем проверку для db_admin
    const isOrganizer = user?.role === 'organizer';
    const isSpeaker = user?.role === 'speaker';

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

                        {/* Страница добавления нового события доступна только организаторам */}
                        <Route path="/event/add" element={isOrganizer ? <AddEventForm /> : <NotFoundPage />} />

                        {/* Страница профиля доступна для всех авторизованных пользователей */}
                        <Route path="/profile" element={user ? <Profile /> : <LoginForm />} />

                        {/* Детали события */}
                        <Route path="/event/:id" element={<EventDetail />} />
                        <Route path="/events/:id" element={<EventDetail />} />

                        {/* Страницы для ролей */}
                        {/* Доступ к запросам на смену роли только для администраторов */}
                        <Route path="/role-change-requests" element={isAdmin || isDbAdmin ? <RoleChangeRequests /> : <NotFoundPage />} />

                        {/* Страница управления базой данных только для администраторов базы данных */}
                        <Route path="/db-management" element={isDbAdmin  ? <FileExportImport /> : <NotFoundPage />} />

                        {/* Мои события доступны организаторам */}
                        <Route path="/my-events" element={isOrganizer ? <MyEvents /> : <NotFoundPage />} />

                        {/* Мои сессии доступны только спикерам */}
                        <Route path="/my-sessions" element={isSpeaker ? <MySessions /> : <NotFoundPage />} />

                        {/* Страница подписок доступна всем пользователям */}
                        <Route path="/subscriptions" element={<SubscriptionFeed />} />

                        {/* Страница списка событий доступна всем */}
                        <Route path="/events" element={<EventList />} />

                        {/* Страница обновления события доступна только организатору */}
                        <Route path="/update-event/:eventId" element={isOrganizer ? <UpdateEvent /> : <NotFoundPage />} />

                        {/* Страница с графиками доступна всем */}
                        <Route path="/charts" element={<Charts />} />

                        {/* Страница резервного копирования и логов доступна только администратору или администратору базы данных */}
                        <Route path="/logs" element={isAdmin || isDbAdmin ? <BackupsAndLogs /> : <NotFoundPage />} />

                        {/* Страница 404 - для всех остальных маршрутов */}
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
