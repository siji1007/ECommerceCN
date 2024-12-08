import React, { useEffect, useState } from "react";
import profile from "/src/assets/profiles/Profile.jpg"; // Make sure this path is correct
import host from "../../host/host.txt?raw";

const ConsumerManagement: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);  // State to hold the user data
    const serverURL = host.trim();

    // Fetch users data from the Flask API on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(serverURL + "/api/users");  // Adjust the API endpoint if needed
                const data = await response.json();
                setUsers(data);  // Set the user data to state
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();  // Call the fetch function
    }, []);  // Empty dependency array means this runs once when the component mounts

    const handleDeleteAccount = (id: number) => {
        alert(`Account with ID ${id} deleted`);
    };

    const handleViewAccount = (id: number) => {
        alert(`Viewing account with ID ${id}`);
    };

    const handleEditAccount = (id: number) => {
        alert(`Editing account with ID ${id}`);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">User Management</h1>
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
                                            className="w-10 h-10 rounded-full bg-gray-300 mr-3"
                                            src={user.user_img || profile}  // Use user image if available
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
                                        onClick={() => handleViewAccount(user.id)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleDeleteAccount(user.id)}
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
        </div>
    );
};

export default ConsumerManagement;
