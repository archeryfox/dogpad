import React, { useState } from "react";

export const AddressSuggest = ({ onAddressSelect, setAddressText }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isFocused, setIsFocused] = useState(false);

    const handleInputChange = async (e) => {
        const input = e.target.value;
        setQuery(input);

        if (input.length > 1) {
            try {
                const response = await fetch(
                    `https://geocode-maps.yandex.ru/1.x/?apikey=7e3a7d16-eafb-487d-89fa-c51c36723612&format=json&geocode=${input}`
                );

                if (!response.ok) {
                    throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                const newSuggestions = data.response.GeoObjectCollection.featureMember.map((item) => ({
                    name: item.GeoObject.metaDataProperty.GeocoderMetaData.text,
                    coordinates: item.GeoObject.Point.pos.split(' ').map(Number).reverse(),
                }));
                setSuggestions(newSuggestions);
            } catch (error) {
                console.error('Ошибка при получении подсказок:', error);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion.name);
        setAddressText(suggestion.name)
        setSuggestions([]);
        onAddressSelect(suggestion.coordinates);
        setIsFocused(false);
    };

    return (
        <div className="w-full max-w-lg mx-auto mb-4 relative">
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                placeholder="Введите адрес"
                className="p-3 border border-gray-300 rounded-lg w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {isFocused && (
                <ul className="absolute z-10 bg-white rounded-lg shadow-lg max-h-48 overflow-y-auto w-full border border-gray-200">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="p-3 cursor-pointer hover:bg-blue-100 text-gray-700"
                        >
                            {suggestion.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
