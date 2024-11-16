// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
            <h1 className="text-6xl font-bold text-red-500">404</h1>
            <h2 className="text-2xl mt-4">Страница не найдена</h2>
            <p className="mt-2 text-lg">Кажется, что вы пытаетесь перейти на несуществующую страницу.</p>
            <Link to="/" className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                Вернуться на главную
            </Link>
        </div>
    );
};

export default NotFoundPage;
