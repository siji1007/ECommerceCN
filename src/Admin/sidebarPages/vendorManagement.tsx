import React from "react";

const VendorManagement: React.FC = () => {
    const vendors = [
        { id: 1, vendorName: "Vendor A", created: "2021/01/10", status: "Active", email: "vendorA@example.com" },
        { id: 2, vendorName: "Vendor B", created: "2021/05/15", status: "Inactive", email: "vendorB@example.com" },
        { id: 3, vendorName: "Vendor C", created: "2022/07/20", status: "Active", email: "vendorC@example.com" },
        { id: 4, vendorName: "Vendor D", created: "2023/03/12", status: "Pending", email: "vendorD@example.com" },
        { id: 5, vendorName: "Vendor E", created: "2023/08/05", status: "Banned", email: "vendorE@example.com" },
        { id: 6, vendorName: "Vendor F", created: "2023/09/25", status: "Inactive", email: "vendorF@example.com" },
        { id: 7, vendorName: "Vendor G", created: "2023/10/02", status: "Active", email: "vendorG@example.com" },
        { id: 8, vendorName: "Vendor H", created: "2023/11/10", status: "Pending", email: "vendorH@example.com" },
    ];

    const handleViewVendor = (id: number) => {
        alert(`Viewing vendor with ID ${id}`);
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
                        {vendors.map((vendor) => (
                            <tr key={vendor.id} className="odd:bg-white even:bg-gray-50">
                                <td className="p-3 border border-gray-200">{vendor.vendorName}</td>
                                <td className="p-3 border border-gray-200">{vendor.created}</td>
                                <td className="p-3 border border-gray-200">
                                    <span
                                        className={`px-3 py-1 rounded-full text-white ${
                                            vendor.status === "Active"
                                                ? "bg-green-500"
                                                : vendor.status === "Inactive"
                                                ? "bg-gray-500"
                                                : vendor.status === "Banned"
                                                ? "bg-red-500"
                                                : "bg-yellow-500"
                                        }`}
                                    >
                                        {vendor.status}
                                    </span>
                                </td>
                                <td className="p-3 border border-gray-200">{vendor.email}</td>
                                <td className="p-3 border border-gray-200">
                                    <button
                                        onClick={() => handleViewVendor(vendor.id)}
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
        </div>
    );
};

export default VendorManagement;
