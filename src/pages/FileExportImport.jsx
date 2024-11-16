import React, { useState } from 'react';
import axios from 'axios';
import {api} from "../stores/axios.js";

const FileExportImport = () => {
    const [csvFile, setCsvFile] = useState(null);
    const [sqlFile, setSqlFile] = useState(null);

    const handleFileChange = (event, type) => {
        const file = event.target.files[0];
        if (type === 'csv') {
            setCsvFile(file);
        } else if (type === 'sql') {
            setSqlFile(file);
        }
    };

    const handleExport = async (entity, type) => {
        try {
            const response = await api.get(`/${entity}/export-${type}`, { responseType: 'blob' });
            const file = new Blob([response.data], { type: 'application/octet-stream' });
            const fileURL = URL.createObjectURL(file);
            const a = document.createElement('a');
            a.href = fileURL;
            a.download = `${entity}-export.${type}`;
            a.click();
        } catch (error) {
            console.error(`Error exporting ${entity} ${type}:`, error);
        }
    };

    const handleImport = async (entity, type) => {
        let formData = new FormData();
        if (!csvFile && type === 'csv') {
            alert('Выберите CSV файл для загрузки!');
            return;
        }
        if (!sqlFile && type === 'sql') {
            alert('Выберите SQL файл для загрузки!');
            return;
        }
        if (type === 'csv' && csvFile) {
            formData.append('file', csvFile);
        } else if (type === 'sql' && sqlFile) {
            formData.append('file', sqlFile);
        } else {
            alert('Пожалуйста, выберите файл для загрузки!');
            return; // Остановить выполнение, если файл не выбран
        }

        try {
            const response = await axios.post(`/${entity}/import-${type}`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            alert(response.data.message || `${type} файл успешно загружен.`);
        } catch (error) {
            console.error(`Error importing ${entity} ${type}:`, error);
        }
    };


    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-6 text-center">Экспорт/Импорт данных</h2>

            {/* Экспорт событий */}
            <div className="mb-6">
                <h3 className="text-xl font-medium mb-4">Экспорт событий</h3>
                <div className="flex justify-around mb-4">
                    <button
                        onClick={() => handleExport('events', 'csv')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                    >
                        Скачать CSV
                    </button>
                    <button
                        onClick={() => handleExport('events', 'sql')}
                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
                    >
                        Скачать SQL
                    </button>
                </div>
            </div>

            {/* Экспорт пользователей */}
            <div className="mb-6">
                <h3 className="text-xl font-medium mb-4">Экспорт пользователей</h3>
                <div className="flex justify-around mb-4">
                    <button
                        onClick={() => handleExport('users', 'csv')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                    >
                        Скачать CSV
                    </button>
                    <button
                        onClick={() => handleExport('users', 'sql')}
                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
                    >
                        Скачать SQL
                    </button>
                </div>
            </div>

            {/* Импорт событий */}
            <div>
                <h3 className="text-xl font-medium mb-4">Импорт событий</h3>
                <div className="flex justify-around mb-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Загрузить CSV</label>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={(e) => handleFileChange(e, 'csv')}
                            className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Загрузить SQL</label>
                        <input
                            type="file"
                            accept=".sql"
                            onChange={(e) => handleFileChange(e, 'sql')}
                            className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                </div>

                <div className="flex justify-around">
                    <button
                        onClick={() => handleImport('events', 'csv')}
                        className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition duration-300"
                    >
                        Импортировать CSV
                    </button>
                    <button
                        onClick={() => handleImport('events', 'sql')}
                        className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
                    >
                        Импортировать SQL
                    </button>
                </div>
            </div>

            {/* Импорт пользователей */}
            <div className="mt-6">
                <h3 className="text-xl font-medium mb-4">Импорт пользователей</h3>
                <div className="flex justify-around mb-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Загрузить CSV</label>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={(e) => handleFileChange(e, 'csv')}
                            className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Загрузить SQL</label>
                        <input
                            type="file"
                            accept=".sql"
                            onChange={(e) => handleFileChange(e, 'sql')}
                            className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                </div>

                <div className="flex justify-around">
                    <button
                        onClick={() => handleImport('users', 'csv')}
                        className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition duration-300"
                    >
                        Импортировать CSV
                    </button>
                    <button
                        onClick={() => handleImport('users', 'sql')}
                        className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
                    >
                        Импортировать SQL
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FileExportImport;
