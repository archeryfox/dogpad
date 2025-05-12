import React, {useState} from 'react';
import useAuthStore from '../../stores/AuthStore.js';
import {Link} from "react-router-dom";
import { motion } from 'framer-motion';

const LoginForm = () => {
    const {login, error, loading} = useAuthStore();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        login(name, password);
    };

    // Анимации для формы
    const formVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    // Анимации для полей ввода
    const inputVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { 
                duration: 0.5
            }
        }
    };

    // Анимации для кнопки
    const buttonVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: { 
                delay: 0.3,
                duration: 0.5
            }
        },
        hover: { 
            scale: 1.05,
            backgroundColor: "#2563EB",
            transition: { duration: 0.2 }
        },
        tap: { scale: 0.95 }
    };

    return (
        <div className={`h-[30vh] m-[15em] items-center`}>
            <motion.div 
                className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md"
                initial="hidden"
                animate="visible"
                variants={formVariants}
            >
                <motion.h2 
                    className="text-2xl font-bold text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    Авторизация
                </motion.h2>
                <form onSubmit={handleSubmit}>
                    <motion.div 
                        className="my-4"
                        variants={inputVariants}
                    >
                        <label htmlFor="name" className="block text-sm">Имя пользователя</label>
                        <motion.input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            required
                            whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
                        />
                    </motion.div>
                    <motion.div 
                        className="my-4"
                        variants={inputVariants}
                        transition={{ delay: 0.1 }}
                    >
                        <label htmlFor="password" className="block text-sm">Пароль</label>
                        <motion.input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            required
                            whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
                        />
                    </motion.div>
                    {error && (
                        <motion.div 
                            className="text-red-500 text-sm"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            {error}
                        </motion.div>
                    )}
                    <motion.button
                        type="submit"
                        className="w-full py-2 mt-4 bg-blue-500 text-white rounded-md"
                        disabled={loading}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        {loading ? 'Загрузка...' : 'Войти'}
                    </motion.button>
                </form>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 text-center"
                >
                    <Link to={'/register'} className="text-blue-500 hover:underline">
                        Нет аккаунта? Зарегистрируйся
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LoginForm;
