import React, { useState } from "react";
import GoogleMapReact from 'google-map-react';

// const AnyReactComponent = ({ text }) => <div style={{ fontSize: '20px' }}>{text}</div>;

export function GoogleMap() {
    const [center, setCenter] = useState({ lat: 32.109333, lng: 34.855499 })
    const [selectedCity, setSelectedCity] = useState(null);
    const [zoom, setZoom] = useState(8)

    const cities = [
        { name: "Tel Aviv", lat: 32.0853, lng: 34.7818 },
        { name: "Hadera", lat: 32.4340, lng: 34.9196 },
        { name: "Bat Yam", lat: 32.0171, lng: 34.7519 }
    ]


    function handleClick(city) {
        setCenter({ lat: city.lat, lng: city.lng })
        setSelectedCity(city.name)
        setZoom(12)
    }

    const Marker = ({ onClick, $hover, ...props }) => (
        <div onClick={onClick} style={{ cursor: 'pointer', fontSize: '20px' }}>📍</div>
    )

    return (
        <div style={{ height: '50vh', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyDCRIWB6Gf0LeVQDN2t9JuEU5k1cXY8Tws" }}
                center={center}
                zoom={zoom}
            >
                {cities.map((city) => (
                    <Marker
                        key={city.name}
                        lat={city.lat}
                        lng={city.lng}
                        onClick={() => handleClick(city)}
                    />
                ))}
            </GoogleMapReact>
        </div>
    )
}