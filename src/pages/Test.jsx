// BackupsAndLogs.jsx
import React, { useEffect, useState } from 'react';
import {routes} from "../stores/axios.js";

const Test = () => {
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
