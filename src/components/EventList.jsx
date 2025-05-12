import React, { useEffect, useState } from 'react';
import useEventsStore from '../stores/EventStore.js';
import { motion } from 'framer-motion';
import '../index.css'

const EventList = () => {
    const {events, fetchEvents} = useEventsStore();
    const [displayEvents, setDisplayEvents] = useState([]);

    useEffect(() => {
        fetchEvents();
        if (events && events.length > 0) {
            setDisplayEvents(events);
        }
    }, [events, fetchEvents]);

    // Анимации для контейнера
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    // Анимации для элементов списка
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { 
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        },
        hover: {
            y: -5,
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            transition: { 
                type: "spring",
                stiffness: 400,
                damping: 10
            }
        }
    };

    if (!displayEvents || displayEvents.length === 0) {
        return (
            <motion.div 
                className="container mx-auto px-4 py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                Нет доступных событий
            </motion.div>
        );
    }

    return (
        <motion.div 
            className="container mx-auto px-4 py-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h2 
                className="text-3xl font-bold text-center text-gray-800 mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Список мероприятий
            </motion.h2>
            <motion.ul className="space-y-6">
                {displayEvents.map((event, index) => (
                    <motion.li 
                        key={event.id}
                        className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow"
                        variants={itemVariants}
                        whileHover="hover"
                        custom={index}
                    >
                        <motion.h4 
                            className="text-2xl font-semibold text-blue-600 mb-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {event.name}
                        </motion.h4>
                        <motion.p 
                            className="text-gray-500 font-medium"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Дата: {new Date(event.date).toLocaleDateString()}
                        </motion.p>

                        {/* Категории как цветные квадратики */}
                        {event.categories && event.categories.length > 0 && (
                            <motion.div 
                                className="mt-4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <h5 className="font-semibold text-gray-700">Категории:</h5>
                                <div className="flex space-x-3 mt-2">
                                    {event.categories.map((category, idx) => (
                                        <motion.div
                                            key={idx}
                                            className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-full"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ 
                                                delay: 0.4 + (idx * 0.1),
                                                type: "spring",
                                                stiffness: 200
                                            }}
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            {category.category.name}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Список спикеров */}
                        {event.speakers && event.speakers.length > 0 && (
                            <motion.div 
                                className="mt-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <h5 className="font-semibold text-gray-700">Спикеры:</h5>
                                <ul className="list-disc pl-6">
                                    {event.speakers.map((speaker, idx) => (
                                        <motion.li 
                                            key={idx} 
                                            className="text-gray-600"
                                            initial={{ x: -10, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.5 + (idx * 0.1) }}
                                        >
                                            {speaker.speaker.name} ({speaker.speaker.user.name})
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}

                        {/* Информация о месте проведения */}
                        {event.venue && (
                            <motion.div 
                                className="mt-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <h5 className="font-semibold text-gray-700">Место проведения:</h5>
                                <p className="text-gray-600">{event.venue.name}, {event.venue.address}</p>
                            </motion.div>
                        )}

                        {/* Организатор мероприятия */}
                        {event.organizer && (
                            <motion.div 
                                className="mt-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                <h5 className="font-semibold text-gray-700">Организатор:</h5>
                                <p className="text-gray-600">{event.organizer.name} ({event.organizer.email})</p>
                            </motion.div>
                        )}
                    </motion.li>
                ))}
            </motion.ul>
        </motion.div>
    );
};

export default EventList;
