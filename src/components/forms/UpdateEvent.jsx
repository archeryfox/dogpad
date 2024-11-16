import React, {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import useEventStore from '../../stores/EventStore.js';
import useVenueStore from '../../stores/VenueStore.js';
import useCategoryStore from '../../stores/CategoryStore.js';
import useSpeakerStore from '../../stores/SpeakerStore.js';
import useEventCategoryStore from '../../stores/EventCategory.js';
import useAuthStore from '../../stores/AuthStore.js';
import useEventSpeakerStore from "../../stores/EventSpeaker.js";

const EventUpdate = () => {
    const {eventId} = useParams(); // Получаем ID события из URL
    const navigate = useNavigate();

    // Хуки для получения данных
    const {events, fetchEvents, updateEvent} = useEventStore();
    const {venues, fetchVenues} = useVenueStore();
    const {categories, fetchCategories} = useCategoryStore();
    const {speakers, fetchSpeakers} = useSpeakerStore();
    const {user} = useAuthStore();
    const {addEventCategory} = useEventCategoryStore();
    const {addEventSpeaker, deleteEventSpeaker} = useEventSpeakerStore();

    const [eventData, setEventData] = useState({
        name: '',
        description: '',
        date: '',
        isPaid: false,
        price: 0,
        image: '',
        organizerId: user?.id || '',
        venueId: '',
        categories: [],
        speakers: [],
    });

    const [isOnline, setIsOnline] = useState(false);
    const [loading, setLoading] = useState(false);

    // Загружаем данные
    useEffect(() => {
        fetchEvents();
        fetchVenues();
        fetchCategories();
        fetchSpeakers();
    }, []);

    useEffect(() => {
        const event = events.find((e) => e.id === parseInt(eventId));
        if (event) {
            setEventData({
                name: event.name,
                description: event.description,
                date: new Date(event.date).toISOString().slice(0, 16),
                isPaid: event.isPaid,
                price: event.price || 0,
                image: event.image || '',
                organizerId: event.organizerId,
                venueId: event.venueId || '',
                categories: event.categories?.map((cat) => cat.category.id) || [],
                speakers: event.speakers?.map((speaker) => speaker.id) || [],
            });
            setIsOnline(!event.venueId); // Если нет venueId, то онлайн
        } else {
            console.log("Event not found, redirecting to /404");
            navigate('/404');
        }
    }, [events, eventId]);

    const handleInputChange = (e) => {
        const {name, value, type, checked} = e.target;
        setEventData({
            ...eventData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleVenueChange = (e) => {
        const {value} = e.target;
        setEventData({
            ...eventData,
            venueId: value,
        });
    };

    const handleCategoryChange = (e) => {
        const {value, checked} = e.target;
        const categoryId = parseInt(value);

        setEventData((prevState) => ({
            ...prevState,
            categories: checked
                ? [...prevState.categories, categoryId]
                : prevState.categories.filter((id) => id !== categoryId),
        }));
    };

    const handleSpeakerChange = async (e) => {
        const {value, checked} = e.target;
        const speakerId = parseInt(value);



        setEventData((prevState) => ({
            ...prevState,
            speakers: checked
                ? [...prevState.speakers, speakerId]
                : prevState.speakers.filter((id) => id !== speakerId),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const updatedEventData = {
            ...eventData,
            venueId: isOnline ? null : eventData.venueId,
        };

        await updateEvent(eventId, updatedEventData);

       /* for (const categoryId of eventData.categories) {
            await addEventCategory(eventId, categoryId);
        }*/

        setLoading(false);
        navigate(`/events/${eventId}`);
    };

    if (events.length === 0) {
        return <div>Загружаем мероприятия...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Обновить мероприятие</h2>

            {/* Поля для Event */}
            <input
                type="text"
                name="name"
                value={eventData.name}
                onChange={handleInputChange}
                placeholder="Название мероприятия"
                required
                className="w-full px-4 py-2 border rounded-md"
            />
            <textarea
                name="description"
                value={eventData.description}
                onChange={handleInputChange}
                placeholder="Описание мероприятия"
                required
                className="w-full px-4 py-2 border rounded-md"
            />
            <input
                type="datetime-local"
                name="date"
                value={eventData.date}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-md"
            />
            <div className="flex items-center">
                <input
                    type="checkbox"
                    name="isPaid"
                    checked={eventData.isPaid}
                    onChange={handleInputChange}
                    className="mr-2"
                />
                <label className="text-sm">Платное мероприятие</label>
            </div>
            {eventData.isPaid && (
                <input
                    type="number"
                    name="price"
                    value={eventData.price}
                    onChange={handleInputChange}
                    placeholder="Стоимость участия"
                    required
                    className="w-full px-4 py-2 border rounded-md"
                />
            )}
            <input
                type="url"
                name="image"
                value={eventData.image}
                onChange={handleInputChange}
                placeholder="Ссылка на обложку"
                className="w-full px-4 py-2 border rounded-md"
            />

            {/* Поля для Venue */}
            <h3 className="text-xl font-semibold text-gray-700">Место проведения</h3>
            <div className="flex items-center">
                <input
                    type="checkbox"
                    checked={isOnline}
                    onChange={() => setIsOnline(!isOnline)}
                    className="mr-2"
                />
                <label className="text-sm">Онлайн мероприятие</label>
            </div>
            {!isOnline && (
                <select
                    name="venueId"
                    value={eventData.venueId || ''}
                    onChange={handleVenueChange}
                    className="w-full px-4 py-2 border rounded-md"
                >
                    <option value="">Выберите место</option>
                    {venues.map((venue) => (
                        <option key={venue.id} value={venue.id}>
                            {venue.name} - {venue.address}
                        </option>
                    ))}
                </select>
            )}

            {/* Поля для категорий */}
            <h3 className="text-xl font-semibold text-gray-700">Категории мероприятия</h3>
            <div className="flex flex-wrap">
                {categories.map((category) => (
                    <div key={category.id} className="flex items-center mr-4">
                        <input
                            type="checkbox"
                            value={category.id}
                            checked={eventData.categories.includes(category.id)}
                            onChange={handleCategoryChange}
                            className="mr-2"
                        />
                        <label className="text-sm">{category.name}</label>
                    </div>
                ))}
            </div>

            {/* Поля для спикеров */}
            <h3 className="text-xl font-semibold text-gray-700">Спикеры</h3>
            <div className="flex flex-wrap">
                {speakers.map((speaker) => (
                    <div key={speaker.id} className="flex items-center mr-4">
                        <input
                            type="checkbox"
                            value={speaker.id}
                            checked={eventData.speakers.includes(speaker.id)}
                            onChange={handleSpeakerChange}
                            className="mr-2"
                        />
                        <label className="text-sm">{speaker.name}</label>
                    </div>
                ))}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
            >
                {loading ? "Обновляем..." : "Обновить мероприятие"}
            </button>
        </form>
    );
};

export default EventUpdate;

