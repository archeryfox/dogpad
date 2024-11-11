import React, { useEffect } from 'react';
import { YMaps, Map, Placemark, SearchControl } from '@pbe/react-yandex-maps';

const YandexMap = ({ center = [55.751574, 37.573856], zoom = 9 }) => {
    useEffect(() => {
        console.log('YandexMap rendered');
    }, []); // Добавлено зависимость для предотвращения повторного вызова

    return (
        <YMaps>
            <Map
                defaultState={{
                    center: center,
                    zoom: zoom,
                    controls: ["zoomControl", "fullscreenControl"],
                }}
                modules={["control.ZoomControl", "control.FullscreenControl", "control.SearchControl"]}
            >
                <Placemark defaultGeometry={[55.75, 37.57]} />
                <SearchControl options={{ float: 'right' }} />
            </Map>
        </YMaps>
    );
};

export default YandexMap;
