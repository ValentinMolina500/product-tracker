import React, { useState } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

function MapContainer(props) {
    const [selectedPlace, setSelectedPlace] = useState({});

    return (
        <Map google={props.google} zoom={14} containerStyle={{ position: 'relative' }}>

            <Marker name={'Current location'} />

            <InfoWindow>
                <div>
                    <h1>{selectedPlace.name}</h1>
                </div>
            </InfoWindow>
        </Map>
    );
}

export default GoogleApiWrapper((props) => ({ apiKey: props.apiKey }))(MapContainer);
