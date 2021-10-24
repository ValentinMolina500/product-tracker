import React, { useState, useEffect } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

function MapContainer(props) {
    const {
        onLocationSet,
        nearbyLocations,
        currentPosition
    } = props;

    const [selectedPlace, setSelectedPlace] = useState({});

    const renderNearbyLocationsMarkers = () => {
        return nearbyLocations.map(loc => {
            return <Marker title={loc.name} position={loc.geometry.location} />
        })
    }

    return (
        <Map google={props.google} 
        center={currentPosition} 
        zoom={14} containerStyle={{ position: 'relative' }}>

            <Marker position={currentPosition}/>
            {renderNearbyLocationsMarkers()}
            <InfoWindow>
                <div>
                    <h1>{selectedPlace.name}</h1>
                </div>
            </InfoWindow>
        </Map>
    );
}

export default GoogleApiWrapper((props) => ({ apiKey: props.apiKey }))(MapContainer);
