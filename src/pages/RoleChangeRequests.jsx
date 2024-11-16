// src/pages/RoleChangeRequests.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import {api, routes} from "../stores/axios.js";

const RoleChangeRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Функция для получения списка запросов
    const fetchRequests = async () => {
        try {
            const response = await api.get('/role-change-requests');
            setRequests(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Ошибка при загрузке запросов:", error);
            setLoading(false);
        }
    };

    // Функция для обработки запроса (одобрение или отклонение)
    const handleRequest = async (id, action) => {
        try {
            await api.put(`/role-change-requests/${id}`, { action });
            // Обновление списка запросов после обработки
            setRequests(requests.filter(request => request.id !== id));
        } catch (error) {
            console.error(`Ошибка при обработке запроса с ID ${id}:`, error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    if (loading) return <p>Загрузка запросов...</p>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Запросы на смену роли</h2>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                <tr>
                    <th className="py-2 px-4 border-b">Пользователь</th>
                    <th className="py-2 px-4 border-b">Текущая роль</th>
                    <th className="py-2 px-4 border-b">Время запроса</th>
                    <th className="py-2 px-4 border-b">Запрашиваемая роль</th>
                    <th className="py-2 px-4 border-b">Статус</th>
                    <th className="py-2 px-4 border-b">Действия</th>
                </tr>
                </thead>
                <tbody>
                {requests.map(request => (
                    <tr key={request.id}>
                        <td className={`py-2 px-4 border-b`}>{request.user.name} ({request.user.email})</td>
                        <td className={`py-2 px-4 border-b`}>{request.user.roleId}</td>
                        <td className={`py-2 px-4 border-b`}>
                            {new Date(request.createdAt).toLocaleString()}</td>
                        <td className={`py-2 px-4 border-b`}>{request.role.name}</td>

                        {/* Покраска в зависимости от статуса */}
                        <td className={`py-2 px-4 border-b ${
                            request.status === 'approved' ? 'bg-green-500 text-white' :
                                request.status === 'rejected' ? 'bg-red-500 text-white' :
                                    request.status === 'pending' ? 'bg-yellow-500 text-white' :
                                        'bg-gray-500 text-white'
                        }`}>
                            {request.status}
                        </td>

                        <td className={`py-2 px-4 border-b`}>
                            <button
                                className="bg-green-500 text-white px-2 py-1 mr-2 rounded"
                                onClick={() => handleRequest(request.id, 'approve')}
                            >
                                Одобрить
                            </button>
                            <button
                                className="bg-red-500 text-white px-2 py-1 rounded"
                                onClick={() => handleRequest(request.id, 'reject')}
                            >
                                Отклонить
                            </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RoleChangeRequests;
