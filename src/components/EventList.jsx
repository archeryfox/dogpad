import React, { useEffect } from 'react';
import useEventsStore from '../stores/EventStore.js';
import '../index.css'
const EventList = () => {
    const { events, fetchEvents } = useEventsStore();

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Список мероприятий</h2>
            <ul className="space-y-6">
                {events?.map(event => (
                    <li key={event.id} className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                        <h4 className="text-2xl font-semibold text-blue-600 mb-2">{event.title}</h4>
                        <p className="text-gray-600 mb-4">{event.description}</p>
                        <p className="text-gray-500 font-medium">Дата: {new Date(event.date).toLocaleDateString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EventList;
