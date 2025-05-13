import React, { useState } from 'react';
import axios from 'axios';
import {api} from "../stores/axios.js";
import useNotificationStore from '../stores/NotificationStore';

const FileExportImport = () => {
    const [csvFile, setCsvFile] = useState(null);
    const [sqlFile, setSqlFile] = useState(null);
    const [isExporting, setIsExporting] = useState(false);
    const [exportError, setExportError] = useState(null);
    const { showNotification } = useNotificationStore();

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

    const handleDatabaseBackup = async () => {
        setIsExporting(true);
        setExportError(null);
        try {
            // Запрос к бэкенду для создания резервной копии базы данных
            const response = await api.get('/database/backup', { responseType: 'blob' });
            
            // Создаем файл из полученных данных
            const file = new Blob([response.data], { type: 'application/sql' });
            const fileURL = URL.createObjectURL(file);
            
            // Создаем ссылку для скачивания и автоматически кликаем по ней
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const a = document.createElement('a');
            a.href = fileURL;
            a.download = `database_backup_${timestamp}.sql`;
            a.click();
            
            // Освобождаем URL объект
            setTimeout(() => {
                URL.revokeObjectURL(fileURL);
            }, 100);
        } catch (error) {
            console.error('Ошибка при экспорте базы данных:', error);
            setExportError('Не удалось создать резервную копию базы данных. Пожалуйста, попробуйте позже.');
        } finally {
            setIsExporting(false);
        }
    };

    const handleImport = async (entity, type) => {
        let formData = new FormData();
        if (!csvFile && type === 'csv') {
            showNotification('Выберите CSV файл для загрузки!', 'warning');
            return;
        }
        if (!sqlFile && type === 'sql') {
            showNotification('Выберите SQL файл для загрузки!', 'warning');
            return;
        }
        if (type === 'csv' && csvFile) {
            formData.append('file', csvFile);
        } else if (type === 'sql' && sqlFile) {
            formData.append('file', sqlFile);
        } else {
            showNotification('Пожалуйста, выберите файл для загрузки!', 'warning');
            return; // Остановить выполнение, если файл не выбран
        }

        try {
            const response = await axios.post(`/${entity}/import-${type}`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            showNotification(response.data.message || `${type} файл успешно загружен.`, 'success');
        } catch (error) {
            console.error(`Error importing ${entity} ${type}:`, error);
            showNotification(`Ошибка при загрузке ${type} файла: ${error.message}`, 'error');
        }
    };


    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-6 text-center">Экспорт/Импорт данных</h2>

            {/* Экспорт базы данных */}
            <div className="mb-8 p-4 border border-blue-200 rounded-lg bg-blue-50">
                <h3 className="text-xl font-medium mb-4 text-blue-800">Экспорт всей базы данных</h3>
                <div className="flex flex-col items-center">
                    <button
                        onClick={handleDatabaseBackup}
                        disabled={isExporting}
                        className={`px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isExporting ? 'Создание резервной копии...' : 'Скачать резервную копию базы данных (SQL)'}
                    </button>
                    {exportError && (
                        <p className="mt-2 text-red-600">{exportError}</p>
                    )}
                    <p className="mt-4 text-sm text-gray-600 text-center">
                        Эта функция создаст полную резервную копию базы данных в формате SQL, 
                        которую можно использовать для восстановления данных.
                    </p>
                </div>
            </div>

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
