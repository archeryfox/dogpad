import React, { useEffect, useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import useEventStore from '../stores/EventStore.js';

// Регистрация компонентов для Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EventChart = () => {
    const [chartData, setChartData] = useState(null);
    const { events, fetchEvents } = useEventStore();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchEvents(); // Загружаем данные
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        };

        fetchData(); // Загружаем данные только при монтировании компонента
    }, [fetchEvents]); // Зависимость только от fetchEvents

    // Используем useMemo для вычислений, чтобы избежать перерасчётов при каждом рендере
    const transformedData = useMemo(() => {
        return events.map(event => {
            const totalCategories = event?._count?.categories || 0;
            const totalSpeakers = event?._count?.speakers || 0;
            const totalSubscriptions = event?._count?.subscriptions || 0;
            const totalTransactions = event?._count?.transactions || 0;

            return {
                name: event.name,
                categories: totalCategories,
                speakers: totalSpeakers,
                subscriptions: totalSubscriptions,
                transactions: totalTransactions,
            };
        });
    }, [events]); // Пересчитываем только если events изменяются

    // Генерация данных для графика
    useEffect(() => {
        if (transformedData.length > 0) {
            setChartData({
                labels: transformedData.map(item => item.name),
                datasets: [
                    {
                        label: 'Категории',
                        data: transformedData.map(item => item.categories),
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    },
                    {
                        label: 'Спикеры',
                        data: transformedData.map(item => item.speakers),
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    },
                    {
                        label: 'Подписки',
                        data: transformedData.map(item => item.subscriptions),
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    },
                    {
                        label: 'Транзакции',
                        data: transformedData.map(item => item.transactions),
                        backgroundColor: 'rgba(153, 102, 255, 0.6)',
                    },
                ],
            });
        }
    }, [transformedData]); // Обновляем chartData только при изменении transformedData

    const options = useMemo(() => ({
        indexAxis: 'y',
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Статистика по мероприятиям',
            },
        },
        scales: {
            x: {
                ticks: {
                    callback: function (value) {
                        return value % 1 === 0 ? value : ''; // Показываем только целые значения
                    },
                },
            },
        },
    }), []); // options остаются постоянными

    return chartData ? (
        <div className={`w-full flex justify-center h-[40em]`} style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <Bar data={chartData} options={options} />
        </div>
    ) : (
        <p>Загрузка...</p>
    );
};

export default EventChart;
