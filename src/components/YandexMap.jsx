import React, { useEffect, useState } from 'react';

const YandexMap = ({ latitude, longitude, eventId }) => {
    const [map, setMap] = useState(null); // Состояние для карты

    useEffect(() => {
        if (window.ymaps && !map) {
            // Создание карты только если она ещё не инициализирована
            const newMap = new window.ymaps.Map(`yandex-map-${eventId}`, {
                center: [latitude, longitude],
                zoom: 10,
                controls: ['zoomControl', 'searchControl'], // Контролы для карты
            });

            // Устанавливаем карту в состояние
            setMap(newMap);

            // Создание метки на карте
            const placemark = new window.ymaps.Placemark([latitude, longitude], {
                hintContent: 'Здесь ваше мероприятие!',
                balloonContent: 'Местоположение события.',
            }, {
                iconLayout: 'default#image',
                iconImageHref: 'https://example.com/custom-icon.png',  // Ваш кастомный икон
                iconImageSize: [30, 42], // Размер иконки
                iconImageOffset: [-15, -42], // Смещение иконки
            });

            newMap.geoObjects.add(placemark);
        }

        // Очистка карты при размонтировании компонента
        return () => {
            if (map) {
                map.destroy();
            }
        };
    }, [latitude, longitude, map, eventId]); // Зависимости: обновление карты при изменении координат или ID события

    return (
        <div id={`yandex-map-${eventId}`} style={{ width: '100%', height: '400px' }}></div>
    );
};

export default YandexMap;
