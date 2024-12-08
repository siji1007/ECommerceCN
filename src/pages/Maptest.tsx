import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";

const MapWithPin: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [address, setAddress] = useState<string>("");
  const mapInstance = useRef<L.Map | null>(null); // Store the map instance to avoid reinitialization

  useEffect(() => {
    // Initialize map and markers inside useEffect
    const initializeMap = () => {
      if (!mapRef.current) return;

      // Check if the map is already initialized
      if (mapInstance.current) return; // If map is already initialized, skip

      // Create the map
      const map = L.map(mapRef.current).setView([14.1090665, 122.9562386], 15); // Default location (Lat, Lng)
      
      // Store the map instance to prevent reinitialization
      mapInstance.current = map;

      // Set up the OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Create a draggable marker
      const marker = L.marker([14.1090665, 122.9562386], {
        draggable: true, // Allow dragging the pin
      }).addTo(map);

      // Reverse geocoding using OpenStreetMap Nominatim API
      const getAddressFromLatLng = async (lat: number, lng: number) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );
          const data = await response.json();
          const { state, city, suburb, postcode } = data.address;
          setAddress(`Province: ${state || "Unknown"}\nCity: ${city || "Unknown"}\nBarangay: ${suburb || "Unknown"}\nPostal Code: ${postcode || "Unknown"}`);
        } catch (error) {
          console.error("Error fetching address:", error);
        }
      };

      // Add event listener for marker drag end
      marker.on("dragend", () => {
        const position = marker.getLatLng();
        getAddressFromLatLng(position.lat, position.lng);
      });

      // Fetch the address for the initial marker position
      const initialPosition = marker.getLatLng();
      getAddressFromLatLng(initialPosition.lat, initialPosition.lng);
    };

    // Initialize the map once the script is loaded
    initializeMap();

    // Cleanup function to remove the map on unmount
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove(); // Remove map on unmount
        mapInstance.current = null; // Clear map reference
      }
    };
  }, []); // Empty dependency array ensures the effect runs once when the component mounts

  return (
    <div>
      <div ref={mapRef} style={{ height: "500px", width: "100%" }} />
      <div>
        <h3>Address Details</h3>
        <pre>{address}</pre>
      </div>
    </div>
  );
};

export default MapWithPin;
