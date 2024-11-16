//src/pages/Charts.jsx 
import {useEffect, useState} from 'react';
import VenueEventChart from "../components/VenueEventChart.jsx";
import EventChart from "../components/EventChart.jsx";

export const Charts = () => {
       useEffect(() => {
    }, []);
    return (
        <div className="">
            <VenueEventChart/>
            <EventChart/>
        </div>
    );
};
