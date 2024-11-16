import React, {useEffect, useState, useMemo} from 'react';
import {Bar} from 'react-chartjs-2';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from 'chart.js';
import useVenueStore from '../stores/VenueStore.js';

// Регистрация компонентов для Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const VenueEventChart = () => {
    const [chartData, setChartData] = useState(null);
    const {venues, fetchVenues} = useVenueStore();

    useEffect(() => {
        // Загружаем данные venues
        fetchVenues();
    }, [fetchVenues]);

    useEffect(() => {
        if (venues && venues.length > 0) {
            // Используем setTimeout для асинхронной обработки данных
            setTimeout(() => {
                const transformedData = venues.map(venue => {
                    const totalCategories = venue.events?.reduce((sum, event) => sum + (event._count?.categories || 0), 0);
                    const totalSpeakers = venue.events?.reduce((sum, event) => sum + (event._count?.speakers || 0), 0);
                    const totalSubscriptions = venue.events?.reduce((sum, event) => sum + (event._count?.subscriptions || 0), 0);
                    const totalTransactions = venue.events?.reduce((sum, event) => sum + (event._count?.Transaction || 0), 0);

                    return {
                        name: venue.name,
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
                        },
                        {
                            label: 'Транзакции',
                            data: transformedData.map(item => item.transactions),
                            backgroundColor: 'rgba(153, 102, 255, 0.6)'
                        }
                    ]
                });
            }, 0); // Передача в setTimeout с минимальной задержкой
        }
    }, [venues]);

    const options = useMemo(() => ({
        indexAxis: 'y',
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Статистика мероприятий по местам'
            }
        },
        scales: {
            x: {
                ticks: {
                    callback: function (value) {
                        return Number.isInteger(value) ? value : '';
                    }
                }
            }
        }
    }), []);

    return !chartData ? (
        <p>Загрузка...</p>
    ) : (
        <div className={`w-full flex justify-center h-[70em]`} style={{
            maxHeight: '500px',
            overflowY: 'auto',
        }}>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default VenueEventChart;
