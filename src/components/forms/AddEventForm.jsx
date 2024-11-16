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

const AddEventForm = () => {
    const { addEvent } = useEventStore();
    const { addVenue, venues, fetchVenues } = useVenueStore();
    const { categories, fetchCategories } = useCategoryStore();
    const { speakers, fetchSpeakers } = useSpeakerStore();
    const { users, fetchUsers } = useUserStore();
    const { user } = useAuthStore();
    const { eventCategories, addEventCategory} = useEventCategoryStore();
    const [isOnline, setIsOnline] = useState(false);
    const [YMapAddres, setYMapAddres] = useState("");
    const [eventData, setEventData] = useState({
        name: '',
        description: '',
        date: '',
        isPaid: false,
        price: 0,
        image: '',
        organizerId: null,
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
        fetchUsers(); // Только организаторов отобрать на этапе рендера
    }, []);

    const handleAddVenue = async () => {
        if (!eventData.isOnline && !eventData.venueId) {  // Если место не выбрано и не онлайн
            setVenueData({ ...venueData, address: YMapAddres });
            const newVenue = await addVenue(venueData);
            setEventData({ ...eventData, venueId: newVenue.id });
        }
    };

    const handleAddEvent = async () => {
        setEventData({ ...eventData, organizerId: user.id });
        const { id } = await addEvent(eventData);

        // Добавляем выбранные категории к событию
        // eventData.categories.forEach(async (categoryId) => {
        //     await addCategoryToEvent(id, categoryId);
        // });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleAddVenue();
        await handleAddEvent();
    };

    return (
        <form onSubmit={handleSubmit}
              className="add-event-form max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Добавить новое событие</h2>

            {/* Поля для Event */}
            <div className="space-y-4">
                <input
                    type="text"
                    value={eventData.name}
                    onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
                    placeholder="Название мероприятия"
                    required
                    className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:border-blue-500 outline-none"
                />
                <textarea
                    value={eventData.description}
                    onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                    placeholder="Описание мероприятия"
                    required
                    className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:border-blue-500 outline-none"
                />
                <input
                    type="datetime-local"
                    value={eventData.date}
                    onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:border-blue-500 outline-none"
                />

                <div className="flex items-center space-x-2">
                    <label className="text-gray-700 font-medium">Платное мероприятие:</label>
                    <input
                        type="checkbox"
                        checked={eventData.isPaid}
                        onChange={(e) => setEventData({ ...eventData, isPaid: e.target.checked })}
                        className="text-blue-500 focus:ring-blue-300"
                    />
                </div>
                {eventData.isPaid && (
                    <input
                        type="number"
                        value={eventData.price}
                        onChange={(e) => setEventData({ ...eventData, price: parseFloat(e.target.value) })}
                        placeholder="Стоимость участия"
                        required
                        className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:border-blue-500 outline-none"
                    />
                )}

                <input
                    type="url"
                    required={false}
                    placeholder="Обложка мероприятия(URL)"
                    onChange={(e) => setEventData({ ...eventData, image: e.target.value })}
                    className="w-full px-4 py-2 border border-dashed rounded-md focus:ring focus:ring-blue-300 focus:border-blue-500 outline-none"
                />
            </div>

            {/* Поля для Venue */}
            <h3 className="text-xl font-semibold text-gray-700 mt-6">Место проведения</h3>
            <div className="space-y-4">
                {/* Чекбокс для онлайн-мероприятия */}
                <div className="flex items-center space-x-2">
                    <label className="text-gray-700 font-medium">Онлайн мероприятие:</label>
                    <input
                        type="checkbox"
                        checked={isOnline}
                        onChange={(e) => setIsOnline(e.target.checked)}
                        className="text-blue-500 focus:ring-blue-300"
                    />
                </div>

                {!isOnline ? (
                    <>
                        {/* Выбор существующего места из списка */}
                        <select
                            value={eventData.venueId || ""}
                            required={false}
                            onChange={(e) => {
                                setEventData({...eventData, venueId: parseInt(e.target.value)});
                            }}
                            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:border-blue-500 outline-none"
                        >
                            <option value="">Выберите место</option>
                            {venues.map((venue) => (
                                <option key={venue.id} value={venue.id}>
                                    {venue.name} - {venue.address}
                                </option>
                            ))}
                        </select>

                        {/* Создание нового места */}
                        <input
                            type="text"
                            value={venueData.name}
                            onChange={(e) => setVenueData({ ...venueData, name: e.target.value })}
                            placeholder="Название места"
                            required={!eventData.venueId}
                            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:border-blue-500 outline-none"
                        />
                        <input
                            type="number"
                            value={venueData.capacity}
                            onChange={(e) => setVenueData({ ...venueData, capacity: parseInt(e.target.value, 10) })}
                            placeholder="Вместимость"
                            required={!eventData.venueId}
                            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:border-blue-500 outline-none"
                        />
                        <input
                            type="url"
                            required={false}
                            placeholder="Изображение места(URL)"
                            onChange={(e) => setVenueData({ ...venueData, image: e.target.value })}
                            className="w-full px-4 py-2 border border-dashed rounded-md focus:ring focus:ring-blue-300 focus:border-blue-500 outline-none"
                        />
                        <div className="mb-4">
                            <label className="block text-lg font-medium">Местоположение</label>
                            <YandexMap setAddressText={setYMapAddres} inForm={true} onCoordinatesChange={setYMapAddres} />
                        </div>
                    </>
                ) : null}
            </div>

            {/* Поля для выбора Организатора */}
            <h3 className="text-xl font-semibold text-gray-700 mt-6">Спикер</h3>
            <select
                value={eventData.organizerId}
                onChange={(e) => setEventData({ ...eventData, organizerId: parseInt(e.target.value) })}
                required
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 focus:border-blue-500 outline-none"
            >
                <option value="">Выберите организатора</option>
                {users
                    .filter(user => user.role.name === 'organizer')
                    .map(user => (
                        <option key={user.id} value={user.id}>
                            {user.name}
                        </option>
                    ))}
            </select>

            <button
                type="submit"
                className="w-full py-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 focus:outline-none"
            >
                Добавить событие
            </button>
        </form>
    );
};

export default AddEventForm;
