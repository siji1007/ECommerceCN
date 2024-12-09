import React, { useEffect, useState } from "react";
import axios from "axios";
import host from "../../host/host.txt?raw";
import VendorProfile from '../../assets/image.png';

const VendorManagement: React.FC = () => {
    const [vendors, setVendors] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState<any>(null); // To store selected vendor details
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
    const [status, setStatus] = useState("Approve"); // Dropdown selected status
    const serverURl = host.trim();

    useEffect(() => {
        // Fetch vendors from the Flask API
        const fetchVendors = async () => {
            try {
                const response = await axios.get(serverURl + "/api/fetchVendors");
                setVendors(response.data);
            } catch (error) {
                console.error("Error fetching vendors:", error);
            }
        };

        fetchVendors();
    }, []);

    const handleViewVendor = async (id: number) => {
        try {
            // Fetch vendor details by ID
            const response = await axios.get(`${serverURl}/api/vendorDetails/${id}`);
            setSelectedVendor(response.data);
            setIsModalOpen(true); // Open modal
        } catch (error) {
            console.error("Error fetching vendor details:", error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedVendor(null); // Clear selected vendor details
    };

    const handleSubmit = async () => {
        if (!selectedVendor) {
            alert("No vendor selected");
            return;
        }
    
        const statusDropdown = document.getElementById('statusDropdown') as HTMLSelectElement;
        const selectedStatus = statusDropdown.value;
    
        try {
            const response = await axios.post(`${serverURl}/api/updateVendorStatus`, {
                ven_id: selectedVendor.ven_id,
                vendor_status: selectedStatus,
            });
    
            if (response.status === 200) {
                alert(`Vendor status updated to: ${selectedStatus}`);
                closeModal(); // Close the modal after submission
            } else {
                alert("Failed to update vendor status");
            }
        } catch (error) {
            console.error("Error updating vendor status:", error);
            alert("An error occurred while updating vendor status");
        }
    }

    const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(event.target.value); // Update the selected status
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Vendor Management</h1>
            <div className="overflow-y-auto max-h-96 border border-gray-200 rounded-md">
                <table className="w-full border-collapse border border-gray-200">
                    <thead className="bg-gray-100 sticky top-0">
                        <tr>
                            <th className="text-left p-3 border border-gray-200">Vendor Name</th>
                            <th className="text-left p-3 border border-gray-200">Created</th>
                            <th className="text-left p-3 border border-gray-200">Status</th>
                            <th className="text-left p-3 border border-gray-200">Email</th>
                            <th className="text-left p-3 border border-gray-200">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendors.map((vendor: any) => (
                            <tr key={vendor.ven_id} className="odd:bg-white even:bg-gray-50">
                                <td className="p-3 border border-gray-200">{vendor.vendor_name}</td>
                                <td className="p-3 border border-gray-200">{vendor.created_at}</td>
                                <td className="p-3 border border-gray-200">
                                    <span
                                        className={`px-3 py-1 rounded-full text-white ${
                                            vendor.vendor_status === "Verified"
                                                ? "bg-green-500"
                                                : vendor.vendor_status === "Pending"
                                                ? "bg-yellow-500"
                                                : vendor.vendor_status === "Rejected"
                                                ? "bg-red-500"
                                                : "bg-yellow-500"
                                        }`}
                                    >
                                        {vendor.vendor_status}
                                    </span>
                                </td>
                                <td className="p-3 border border-gray-200">{vendor.vendor_email}</td>
                                <td className="p-3 border border-gray-200">
                                    <button
                                        onClick={() => handleViewVendor(vendor.ven_id)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && selectedVendor && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto">
                    <div className="bg-white rounded-md shadow-md p-6 relative w-full max-w-3xl h-[80%] overflow-y-auto">
                        <button
                            onClick={closeModal}
                            className="absolute top-1 right-1 text-gray-600 hover:text-red-600 text-xl font-bold"
                        >
                            &times;
                        </button>

                        <h2 className="text-lg font-bold mb-4">Seller Information</h2>
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gray-300 rounded-full">
                                    <img src={VendorProfile} alt="profile" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">{selectedVendor.vendor_name}</p>
                                    <p className="text-sm text-gray-500">{selectedVendor.vendor_email}</p>
                                </div>
                            </div>
                            <p className="text-sm text-black-700 font-semibold">
                                {selectedVendor.vendor_classification}
                            </p>
                        </div>

                        {/* Business Address */}
                        <div className="mb-6">
                            <p className="font-bold mb-2">Business Address</p>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Province" className="border rounded-md p-2 w-full" />
                                <input type="text" placeholder="City" className="border rounded-md p-2 w-full" />
                                <input type="text" placeholder="Barangay" className="border rounded-md p-2 w-full" />
                                <input type="text" placeholder="Postal Code" className="border rounded-md p-2 w-full" />
                            </div>
                        </div>

                        <div className="mb-6 shadow">
                            <p className="font-bold mb-2">Map Here</p>
                            <iframe
                                title="Map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093066!2d144.9556513156555!3d-37.81732397975164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xff55c0f59bdfe98a!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sph!4v1619941075868!5m2!1sen!2sph"
                                className="w-full h-full rounded"
                                allowFullScreen=""
                                loading="lazy"
                            />
                        </div>

                        <div className="">
                            <p className="font-bold mb-2">Document Evidence</p>
                            <img
                                src={selectedVendor.document_img_src}
                                alt="Vendor Document"
                                className="w-full h-auto border mt-2"
                            />
                        </div>

                        <div className="mt-6 mb-6">
                            <label className="block font-bold mb-2" htmlFor="statusDropdown">
                                Status
                            </label>
                            <select
                                id="statusDropdown"
                                className="border rounded-md p-2 w-full"
                                value={status}
                                onChange={handleDropdownChange}
                            >
                                <option value="Verified">Approved</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 bg-green-800 text-white rounded-md hover:bg-blue-600"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorManagement;
