import React, {useEffect} from 'react';
import useEventsStore from '../stores/EventStore.js';
import '../index.css'

const EventList = () => {
    const {events, fetchEvents} = useEventsStore();

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Список мероприятий</h2>
            <ul className="space-y-6">
                {events?.map(event => (
                    <li key={event.id}
                        className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                        <h4 className="text-2xl font-semibold text-blue-600 mb-2">{event.name}</h4>
                        <p className="text-gray-500 font-medium">Дата: {new Date(event.date).toLocaleDateString()}</p>

                        {/* Категории как цветные квадратики */}
                        {event.categories && event.categories.length > 0 && (
                            <div className="mt-4">
                                <h5 className="font-semibold text-gray-700">Категории:</h5>
                                <div className="flex space-x-3 mt-2">
                                    {event.categories.map((category, index) => (
                                        <div
                                            key={index}
                                            className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-full"
                                        >
                                            {category.category.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}


                        {/* Список спикеров */}
                        {event.speakers && event.speakers.length > 0 && (
                            <div className="mt-4">
                                <h5 className="font-semibold text-gray-700">Спикеры:</h5>
                                <ul className="list-disc pl-6">
                                    {event.speakers.map((speaker, index) => (
                                        <li key={index} className="text-gray-600">
                                            {speaker.speaker.name} ({speaker.speaker.user.name})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Информация о месте проведения */}
                        {event.venue && (
                            <div className="mt-4">
                                <h5 className="font-semibold text-gray-700">Место проведения:</h5>
                                <p className="text-gray-600">{event.venue.name}, {event.venue.address}</p>
                            </div>
                        )}

                        {/* Организатор мероприятия */}
                        {event.organizer && (
                            <div className="mt-4">
                                <h5 className="font-semibold text-gray-700">Организатор:</h5>
                                <p className="text-gray-600">{event.organizer.name} ({event.organizer.email})</p>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EventList;
