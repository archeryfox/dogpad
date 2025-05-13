import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
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
import AnimatedPage from "./components/AnimatedPage.jsx";
import { AnimatePresence } from "framer-motion";
import Notification from "./components/ui/Notification.jsx";

// Компонент для анимированного содержимого
const AnimatedRoutes = () => {
    const { user } = useAuthStore(); // Получаем пользователя из хранилища
    const location = useLocation();
    
    // Проверка ролей пользователя
    const isAdmin = user?.role === 'admin';
    const isDbAdmin = user?.role === 'db_admin'; // Добавляем проверку для db_admin
    const isOrganizer = user?.role === 'organizer';
    const isSpeaker = user?.role === 'speaker';

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Главная страница с логином или лентой событий */}
                <Route path="/" element={
                    <AnimatedPage transitionType="fade">
                        {!user ? (
                            <div className="h-[30vh] flex items-center justify-center">
                                <LoginForm />
                            </div>
                        ) : (
                            <EventFeed />
                        )}
                    </AnimatedPage>
                } />

                {/* Маршрут для регистрации */}
                <Route path="/register" element={
                    <AnimatedPage transitionType="slideUp">
                        <div className="h-[30vh] flex items-center justify-center">
                            <RegisterForm />
                        </div>
                    </AnimatedPage>
                } />

                {/* Страница добавления нового события доступна только организаторам */}
                <Route path="/event/add" element={
                    <AnimatedPage transitionType="scale">
                        {isOrganizer ? <AddEventForm /> : <NotFoundPage />}
                    </AnimatedPage>
                } />

                {/* Страница профиля доступна для всех авторизованных пользователей */}
                <Route path="/profile" element={
                    <AnimatedPage transitionType="slideRight">
                        {user ? <Profile /> : <LoginForm />}
                    </AnimatedPage>
                } />

                {/* Детали события */}
                <Route path="/event/:id" element={
                    <AnimatedPage transitionType="scale">
                        <EventDetail />
                    </AnimatedPage>
                } />
                <Route path="/events/:id" element={
                    <AnimatedPage transitionType="scale">
                        <EventDetail />
                    </AnimatedPage>
                } />

                {/* Страницы для ролей */}
                {/* Доступ к запросам на смену роли только для администраторов */}
                <Route path="/role-change-requests" element={
                    <AnimatedPage transitionType="rotate">
                        {isAdmin || isDbAdmin ? <RoleChangeRequests /> : <NotFoundPage />}
                    </AnimatedPage>
                } />

                {/* Страница управления базой данных только для администраторов базы данных */}
                <Route path="/db-management" element={
                    <AnimatedPage transitionType="slideUp">
                        {isDbAdmin ? <FileExportImport /> : <NotFoundPage />}
                    </AnimatedPage>
                } />

                {/* Мои события доступны организаторам */}
                <Route path="/my-events" element={
                    <AnimatedPage transitionType="slideRight">
                        {isOrganizer ? <MyEvents /> : <NotFoundPage />}
                    </AnimatedPage>
                } />

                {/* Мои сессии доступны только спикерам */}
                <Route path="/my-sessions" element={
                    <AnimatedPage transitionType="slideRight">
                        {isSpeaker ? <MySessions /> : <NotFoundPage />}
                    </AnimatedPage>
                } />

                {/* Страница подписок доступна всем пользователям */}
                <Route path="/subscriptions" element={
                    <AnimatedPage transitionType="slideUp">
                        <SubscriptionFeed />
                    </AnimatedPage>
                } />

                {/* Страница списка событий доступна всем */}
                <Route path="/events" element={
                    <AnimatedPage transitionType="slideRight">
                        <EventList />
                    </AnimatedPage>
                } />

                {/* Страница обновления события доступна только организатору */}
                <Route path="/update-event/:eventId" element={
                    <AnimatedPage transitionType="scale">
                        {isOrganizer ? <UpdateEvent /> : <NotFoundPage />}
                    </AnimatedPage>
                } />

                {/* Страница с графиками доступна всем */}
                <Route path="/charts" element={
                    <AnimatedPage transitionType="rotate">
                        <Charts />
                    </AnimatedPage>
                } />

                {/* Страница резервного копирования и логов доступна только администратору или администратору базы данных */}
                <Route path="/logs" element={
                    <AnimatedPage transitionType="slideUp">
                        {isAdmin || isDbAdmin ? <BackupsAndLogs /> : <NotFoundPage />}
                    </AnimatedPage>
                } />

                {/* Страница 404 - для всех остальных маршрутов */}
                <Route path="*" element={
                    <AnimatedPage transitionType="fade">
                        <NotFoundPage />
                    </AnimatedPage>
                } />
            </Routes>
        </AnimatePresence>
    );
};

const App = () => {
    useEffect(() => {}, []);

    return (
        <Router>
            <div className="app-container">
                {/* Отображаем Header на всех страницах, кроме страницы регистрации */}
                {window.location.pathname !== '/register' && <Header />}
                <Notification />
                <div className="content-container p-6">
                    <AnimatedRoutes />
                </div>
            </div>
        </Router>
    );
};

export default App;
