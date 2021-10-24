import React, { useState, useEffect } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

function MapContainer(props) {
    const [selectedPlace, setSelectedPlace] = useState({});

    const [ currentPosition, setCurrentPosition ] = useState({});

    const success = position => {
        const currentPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        setCurrentPosition(currentPosition);
      };

    useEffect(() => {
    navigator.geolocation.getCurrentPosition(success);
    }, [])

    return (
        <Map google={props.google} 
        center={currentPosition} 
        zoom={14} containerStyle={{ position: 'relative' }}>

            <Marker position={currentPosition}/>

            <InfoWindow>
                <div>
                    <h1>{selectedPlace.name}</h1>
                </div>
            </InfoWindow>
        </Map>
    );
}

export default GoogleApiWrapper((props) => ({ apiKey: props.apiKey }))(MapContainer);
