import React, {useEffect} from 'react';
import useAuthStore from "../stores/AuthStore.js";
import {useNavigate} from "react-router-dom";
import useSubscriptionStore from "../stores/SubscriptionStore.js";
import {format} from "date-fns";
import SubscriptionFeed from "./SubscriptionFeed.jsx";






const Profile = ({picSize = 14}) => {
    const {user, logout} = useAuthStore(); // Получаем данные пользователя из хранилища
    const navigate = useNavigate();
    const {subscriptions, fetchSubscriptions, deleteSubscription} = useSubscriptionStore();

    if (!user) {
        return <div className="text-center">Пожалуйста, войдите в систему.</div>;
    }

    useEffect(() => {
        fetchSubscriptions();
        const intervalId = setInterval(async () => {
            const previousSubscriptions = subscriptions;
            await fetchSubscriptions();

            // Проверка на изменения данных
            if (JSON.stringify(subscriptions) !== JSON.stringify(previousSubscriptions)) {
                console.log('обнова подписки');
                // Здесь произойдет обновление, если subscriptions изменились
            }
        }, 100 * 1000); // интервал в 10 секунд, регулируйте по потребности

        return () => clearInterval(intervalId);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/'); // Перенаправление на главную страницу (или страницу логина)
    };

    return (
        <div className="p-10 items-center">

            <div className="profile-container h-full items-center">
                <h1 className="text-3xl font-bold text-center mb-6">Профиль пользователя</h1>
                <div className="profile-info bg-white  rounded-lg p-6 mb-6">
                    <div className="flex items-center mb-4">
                        {user.avatar ? (
                            <img src={user.avatar} alt="Avatar" style={{height:`${picSize}em`, width: `${picSize}em`}} className={`rounded-full object-cover mr-4`}/>
                        ) : (
                            <div
                                className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-white mr-4">
                                <span className="text-xl">{user.name.charAt(0).toUpperCase()}</span>
                            </div>
                        )}
                        <div>
                            <p className="text-lg font-semibold"><b>Имя: </b>{user.name}</p>
                            <p className="text-gray-600"><b>Почта:</b> {user.email}</p>
                            <p className="text-gray-600 mt-2">
                                <strong>Баланс:</strong> {user.balance}₽
                            </p>
                            <p className="text-gray-600 mt-2">
                                <strong>Роль:</strong> {user.role ? user.role : 'Не указана'}
                            </p>
                        </div>
                    </div>
                    <div className="text-center flex">
                        <button onClick={handleLogout} className="py-2 px-4 bg-red-500 text-white rounded-md">
                            Выйти
                        </button>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <SubscriptionFeed/>
                </div>
            </div>
        </div>
    );
};

export default Profile;
