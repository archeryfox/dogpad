// components/EventCategoryList.js
import React, { useEffect } from 'react';
import useEventCategoryStore from '../stores/EventCategoryStore';

const EventCategoryList = () => {
    const { eventCategories, fetchEventCategories, addEventCategory, deleteEventCategory } = useEventCategoryStore((state) => ({
        eventCategories: state.eventCategories,
        fetchEventCategories: state.fetchEventCategories,
        addEventCategory: state.addEventCategory,
        deleteEventCategory: state.deleteEventCategory,
    }));

    useEffect(() => {
        fetchEventCategories();
    }, [fetchEventCategories]);

    const handleAddEventCategory = () => {
        const eventId = prompt('Enter event ID');
        const categoryId = prompt('Enter category ID');
        addEventCategory(eventId, categoryId);
    };

    const handleDeleteEventCategory = (id) => {
        if (window.confirm('Are you sure you want to delete this event category?')) {
            deleteEventCategory(id);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <button
                onClick={handleAddEventCategory}
                className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
            >
                Add Event Category
            </button>
            <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead>
                <tr>
                    <th className="border border-gray-300 px-4 py-2">Event ID</th>
                    <th className="border border-gray-300 px-4 py-2">Category ID</th>
                    <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {eventCategories.map((eventCategory) => (
                    <tr key={eventCategory.id}>
                        <td className="border border-gray-300 px-4 py-2">{eventCategory.eventId}</td>
                        <td className="border border-gray-300 px-4 py-2">{eventCategory.categoryId}</td>
                        <td className="border border-gray-300 px-4 py-2">
                            <button
                                onClick={() => handleDeleteEventCategory(eventCategory.id)}
                                className="bg-red-500 text-white py-1 px-3 rounded"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default EventCategoryList;
