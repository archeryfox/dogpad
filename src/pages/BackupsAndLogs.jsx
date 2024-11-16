// BackupsAndLogs.jsx
import React, { useEffect, useState } from 'react';
import {routes} from "../stores/axios.js";

const BackupsAndLogs = () => {
    const [logs, setLogs] = useState([]);
    const [backups, setBackups] = useState([]);
    const [loading, setLoading] = useState(true);

    // Функция для загрузки данных с сервера
    const fetchData = async () => {
        try {
            const logsResponse = await fetch(routes.logs);
            const logsData = await logsResponse.json();
            setLogs(logsData);

            const backupsResponse = await fetch(routes.backups);
            const backupsData = await backupsResponse.json();
            setBackups(backupsData);

            setLoading(false);
        } catch (error) {
            console.error('Ошибка при загрузке логов и бэкапов:', error);
        }
    };

    // Загрузка данных при монтировании компонента
    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <p>Загрузка...</p>;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Логи и Бекапы</h2>
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Лог-файлы:</h3>
                {logs.length > 0 ? (
                    <ul className="list-disc list-inside">
                        {logs.map((log, index) => (
                            <li key={index}>
                                <a
                                    href={log}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    {log.split('/').pop()}
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Логи не найдены</p>
                )}
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-2">Файлы бекапа:</h3>
                {backups.length > 0 ? (
                    <ul className="list-disc list-inside">
                        {backups.map((backup, index) => (
                            <li key={index}>
                                <a
                                    href={backup}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-500 hover:underline"
                                >
                                    {backup.split('/').pop()}
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Бекапы не найдены</p>
                )}
            </div>
        </div>
    );
};

export default BackupsAndLogs;
