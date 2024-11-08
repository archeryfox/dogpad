import React, {useEffect} from 'react';
import useAuthStore from "../stores/AuthStore.js";
import {useNavigate} from "react-router-dom";
import useSubscriptionStore from "../stores/SubscriptionStore.js";
import {format} from "date-fns";

const Profile = () => {
    const {user, logout} = useAuthStore(); // Получаем данные пользователя из хранилища
    const navigate = useNavigate()
    const {subscriptions, fetchSubscriptions, deleteSubscription} = useSubscriptionStore()
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
                console.log('обнова подписки')
                // Здесь произойдет обновление, если subscriptions изменились
            }
        }, 10 * 1000); // интервал в 10 секунд, регулируйте по потребности

        return () => clearInterval(intervalId);
    }, [fetchSubscriptions, subscriptions]);

    const handleLogout = () => {
        logout();
        navigate('/') // Перенаправление на главную страницу (или страницу логина)
    };

    return (
        <div className={`p-10 items-center`}>
            <div className="profile-container h-full  items-center">
                <h1 className="text-3xl font-bold text-center">Профиль пользователя</h1>
                <div className="profile-info">
                    <p><strong>Имя:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    {/* Вывод других данных пользователя, если нужно */}
                    <div className="container mx-auto px-4 py-8">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Мои подписки</h2>
                        <ul className="space-y-6">
                            {user && subscriptions && subscriptions
                                ?.filter(sub => sub.userId === user.id)
                                ?.map(subscription => (
                                    <li key={subscription?.id}
                                        className="bg-white shadow-md rounded-lg p-6 border border-gray-200 transition-shadow">
                                        <div className={`flex items-center justify-between`}>
                                            <div className="">
                                                <p className="text-lg font-semibold text-blue-600 mb-2">Мероприятие: {subscription?.event.name}</p>
                                                <p className="text-gray-600">Дата: {format(new Date(subscription?.event.date), 'dd.MM.yyyy HH:mm')}</p>
                                            </div>
                                            <div>
                                                <button className={`hover:text-white text-red-600 p-5 rounded`}
                                                        onClick={() => {
                                                            let deleting = confirm('Вы уверены?');
                                                            deleting ? deleteSubscription(subscription.id) : null;
                                                        }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                         viewBox="0 0 24 24"
                                                         strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>

                <div className="text-center mt-4">
                    <button onClick={handleLogout} className="py-2 px-4 bg-red-500 text-white rounded-md">
                        Выйти
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
