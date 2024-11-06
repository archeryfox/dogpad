// components/UserList.js
import React, { useEffect } from 'react';
import useUserStore from '../stores/UserStore';
import useRoleStore from "../stores/Role.js";

const UserList = () => {
    const { users, fetchUsers, deleteUser } = useUserStore();
    const { roles, fetchRoles } = useRoleStore()
    useEffect(() => {
        fetchUsers();
        fetchRoles()
    }, []);

    const handleDeleteUser = (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            deleteUser(id);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead>
                <tr>
                    <th className="border border-gray-300 px-4 py-2">ID</th>
                    <th className="border border-gray-300 px-4 py-2">Имя</th>
                    <th className="border border-gray-300 px-4 py-2">Email</th>
                    <th className="border border-gray-300 px-4 py-2">Баланс</th>
                    <th className="border border-gray-300 px-4 py-2">Роль</th>
                    <th className="border border-gray-300 px-4 py-2">Действия</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                        <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                        <td className="border border-gray-300 px-4 py-2">{user.balance}</td>
                        <td className="border border-gray-300 px-4 py-2">{user.roleId ? roles?.find(r => r?.id === user?.roleId)?.name : 'Не указана'}</td>
                        <td className="border border-gray-300 px-4 py-2">
                            <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="bg-red-500 text-white py-1 px-3 rounded"
                            >
                                Удалить
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
