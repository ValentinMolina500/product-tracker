class Places {

    getNearbyLocations = (lat, lon) => {
        return fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat}%2C${lon}&radius=16000&type=supermarket&key=${process.env.REACT_APP_GOOGLE_MAP_API}`, {
            "access-control-allow-origin" : "*",
            "Content-type": "application/json; charset=UTF-8"
        })
    }

    getPhoto = (photo_ref) => {
        return fetch(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${photo_ref}&key=${process.env.REACT_APP_GOOGLE_MAP_API}`)
    }
}

const places = new Places();

export default places;