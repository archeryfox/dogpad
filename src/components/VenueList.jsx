// components/VenueList.js
import React, { useEffect } from 'react';
import useVenueStore from '../stores/Venue';

const VenueList = () => {
    const { venues, fetchVenues, addVenue, deleteVenue } = useVenueStore()

    useEffect(() => {
        fetchVenues();
    }, []);

    const handleAddVenue = () => {
        const name = prompt('Enter venue name');
        const address = prompt('Enter venue address');
        const capacity = parseInt(prompt('Enter venue capacity'));

        addVenue(name, address, capacity);
        fetchVenues()
    };

    const handleDeleteVenue = (id) => {
        if (window.confirm('Are you sure you want to delete this venue?')) {
            deleteVenue(id);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <button
                onClick={handleAddVenue}
                className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
            >
                Add Venue
            </button>
            <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead>
                <tr>
                    <th className="border border-gray-300 px-4 py-2">Name</th>
                    <th className="border border-gray-300 px-4 py-2">Address</th>
                    <th className="border border-gray-300 px-4 py-2">Capacity</th>
                    <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {venues.map((venue) => (
                    <tr key={venue.id}>
                        <td className="border border-gray-300 px-4 py-2">{venue.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{venue.address}</td>
                        <td className="border border-gray-300 px-4 py-2">{venue.capacity}</td>
                        <td className="border border-gray-300 px-4 py-2">
                            <button
                                onClick={() => handleDeleteVenue(venue.id)}
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

export default VenueList;
