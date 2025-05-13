import React, {useEffect, useState} from 'react';
import useEventStore from '../stores/EventStore.js';
import useAuthStore from '../stores/AuthStore.js';
import {Link} from 'react-router-dom';
import { toast } from 'react-toastify';

const MyEvents = () => {
    const {events, fetchEvents, deleteEvent, loading, error} = useEventStore();
    const {user} = useAuthStore();
    const [myEvents, setMyEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (user) {
            fetchEvents();
        }
    }, [user]);

    useEffect(() => {
        if (events.length > 0 && user) {
            const filteredEvents = events.filter(event => event.organizerId === user.id);
            setMyEvents(filteredEvents);
        }
    }, [events, user]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const openModal = (eventId) => {
        setEventToDelete(eventId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEventToDelete(null);
    };

    const handleDelete = async () => {
        if (eventToDelete) {
            setIsDeleting(true);
            try {
                await deleteEvent(eventToDelete);
                toast.success('Мероприятие успешно удалено');
                // Обновляем список мероприятий после успешного удаления
                fetchEvents();
                closeModal();
            } catch (error) {
                console.error('Ошибка при удалении мероприятия:', error);
                let errorMessage = 'Не удалось удалить мероприятие';
                
                if (error.response) {
                    // Получаем сообщение об ошибке с сервера, если оно есть
                    errorMessage = error.response.data?.error || errorMessage;
                }
                
                toast.error(errorMessage);
                // Ошибка уже обрабатывается в EventStore
            } finally {
                setIsDeleting(false);
            }
        }
    };

    if (!user) {
        return (
            <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-700">Вы не авторизованы</h2>
                <p>Пожалуйста, войдите в систему, чтобы увидеть свои мероприятия.</p>
            </div>
        );
    }

    return (
        <div className="my-events-container max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Мои мероприятия</h2>

            {loading && (
                <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-gray-600">Загрузка мероприятий...</p>
                </div>
            )}

            {!loading && myEvents.length === 0 ? (
                <p className="text-center text-gray-500">У вас пока нет мероприятий.</p>
            ) : (
                <div className="space-y-4">
                    {myEvents.map(event => (
                        <div key={event.id} className="event-card p-4 border border-gray-200 rounded-lg shadow-md">
                            {event.image && (
                                <img
                                    src={event.image}
                                    alt={event.name}
                                    className="w-full h-48 object-cover mb-4 rounded"
                                />
                            )}
                            <h3 className="text-xl font-semibold text-gray-800">{event.name}</h3>
                            <p className="text-gray-600">{event.description.substr(0, 100)}...</p>
                            <p className="text-gray-500">Дата: {new Date(event.date).toLocaleString()}</p>
                            <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
                                <Link
                                    to={`/event/${event.id}`}
                                    className="text-blue-500 hover:text-blue-700 font-medium"
                                >
                                    🔎 Подробнее
                                </Link>
                                <Link
                                    to={`/update-event/${event.id}`}
                                    className="text-blue-500 hover:text-blue-700 font-medium"
                                >
                                    🖊️ Редактировать
                                </Link>
                                <span className="text-gray-500">
                                    Статус: {event.isPaid ? 'Платное 💰' : 'Бесплатное 🆓'}
                                </span>
                                <button
                                    onClick={() => openModal(event.id)}
                                    className="text-red-500 hover:text-red-700 font-medium"
                                >
                                    🗑️ Удалить
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
                        <h3 className="text-lg font-semibold text-gray-800">Подтверждение удаления</h3>
                        <p className="text-gray-600">Вы уверены, что хотите удалить это мероприятие?</p>
                        <div className="mt-4 flex justify-end space-x-4">
                            <button
                                onClick={closeModal}
                                disabled={isDeleting}
                                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className={`px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 ${isDeleting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isDeleting ? 'Удаление...' : 'Удалить'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyEvents;
