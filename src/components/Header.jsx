//src/components/Header.jsx
// src/components/Header.jsx
import { Link } from 'react-router-dom';
import useAuthStore from "../stores/AuthStore.js";  // Для доступа к текущему пользователю

const Header = () => {
    const { user, logout } = useAuthStore();  // Доступ к текущему пользователю и функции выхода

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
                            <li>
                                <Link to="/profile" className="hover:text-gray-300">Профиль</Link>
                            </li>
                            <li>
                                <button onClick={logout} className="hover:text-gray-300">Выйти</button>
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
