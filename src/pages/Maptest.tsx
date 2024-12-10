import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icon issues with Leaflet in React
const DefaultIcon = L.Icon.Default.prototype as any; // TypeScript workaround
delete DefaultIcon._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapWithPin: React.FC = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [locationDetails, setLocationDetails] = useState<{
    state?: string;
    city?: string;
    country?: string;
    postcode?: string;
  }>({});

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);

        // Fetch address using OpenStreetMap's reverse geocoding API
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
        console.log("Latitude:", latitude, "Longitude:", longitude);

        fetch(url)
          .then((res) => res.json())
          .then((data) => {
            const { state, city, country, postcode } = data.address;
            setLocationDetails({ state, city, country, postcode });

            // Log all address details for more insight
            console.log("Detailed Address Information:", data.address);
          })
          .catch((err) => console.error("Error fetching address:", err));
      },
      (err) => {
        console.error("Error getting location:", err.message);
      }
    );
  }, []);

  return (
    <div style={{ height: "60vh", width: "100%" }}>
      {position ? (
        <>
          <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
              <Popup>
                <strong>Your Location:</strong>
                <br />
                {locationDetails.state && <p>State: {locationDetails.state}</p>}
                {locationDetails.city && <p>City: {locationDetails.city}</p>}
                {locationDetails.country && <p>Country: {locationDetails.country}</p>}
                {locationDetails.postcode && <p>Postal Code: {locationDetails.postcode}</p>}
              </Popup>
            </Marker>
          </MapContainer>
          <div>
            <h1>Location Details</h1>
            {locationDetails.state && <p>State: {locationDetails.state}</p>}
            {locationDetails.city && <p>City: {locationDetails.city}</p>}
            {locationDetails.country && <p>Country: {locationDetails.country}</p>}
            {locationDetails.postcode && <p>Postal Code: {locationDetails.postcode}</p>}
          </div>
        </>
      ) : (
        <p>Fetching your location...</p>
      )}
    </div>
  );
};

export default MapWithPin;
