// src/components/Header.jsx
import {Link, useNavigate} from 'react-router-dom';
import useAuthStore from "../stores/AuthStore.js";  // Доступ к текущему пользователю
import { motion } from 'framer-motion';

const Header = () => {
    const {user, logout} = useAuthStore();  // Доступ к текущему пользователю и функции выхода
    const navigate = useNavigate();  // Хук для навигации

    // Анимации для навигационных элементов
    const navItemVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0 }
    };

    // Анимация для контейнера навигации
    const navContainerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    return (
        <motion.header 
            className="bg-blue-600 text-white p-4 flex justify-between items-center"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div 
                className="text-xl font-semibold"
                whileHover={{ scale: 1.05 }}
            >
                <Link to="/" className="hover:text-gray-300">Dogpad</Link> {/* Название платформы */}
            </motion.div>
            <motion.nav
                variants={navContainerVariants}
                initial="hidden"
                animate="visible"
            >
                <ul className="flex space-x-4">
                    <motion.li variants={navItemVariants} whileHover={{ scale: 1.1 }}>
                        <Link to="/" className="hover:text-gray-300">Главная</Link>
                    </motion.li>
                    {user ? (
                        <>
                            {/* Общие ссылки для всех авторизованных пользователей */}
                            <motion.li variants={navItemVariants} whileHover={{ scale: 1.1 }}>
                                <Link to="/profile" className="hover:text-gray-300">Профиль</Link>
                            </motion.li>
                            {/* Ссылки для конкретных ролей */}
                            {user.role === 'user' && (
                                <>
                                    <motion.li variants={navItemVariants} whileHover={{ scale: 1.1 }}>
                                        <Link to="/subscriptions" className="hover:text-gray-300">Подписки</Link>
                                    </motion.li>
                                </>
                            )}
                            {user.role === 'admin' && (
                                <>
                                    <motion.li variants={navItemVariants} whileHover={{ scale: 1.1 }}>
                                        <Link to="/role-change-requests" className="hover:text-gray-300">Запросы на смену роли</Link>
                                    </motion.li>
                                    <motion.li variants={navItemVariants} whileHover={{ scale: 1.1 }}>
                                        <Link to="/charts" className="hover:text-gray-300">Диаграммы</Link>
                                    </motion.li>
                                </>
                            )}
                            {user.role === 'db_admin' && (
                                <>
                                    <motion.li variants={navItemVariants} whileHover={{ scale: 1.1 }}>
                                        <Link to="/db-management" className="hover:text-gray-300">Управление БД</Link>
                                    </motion.li>
                                    <motion.li variants={navItemVariants} whileHover={{ scale: 1.1 }}>
                                        <Link to="/logs" className="hover:text-gray-300">Логи</Link>
                                    </motion.li>
                                    <motion.li variants={navItemVariants} whileHover={{ scale: 1.1 }}>
                                        <Link to="/role-change-requests" className="hover:text-gray-300">Управление запросами на роли</Link>
                                    </motion.li>
                                    <motion.li variants={navItemVariants} whileHover={{ scale: 1.1 }}>
                                        <Link to="/charts" className="hover:text-gray-300">Диаграммы</Link>
                                    </motion.li>
                                </>
                            )}
                            {user.role === 'organizer' && (
                                <>
                                    <motion.li variants={navItemVariants} whileHover={{ scale: 1.1 }}>
                                        <Link to="/my-events" className="hover:text-gray-300">Мои мероприятия</Link>
                                    </motion.li>
                                    <motion.li variants={navItemVariants} whileHover={{ scale: 1.1 }}>
                                        <Link to="/event/add" className="hover:text-gray-300">Создать мероприятие</Link>
                                    </motion.li>
                                    <motion.li variants={navItemVariants} whileHover={{ scale: 1.1 }}>
                                        <Link to="/charts" className="hover:text-gray-300">Диаграммы</Link>
                                    </motion.li>
                                </>
                            )}
                            {user.role === 'speaker' && (
                                <>
                                    <motion.li variants={navItemVariants} whileHover={{ scale: 1.1 }}>
                                        <Link to="/my-sessions" className="hover:text-gray-300">Мои сессии</Link>
                                    </motion.li>
                                </>
                            )}
                            <motion.li variants={navItemVariants} whileHover={{ scale: 1.1 }}>
                                <motion.button
                                    onClick={() => {
                                        logout();
                                        navigate('/');  // Навигация после выхода
                                    }}
                                    className="hover:text-gray-300 px-1 rounded"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Выйти
                                </motion.button>
                            </motion.li>
                        </>
                    ) : (
                        <motion.li variants={navItemVariants} whileHover={{ scale: 1.1 }}>
                            <Link to="/register" className="hover:text-gray-300">Регистрация</Link>
                        </motion.li>
                    )}
                </ul>
            </motion.nav>
        </motion.header>
    );
};

export default Header;
