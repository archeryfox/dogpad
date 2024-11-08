import React, {useState} from 'react';
import useAuthStore from "../../stores/AuthStore.js";
import {Link} from "react-router-dom";

const RegisterForm = () => {
    const {register, error, loading} = useAuthStore();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        register(name, email, password).then(r => console.log("Регистрация"));
    };

    return (
        <div className={`h-[30vh] m-[15em] items-center`}>
            <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
                <h2 className="text-2xl font-bold text-center">Регистрация</h2>
                <form onSubmit={handleSubmit}>
                    <div className="my-4">
                        <label htmlFor="name" className="block text-sm">Имя пользователя</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>
                    <div className="my-4">
                        <label htmlFor="email" className="block text-sm">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>
                    <div className="my-4">
                        <label htmlFor="password" className="block text-sm">Пароль</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    <button
                        type="submit"
                        className="w-full py-2 mt-4 bg-blue-500 text-white rounded-md"
                        disabled={loading}
                    >
                        {loading ? 'Загрузка...' : 'Зарегистрироваться'}
                    </button>
                </form>
                <div className={`w-full flex justify-center`}>
                    <Link to={'/    '}>Войти</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
