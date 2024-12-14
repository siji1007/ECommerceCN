import React, { useEffect, useRef, useState } from "react";
import profile from "/src/assets/profiles/Profile.jpg"; // Make sure this path is correct
import host from "../../host/host.txt?raw";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"; // Import necessary components from Leaflet
import L from "leaflet"; // Leaflet library for map utilities
import Pin from '../../assets/OtherImages/pin.png';
import { useMap } from "react-leaflet";



const UpdateMapView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};

const ConsumerManagement: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]); // State to hold the user data
    const [addresses, setAddresses] = useState<any[]>([]); // State to hold the address data
    const [selectedUser, setSelectedUser] = useState<any | null>(null); // State for selected user
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state for user details
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Delete confirmation modal state
    const [userToDelete, setUserToDelete] = useState<number | null>(null); // User ID to delete
    const [isMapModalOpen, setIsMapModalOpen] = useState(false); // Map modal visibility
    const [position, setPosition] = useState<[number, number]>([0, 0]); // State for the position of the marker
    const [zoom, setZoom] = useState(12); // Zoom state for the map
    const [selectedLocation, setSelectedLocation] = useState<[number, number]>([13.41, 122.56]);
    const [locationDetails, setLocationDetails] = useState<any>({}); // Store location details like state, city, etc.
    const markerRefs = useRef<any[]>([]); // Store references to markers
    const [selectedMarker, setSelectedMarker] = useState<number | null>(null); 
    const serverURL = host.trim();
    const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null);

    // Fetch users data from the Flask API on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(serverURL + "/api/users");
                const data = await response.json();
                setUsers(data); // Set the user data to state
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        const fetchAddresses = async () => {
            try {
                const response = await fetch(`${serverURL}/api/addresses`); // Fetch all addresses
                const data = await response.json();
                setAddresses(data); // Set the address data to state
            } catch (error) {
                console.error("Error fetching addresses:", error);
            }
        };

        fetchUsers(); // Fetch users
        fetchAddresses(); // Fetch addresses
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "f" || event.key === "F") {
                setIsMapModalOpen(false); // Close map modal when "F" is pressed
            }
        };

        // Add event listener for keydown
        document.addEventListener("keydown", handleKeyDown);

        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const handleUserClick = (latitude: number, longitude: number, index: number) => {
        setSelectedLocation([latitude, longitude]);
        setActiveRowIndex(index); // Set the active row index
    
        // Open the popup for the selected marker
        if (markerRefs.current[index]) {
            markerRefs.current[index].openPopup();
        }
    
        // Close all other popups
        markerRefs.current.forEach((ref, i) => {
            if (i !== index && ref) {
                ref.closePopup();
            }
        });
    
        // Center the map explicitly
        if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 14, { animate: true });
        }
    
        setSelectedMarker(index);
    };

    const mapRef = useRef<L.Map | null>(null);
    
    const confirmDeleteAccount = async (id: number) => {
        try {
            alert(id);
            const response = await fetch(`${serverURL}/api/users/${id}`, {
                method: "DELETE",
            });
    
            if (response.ok) {
                setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
                setIsDeleteModalOpen(false);
                alert("User and associated vendor data deleted successfully.");
            } else {
                alert("Failed to delete user. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("An error occurred while deleting the user.");
        }
    };
    

 
    const handleViewAccount = (user: any) => {
        setSelectedUser(user);
        setIsModalOpen(true); 
    };


    const handleOpenMapModal = () => {
        setIsMapModalOpen(true); // Open the map modal
    };

    return (
        <div className="p-6 overflow-hidden">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold mb-6">User Management</h1>
                {/* Map Button */}
                <button
                    onClick={handleOpenMapModal}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                    Show Map
                </button>
            </div>
            
            {/* User Table */}
            <div className="overflow-y-auto max-h-96 border border-gray-200 rounded-md">
                <table className="w-full border-collapse border border-gray-200">
                    <thead className="bg-gray-100 sticky top-0">
                        <tr>
                            <th className="text-left p-3 border border-gray-200">User</th>
                            <th className="text-left p-3 border border-gray-200">Gender</th>
                            <th className="text-left p-3 border border-gray-200">Status</th>
                            <th className="text-left p-3 border border-gray-200">Email</th>
                            <th className="text-left p-3 border border-gray-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="odd:bg-white even:bg-gray-50">
                                <td className="p-3 border border-gray-200">
                                    <div className="flex items-center">
                                        <img
                                            className="w-10 h-10 rounded-full border mr-3 border-green-500 object-cover"
                                            src={user.user_img || profile}
                                            alt={user.fullName}
                                        />
                                        <div>
                                            <div className="font-semibold">{user.fullName}</div>
                                            <small className="text-gray-500">{user.role}</small>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-3 border border-gray-200">{user.Gender}</td>
                                <td className="p-3 border border-gray-200">
                                    <span
                                        className={`px-3 py-1 rounded-full text-white ${
                                            user.status === "Active"
                                                ? "bg-green-500"
                                                : user.status === "Inactive"
                                                ? "bg-gray-500"
                                                : user.status === "Banned"
                                                ? "bg-red-500"
                                                : "bg-yellow-500"
                                        }`}
                                    >
                                        {user.status}
                                    </span>
                                </td>
                                <td className="p-3 border border-gray-200">{user.email}</td>
                                <td className="p-3 border border-gray-200">
                                    <button
                                        onClick={() => handleViewAccount(user)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => confirmDeleteAccount(user.id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            {isMapModalOpen && (
            <p className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-10 text-white text-sm font-semibold bg-black bg-opacity-60 p-2 rounded-md ">
            Press F to return or exit the map.
            </p>
            )}

{isMapModalOpen && (
            <div className="absolute top-20 right-5 z-50 text-white text-sm font-semibold bg-black bg-opacity-60 p-2 rounded-md">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left">Users</th>
                        </tr>
                    </thead>
                    <tbody>
                        {addresses.map((address, index) => (
                            <tr
                                key={index}
                                className={`border-b border-gray-500 cursor-pointer hover:bg-gray-700 ${
                                    activeRowIndex === index ? "bg-green-500" : "" // Highlight active row
                                }`}
                                onClick={() => handleUserClick(address.latitude, address.longitude, index)}
                            >
                                <td className="p-2">
                                    <img
                                        src={address.user_image}
                                        alt="User Avatar"
                                        className="w-12 h-12 object-cover rounded-full"
                                    />
                                </td>
                                <td className="p-2">
                                    {address.first_name} {address.last_name}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}


            {/* Map Modal */}
            {isMapModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white w-full h-full relative">
                        <MapContainer
                            center={selectedLocation}
                            zoom={zoom}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            />
                            <UpdateMapView center={selectedLocation} zoom={zoom} />
                            {addresses.map((address, index) => (
                                <Marker
                                    key={index}
                                    position={[address.latitude, address.longitude]}
                                    icon={new L.Icon({
                                        iconUrl: Pin,
                                        iconSize: [30, 30],
                                        iconAnchor: [15, 0],
                                    })}
                                    ref={(ref) => (markerRefs.current[index] = ref)} // Save the reference
                                >
                                    <Popup>
                                    <strong>Location:</strong>
                                    <p><strong>User: </strong>{address.first_name} {address.last_name}</p>
                                    <p>{address.province}, {address.city}, {address.barangay}</p>
                                    <p>Postal Code: {address.postal_code}</p>
                                    <p>Latitude: {address.latitude}</p>
                                    <p>Longitude: {address.longitude}</p>
                                </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                        <button
                            onClick={() => setIsMapModalOpen(false)}
                            className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md"
                        >
                            Close Map
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConsumerManagement;
