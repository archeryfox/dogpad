
// components/RoleList.js
import React, { useEffect } from 'react';
import useRoleStore from '../stores/Role';

const RoleList = () => {
    const { roles, fetchRoles, addRole, deleteRole } = useRoleStore()

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleAddRole = () => {
        const name = prompt('Enter role name');
        addRole(name);
    };

    const handleDeleteRole = (id) => {
        if (window.confirm('Are you sure you want to delete this role?')) {
            deleteRole(id);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <button
                onClick={handleAddRole}
                className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
            >
                Add Role
            </button>
            <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead>
                <tr>
                    <th className="border border-gray-300 px-4 py-2">Role Name</th>
                    <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {roles.map((role) => (
                    <tr key={role.id}>
                        <td className="border border-gray-300 px-4 py-2">{role.name}</td>
                        <td className="border border-gray-300 px-4 py-2">
                            <button
                                onClick={() => handleDeleteRole(role.id)}
                                className="bg-red-500 text-white py-1 px-3 rounded"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default RoleList;
