import React, {useState} from "react";

export const AddressSuggest = ({onAddressSelect}) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const handleInputChange = async (e) => {
        const input = e.target.value;
        setQuery(input);

        if (input.length > 2) {
            try {
                const response = await fetch(
                    `https://geocode-maps.yandex.ru/1.x/?apikey=e0d947fd-911c-4be8-9d7d-3192b69bf319&format=json&geocode=${input}`
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

    return (
        <div className="w-full max-w-lg mx-auto mt-4">
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Введите адрес"
                className="p-3 border border-gray-300 rounded-lg w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ul className="mt-2 bg-white rounded-lg shadow-lg">
                {suggestions.map((suggestion, index) => (
                    <li
                        key={index}
                        onClick={() => onAddressSelect(suggestion.coordinates)}
                        className="p-3 cursor-pointer hover:bg-blue-100 text-gray-700"
                    >
                        {suggestion.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};