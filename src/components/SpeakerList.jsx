// components/SpeakerList.js
import React, { useEffect } from 'react';
import useSpeakerStore from '../stores/SpeakerStore.js';

const SpeakerList = () => {
    const { speakers, fetchSpeakers, addSpeaker, deleteSpeaker } = useSpeakerStore((state) => ({
        speakers: state.speakers,
        fetchSpeakers: state.fetchSpeakers,
        addSpeaker: state.addSpeaker,
        deleteSpeaker: state.deleteSpeaker,
    }));

    useEffect(() => {
        fetchSpeakers();
    }, [fetchSpeakers]);

    const handleAddSpeaker = () => {
        const name = prompt('Enter speaker name');
        const biography = prompt('Enter speaker biography');
        const userId = prompt('Enter user ID');
        addSpeaker(name, biography, userId);
    };

    const handleDeleteSpeaker = (id) => {
        if (window.confirm('Are you sure you want to delete this speaker?')) {
            deleteSpeaker(id);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <button
                onClick={handleAddSpeaker}
                className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
            >
                Add Speaker
            </button>
            <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead>
                <tr>
                    <th className="border border-gray-300 px-4 py-2">Name</th>
                    <th className="border border-gray-300 px-4 py-2">Biography</th>
                    <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {speakers.map((speaker) => (
                    <tr key={speaker.id}>
                        <td className="border border-gray-300 px-4 py-2">{speaker.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{speaker.biography}</td>
                        <td className="border border-gray-300 px-4 py-2">
                            <button
                                onClick={() => handleDeleteSpeaker(speaker.id)}
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

export default SpeakerList;
