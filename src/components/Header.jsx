// src/components/Header.jsx
import {Link, useNavigate} from 'react-router-dom';
import useAuthStore from "../stores/AuthStore.js";  // Доступ к текущему пользователю

const Header = () => {
    const {user, logout} = useAuthStore();  // Доступ к текущему пользователю и функции выхода
    const navigate = useNavigate();  // Хук для навигации

    return (
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <div className="text-xl font-semibold">
                <Link to="/" className="hover:text-gray-300">Dogpad</Link> {/* Название платформы */}
            </div>
            <nav>
                <ul className="flex space-x-4">
                    <li>
                        <Link to="/" className="hover:text-gray-300">Главная</Link>
                    </li>
                    {user ? (
                        <>
                            {/* Общие ссылки для всех авторизованных пользователей */}
                            <li>
                                <Link to="/profile" className="hover:text-gray-300">Профиль</Link>
                            </li>
                            {/* Ссылки для конкретных ролей */}
                            {user.role === 'user' && (
                                <>
                                    <li>
                                        <Link to="/subscriptions" className="hover:text-gray-300">Подписки</Link>
                                    </li>
                                </>
                            )}
                            {user.role === 'admin' && (
                                <>
                                    <li>
                                        <Link to="/role-change-requests" className="hover:text-gray-300">Запросы на смену роли</Link>
                                    </li>
                                    <li>
                                        <Link to="/charts" className="hover:text-gray-300">Диаграммы</Link>
                                    </li>
                                </>
                            )}
                            {user.role === 'db_admin' && (
                                <>
                                    <li>
                                        <Link to="/db-management" className="hover:text-gray-300">Управление БД</Link>
                                    </li>
                                    <li>
                                        <Link to="/logs" className="hover:text-gray-300">Логи</Link>
                                    </li>
                                    <li>
                                        <Link to="/role-change-requests" className="hover:text-gray-300">Управление запросами на роли</Link>
                                    </li>
                                    <li>
                                        <Link to="/charts" className="hover:text-gray-300">Диаграммы</Link>
                                    </li>
                                </>
                            )}
                            {user.role === 'organizer' && (
                                <>
                                    <li>
                                        <Link to="/my-events" className="hover:text-gray-300">Мои мероприятия</Link>
                                    </li>
                                    <li>
                                        <Link to="/event/add" className="hover:text-gray-300">Создать мероприятие</Link>
                                    </li>
                                    <li>
                                        <Link to="/charts" className="hover:text-gray-300">Диаграммы</Link>
                                    </li>
                                </>
                            )}
                            {user.role === 'speaker' && (
                                <>
                                    <li>
                                        <Link to="/my-sessions" className="hover:text-gray-300">Мои сессии</Link>
                                    </li>
                                </>
                            )}
                            <li>
                                <button
                                    onClick={() => {
                                        logout();
                                        navigate('/');  // Навигация после выхода
                                    }}
                                    className="hover:text-gray-300 px-1 rounded"
                                >
                                    Выйти
                                </button>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link to="/register" className="hover:text-gray-300">Регистрация</Link>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
