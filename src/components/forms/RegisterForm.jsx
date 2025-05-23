import React, { useState } from 'react';
import useAuthStore from "../../stores/AuthStore.js";
import { Link } from "react-router-dom";

// Компонент с анимацией прогресса
const PasswordStrengthBar = ({ password }) => {
    const isLongEnough = password.length >= 6;
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);

    const rulesPassed = [isLongEnough, hasUppercase, hasDigit].filter(Boolean).length;
    const percent = (rulesPassed / 3) * 100;

    let color = 'bg-red-500';
    if (rulesPassed === 2) color = 'bg-yellow-500';
    if (rulesPassed === 3) color = 'bg-green-500';

    return (
        <div className="mt-2">
            <div className="w-full h-2 bg-gray-200 rounded">
                <div
                    className={`h-2 ${color} rounded transition-all duration-500 ease-in-out`}
                    style={{ width: `${percent}%` }}
                />
            </div>
            <ul className="text-xs mt-2 space-y-1">
                <li className={isLongEnough ? 'text-green-600' : 'text-red-600'}>
                    • Минимум 6 символов
                </li>
                <li className={hasUppercase ? 'text-green-600' : 'text-red-600'}>
                    • Одна заглавная буква
                </li>
                <li className={hasDigit ? 'text-green-600' : 'text-red-600'}>
                    • Одна цифра
                </li>
            </ul>
        </div>
    );
};

const RegisterForm = () => {
    const { register, error, loading } = useAuthStore();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const isLongEnough = password.length >= 6;
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const isPasswordValid = isLongEnough && hasUppercase && hasDigit;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isPasswordValid) return;
        register(name, email, password).then(() =>
            console.log("Регистрация")
        );
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
                            className={`w-full p-2 border rounded-md ${
                                !isPasswordValid && password ? 'border-red-500' : ''
                            }`}
                            required
                        />
                        <PasswordStrengthBar password={password} />
                    </div>
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    <button
                        type="submit"
                        className={`w-full py-2 mt-4 text-white rounded-md ${
                            isPasswordValid ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
                        } transition-all duration-300`}
                        disabled={!isPasswordValid || loading}
                    >
                        {loading ? 'Загрузка...' : 'Зарегистрироваться'}
                    </button>
                </form>
                <div className={`w-full flex justify-center`}>
                    <Link to={'/'}>Войти</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
