import React, {useState} from "react";
import {Map, Placemark, YMaps} from "@pbe/react-yandex-maps";
import {AddressSuggest} from "./AddressSuggest.jsx";

const App = () => {
    const [coordinates, setCoordinates] = useState([55.751574, 37.573856]);

    return (
        <YMaps query={{ apikey: '8aa9a32f-7735-426f-b2ea-01bc84647e4a', lang: 'ru_RU' }}>
            <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
                <AddressSuggest onAddressSelect={setCoordinates} />
                <Map
                    defaultState={{
                        center: [55.751574, 37.573856],
                        zoom: 9,
                        controls: ["zoomControl", "fullscreenControl"],
                    }}
                    width="100%"
                    height="500px"
                    modules={["control.ZoomControl", "control.FullscreenControl", "control.SearchControl"]}
                    state={{ center: coordinates, zoom: 10 }}
                >
                    <Placemark geometry={coordinates} />
                </Map>
            </div>
        </YMaps>
    );
};

export default App;
