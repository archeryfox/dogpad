import React, { useState, useEffect } from 'react';
import useEventStore from '../../stores/EventStore.js';
import useVenueStore from '../../stores/VenueStore.js';
import useCategoryStore from '../../stores/CategoryStore';
import useSpeakerStore from '../../stores/SpeakerStore.js';
import useUserStore from '../../stores/UserStore';
import useEventCategoryStore from "../../stores/EventCategory.js";
import { AddressSuggest } from "../AddressSuggest.jsx";
import YandexMap from "../YandexMap.jsx";
import useAuthStore from "../../stores/AuthStore.js";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddEventForm = () => {
    const { addEvent } = useEventStore();
    const { addVenue, venues, fetchVenues } = useVenueStore();
    const { categories, fetchCategories } = useCategoryStore();
    const { speakers, fetchSpeakers } = useSpeakerStore();
    const { users, fetchUsers } = useUserStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const [isOnline, setIsOnline] = useState(false);
    const [YMapAddres, setYMapAddres] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [eventData, setEventData] = useState({
        name: '',
        description: '',
        date: '',
        isPaid: false,
        price: 0,
        image: '',
        organizerId: user?.id ?? null,
        venueId: null,
        categories: [],
        speakers: [],
    });

    const [venueData, setVenueData] = useState({
        name: '',
        address: YMapAddres,
        capacity: null,
        image: ''
    });

    useEffect(() => {
        fetchVenues();
        fetchCategories();
        fetchSpeakers();
        fetchUsers();
    }, []);

    const handleAddVenue = async () => {
        try {
            if (!eventData.isOnline && !eventData.venueId) {
                setVenueData({ ...venueData, address: YMapAddres });
                const newVenue = await addVenue(venueData);
                if (newVenue && newVenue.id) {
                    setEventData({ ...eventData, venueId: newVenue.id });
                    return true;
                } else {
                    throw new Error('Не удалось создать место проведения');
                }
            }
            return true;
        } catch (error) {
            const status = error.response?.status || 0;
            if (status >= 400 && status < 500) {
                toast.error(`Ошибка при создании места: ${error.response?.data?.message || 'Проверьте введенные данные'}`);
            } else if (status >= 500) {
                toast.error('Ошибка сервера при создании места. Попробуйте позже.');
            } else {
                toast.error('Не удалось создать место проведения');
            }
            return false;
        }
    };

    const handleAddEvent = async () => {
        try {
            const result = await addEvent({ ...eventData, organizerId: user.id });
            if (result && result.id) {
                toast.success('Мероприятие успешно создано!');
            } else {
                toast.error('Не удалось создать мероприятие');
            }
        } catch (error) {
            console.error('Error creating event:', error);
            toast.error('Ошибка при создании мероприятия: ' + error.message);
        } finally {
            navigate('/my-events');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await handleAddVenue();
            await handleAddEvent();
        } catch (error) {
            console.error('Error in form submission:', error);
            toast.error('Произошла ошибка при отправке формы');
        } finally {
            setLoading(false);
            navigate('/my-events');
        }
    };

    return (
        <form onSubmit={handleSubmit}
              className="add-event-form max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Добавить новое событие</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            {/* Event fields */}
            <input type="text" value={eventData.name} onChange={(e) => setEventData({ ...eventData, name: e.target.value })} placeholder="Название мероприятия" required className="w-full px-4 py-2 border rounded-md" />
            <textarea value={eventData.description} onChange={(e) => setEventData({ ...eventData, description: e.target.value })} placeholder="Описание мероприятия" required className="w-full px-4 py-2 border rounded-md" />
            <input type="datetime-local" value={eventData.date} onChange={(e) => setEventData({ ...eventData, date: e.target.value })} required className="w-full px-4 py-2 border rounded-md" />

            <div className="flex items-center space-x-2">
                <label className="text-gray-700 font-medium">Платное мероприятие:</label>
                <input type="checkbox" checked={eventData.isPaid} onChange={(e) => setEventData({ ...eventData, isPaid: e.target.checked })} className="text-blue-500" />
            </div>
            {eventData.isPaid && (
                <input type="number" value={eventData.price} onChange={(e) => setEventData({ ...eventData, price: parseFloat(e.target.value) })} placeholder="Стоимость участия" className="w-full px-4 py-2 border rounded-md" />
            )}

            <input type="url" placeholder="Обложка мероприятия (URL)" onChange={(e) => setEventData({ ...eventData, image: e.target.value })} className="w-full px-4 py-2 border rounded-md" />

            {/* Categories */}
            <h3 className="text-xl font-semibold text-gray-700 mt-6">Категории</h3>
            <select multiple value={eventData.categories} onChange={(e) => setEventData({ ...eventData, categories: Array.from(e.target.selectedOptions, option => parseInt(option.value)) })} className="w-full px-4 py-2 border rounded-md h-40">
                {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                ))}
            </select>

            {/* Venue */}
            <h3 className="text-xl font-semibold text-gray-700 mt-6">Место проведения</h3>
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <label className="text-gray-700 font-medium">Онлайн мероприятие:</label>
                    <input type="checkbox" checked={isOnline} onChange={(e) => setIsOnline(e.target.checked)} className="text-blue-500" />
                </div>

                {!isOnline && (
                    <>
                        <select value={eventData.venueId || ""} onChange={(e) => setEventData({ ...eventData, venueId: parseInt(e.target.value) })} className="w-full px-4 py-2 border rounded-md">
                            <option value="">Выберите место</option>
                            {venues.map((venue) => (
                                <option key={venue.id} value={venue.id}>{venue.name} - {venue.address}</option>
                            ))}
                        </select>
                        <input type="text" value={venueData.name} onChange={(e) => setVenueData({ ...venueData, name: e.target.value })} placeholder="Название места" required={!eventData.venueId} className="w-full px-4 py-2 border rounded-md" />
                        <input type="number" value={venueData.capacity} onChange={(e) => setVenueData({ ...venueData, capacity: parseInt(e.target.value) })} placeholder="Вместимость" required={!eventData.venueId} className="w-full px-4 py-2 border rounded-md" />
                        <input type="url" placeholder="Изображение места (URL)" onChange={(e) => setVenueData({ ...venueData, image: e.target.value })} className="w-full px-4 py-2 border rounded-md" />
                        <div>
                            <label className="block text-lg font-medium">Местоположение</label>
                            <YandexMap setAddressText={setYMapAddres} inForm={true} onCoordinatesChange={setYMapAddres} />
                        </div>
                    </>
                )}
            </div>

            {/* Speakers */}
            <h3 className="text-xl font-semibold text-gray-700 mt-6">Спикеры</h3>
            <select multiple value={eventData.speakers} onChange={(e) => setEventData({ ...eventData, speakers: Array.from(e.target.selectedOptions, option => parseInt(option.value)) })} className="w-full px-4 py-2 border rounded-md h-40">
                {users.filter(u => u?.role?.name === 'speaker').map(speaker => (
                    <option key={speaker.id} value={speaker.id}>{speaker.name}</option>
                ))}
            </select>

            <button type="submit" disabled={loading} className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {loading ? 'Создание...' : 'Создать мероприятие'}
            </button>
        </form>
    );
};

export default AddEventForm;
