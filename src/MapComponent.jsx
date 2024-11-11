import React from 'react';
import { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, reactify } from './lib/ymaps';

const MapComponent = () => {
    const LOCATION = { center: [55.751244, 37.618423], zoom: 10 };

    return (
        <YMap location={reactify.useDefault(LOCATION)}>
            <YMapDefaultSchemeLayer />
            <YMapDefaultFeaturesLayer />
        </YMap>
    );
};

export default MapComponent;
