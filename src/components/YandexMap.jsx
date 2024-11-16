import React, {useState, useEffect} from "react";
import {Map, Placemark, YMaps, ZoomControl} from "@pbe/react-yandex-maps";
import {AddressSuggest} from "./AddressSuggest.jsx";

const YandexMap = ({initialCoordinates=[55.746104, 37.581720], onCoordinatesChange, setAddressText, inForm}) => {
    const [coordinates, setCoordinates] = useState(initialCoordinates);

    useEffect(() => {
        !inForm ? setCoordinates(initialCoordinates) : null
    }, [coordinates, onCoordinatesChange, initialCoordinates]);

    const handleMapDblClick = (e) => {
        const newCoords = e.get("coords");
        setCoordinates(newCoords);
    };

    return (
        <div className="flex flex-col rounded items-center p-4 bg-gray-100 h-[30em] min-h-screen">
            <YMaps query={{apikey: '7e3a7d16-eafb-487d-89fa-c51c36723612', lang: 'ru_RU'}}>
                { setAddressText && <AddressSuggest setAddressText={setAddressText} onAddressSelect={setCoordinates}/>}
                <Map
                    defaultState={{
                        center: coordinates,
                        zoom: 9,
                    }}
                    width="100%"
                    height="100%"
                    state={{center: coordinates, zoom: 10}}
                    // onDblClick={handleMapDblClick}
                >
                    {coordinates &&
                        <>
                            <Placemark geometry={coordinates}/>
                            <ZoomControl/>
                        </>
                    }
                </Map>
            </YMaps>
        </div>
    );
};

export default YandexMap;
