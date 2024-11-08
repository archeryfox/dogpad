import React, {useEffect, useState} from 'react';
import {Bar} from 'react-chartjs-2';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from 'chart.js';
import useEventStore from '../stores/EventStore.js'; // Подключаем store для событий

// Регистрация масштабов и других необходимых компонентов для Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EventChart = () => {
    const [chartData, setChartData] = useState(null);
    const {events, fetchEvents} = useEventStore(); // Делаем запрос к событиям через store

    useEffect(() => {
        fetchEvents();
        const fetchData = async () => {
            const transformedData = events.map(event => {
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

            setChartData({
                labels: transformedData.map(item => item.name),
                datasets: [
                    {
                        label: 'Категории',
                        data: transformedData.map(item => item.categories),
                        backgroundColor: 'rgba(255, 99, 132, 0.6)'
                    },
                    {
                        label: 'Спикеры',
                        data: transformedData.map(item => item.speakers),
                        backgroundColor: 'rgba(54, 162, 235, 0.6)'
                    },
                    {
                        label: 'Подписки',
                        data: transformedData.map(item => item.subscriptions),
                        backgroundColor: 'rgba(75, 192, 192, 0.6)'
                    }
                ]
            });
        };

        fetchData();
    }, []);

    return chartData ? (
        <div className={`w-full flex justify-center h-[40em]`} style={{
            maxHeight: '500px', // Задайте фиксированную высоту для контейнера
            overflowY: 'auto', // Включаем вертикальную прокрутку
        }}>
            <Bar
                data={chartData}
                options={{
                    indexAxis: 'y', // Переключаем график в горизонтальную ориентацию
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Статистика по мероприятиям'
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                callback: function(value) {
                                    return value % 1 === 0 ? value : ''; // Отображаем только целые числа на оси X
                                }
                            }
                        }
                    }
                }}
            />
        </div>
    ) : (
        <p>Загрузка...</p>
    );
};

export default EventChart;
