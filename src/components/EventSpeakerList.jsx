// components/EventSpeakerList.js
import React, { useEffect } from 'react';
import useEventSpeakerStore from '../stores/EventSpeakerStore';

const EventSpeakerList = () => {
    const { eventSpeakers, fetchEventSpeakers, addEventSpeaker, deleteEventSpeaker } = useEventSpeakerStore((state) => ({
        eventSpeakers: state.eventSpeakers,
        fetchEventSpeakers: state.fetchEventSpeakers,
        addEventSpeaker: state.addEventSpeaker,
        deleteEventSpeaker: state.deleteEventSpeaker,
    }));

    useEffect(() => {
        fetchEventSpeakers();
    }, [fetchEventSpeakers]);

    const handleAddEventSpeaker = () => {
        const eventId = prompt('Enter event ID');
        const speakerId = prompt('Enter speaker ID');
        addEventSpeaker(eventId, speakerId);
    };

    const handleDeleteEventSpeaker = (id) => {
        if (window.confirm('Are you sure you want to delete this event speaker?')) {
            deleteEventSpeaker(id);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <button
                onClick={handleAddEventSpeaker}
                className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
            >
                Add Event Speaker
            </button>
            <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead>
                <tr>
                    <th className="border border-gray-300 px-4 py-2">Event ID</th>
                    <th className="border border-gray-300 px-4 py-2">Speaker ID</th>
                    <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {eventSpeakers.map((eventSpeaker) => (
                    <tr key={eventSpeaker.id}>
                        <td className="border border-gray-300 px-4 py-2">{eventSpeaker.eventId}</td>
                        <td className="border border-gray-300 px-4 py-2">{eventSpeaker.speakerId}</td>
                        <td className="border border-gray-300 px-4 py-2">
                            <button
                                onClick={() => handleDeleteEventSpeaker(eventSpeaker.id)}
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

export default EventSpeakerList;
