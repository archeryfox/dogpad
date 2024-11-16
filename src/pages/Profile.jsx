import React, { useEffect, useState } from 'react';
import useAuthStore from "../stores/AuthStore.js";
import { useNavigate } from "react-router-dom";
import useSubscriptionStore from "../stores/SubscriptionStore.js";
import SubscriptionFeed from "./SubscriptionFeed.jsx";
import SpeakerProfile from "./SpeakerProfile.jsx";

const Profile = ({ picSize = 14 }) => {
    const { user, logout, updateUser, requestRoleChange, fetchUpdatedUser } = useAuthStore();
    const navigate = useNavigate();
    const { subscriptions, fetchSubscriptions } = useSubscriptionStore();

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        roleId: user?.roleId || 1,
        avatar: user?.avatar || '',
    });
    const [roleChangeStatus, setRoleChangeStatus] = useState(null); // Статус изменения роли

    useEffect(() => {
        // Получаем подписки
        fetchSubscriptions();

        // Проверяем статус изменения роли (если есть)
        const checkRoleChangeStatus = () => {
            if (user?.roleId !== editData.roleId) {
                setRoleChangeStatus("В обработке");
            } else {
                setRoleChangeStatus(null); // сбрасываем статус
            }
        };

        checkRoleChangeStatus();
        fetchUpdatedUser()
        const intervalId = setInterval(async () => {
            const previousSubscriptions = subscriptions;
            await fetchSubscriptions();
            if (JSON.stringify(subscriptions) !== JSON.stringify(previousSubscriptions)) {
                console.log('обновлены подписки');
            }
        }, 100 * 1000);

        return () => clearInterval(intervalId);
    }, [editData.roleId]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSaveChanges = async () => {
        // Если роль изменена, отправляем запрос на смену роли
        if (editData.roleId !== user.roleId) {
            await requestRoleChange(user.id, editData.roleId);
            setRoleChangeStatus("В обработке"); // Устанавливаем статус "В обработке"
        }
        await updateUser(editData, user.id); // Обновляем остальные данные профиля
        setIsEditing(false);
    };

    if (!user) {
        return <div className="text-center">Пожалуйста, войдите в систему.</div>;
    }

    function localRole(role) {
        const rs = {
            "user": "Пользователь",
            'admin': 'Админ',
            'speaker': 'Спикер',
            'organizer': 'Организатор',
            'db_admin': 'Админ базы данных'
        }
        return rs[role];
    }

    return (
        <div className="p-10 items-center">
            <div className="profile-container h-full items-center">
                <h1 className="text-3xl font-bold text-center mb-6">Профиль пользователя</h1>

                <div className="profile-info bg-white rounded-lg p-6 mb-6">
                    <div className="flex flex-row-reverse items-start mb-4">
                        {/* Профиль спикера справа */}
                        <div className="ml-8 w-1/3">
                            {user?.Speaker?.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-semibold mb-2">Профиль спикера</h2>
                                    <SpeakerProfile speaker={user?.Speaker[0]}/>
                                </div>
                            )}
                        </div>

                        {/* Информация о пользователе слева */}
                        <div className="w-2/3">
                            <div className="flex items-center mb-4">
                                {editData.avatar ? (
                                    <img src={editData.avatar} alt="Avatar"
                                         style={{height: `${picSize}em`, width: `${picSize}em`}}
                                         className="rounded-full object-cover mr-4"/>
                                ) : (
                                    <div
                                        className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-white mr-4">
                                        <span className="text-xl">{user.name.charAt(0).toUpperCase()}</span>
                                    </div>
                                )}

                                <div>
                                    {isEditing ? (
                                        <>
                                            <input
                                                type="text"
                                                name="name"
                                                value={editData.name}
                                                onChange={handleInputChange}
                                                className="border rounded p-2 mb-2 w-full"
                                                placeholder="Имя"
                                            />
                                            <input
                                                type="email"
                                                name="email"
                                                value={editData.email}
                                                onChange={handleInputChange}
                                                className="border rounded p-2 mb-2 w-full"
                                                placeholder="Почта"
                                            />
                                            <select
                                                name="roleId"
                                                value={editData.roleId}
                                                onChange={handleInputChange}
                                                className="border rounded p-2 mb-2 w-full"
                                            >
                                                <option value="">Выберите роль</option>
                                                <option value="1">Пользователь</option>
                                                <option value="2">Администратор</option>
                                                <option value="3">Спикер</option>
                                                <option value="4">Организатор</option>
                                                <option value="5">DB Админ</option>
                                            </select>
                                            <input
                                                type="url"
                                                onChange={handleInputChange}
                                                value={editData.avatar}
                                                name="avatar"
                                                className="border rounded p-2 mb-2 w-full"
                                                placeholder="Аватарка(URL)"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-lg font-semibold"><b>Имя: </b>{user.name}</p>
                                            <p className="text-gray-600"><b>Почта:</b> {user.email}</p>
                                            <p className="text-gray-600 mt-2"><strong>Баланс:</strong> {user.balance}₽
                                            </p>
                                            <p className="text-gray-600 mt-2">
                                                <strong>Роль:</strong> {localRole(user.role) || 'Не указана'}</p>
                                            {roleChangeStatus && (
                                                <p className="text-yellow-500 mt-1"><strong>Статус запроса на смену
                                                    роли:</strong> {roleChangeStatus}</p>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center flex space-x-2">
                        {isEditing ? (
                            <>
                                <button onClick={handleSaveChanges}
                                        className="py-2 px-4 bg-green-500 text-white rounded-md">
                                    Сохранить
                                </button>
                                <button onClick={handleEditToggle}
                                        className="py-2 px-4 bg-gray-500 text-white rounded-md">
                                    Отменить
                                </button>
                            </>
                        ) : (
                            <button onClick={handleEditToggle} className="py-2 px-4 bg-blue-500 text-white rounded-md">
                                Редактировать
                            </button>
                        )}
                        <button onClick={handleLogout} className="py-2 px-4 bg-red-500 text-white rounded-md">
                            Выйти
                        </button>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <SubscriptionFeed inProfile={true}/>
                </div>
            </div>
        </div>
    );
};

export default Profile;
