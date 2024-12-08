import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEye } from 'react-icons/fa';
import host from "../host/host.txt?raw";
import { useNavigate } from 'react-router-dom';


const VendorPage: React.FC = () => {
  const [vendors, setVendors] = useState<any[]>([]); // Stores all vendors
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClassification, setFilterClassification] = useState('');
  const serverURL = host.trim();

  const navigate = useNavigate();

  // Fetch vendors from the API
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get(serverURL + '/api/fetchVendors');
        setVendors(response.data);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };

    fetchVendors();
  }, []);

  // Filtered and grouped vendors
  const filteredVendors = vendors.filter((vendor) => {
    return (
      (vendor.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.vendor_contact_number.includes(searchTerm)) &&
      (filterClassification ? vendor.vendor_classification === filterClassification : true)
    );
  });

  const groupedVendors = filteredVendors.reduce((acc, vendor) => {
    (acc[vendor.vendor_classification] = acc[vendor.vendor_classification] || []).push(vendor);
    return acc;
  }, {} as Record<string, any[]>);

  const handleEyeClick = (vendor: any) => {
    // Log the vendor object to see its structure
    console.log(vendor);
  
    // Check if vendorId exists and then navigate
    if (vendor && vendor.ven_id) {
      navigate('/vendor/vendor_profile', { state: { vendorId: vendor.ven_id } });
      // alert(vendor.ven_id); // Make sure you're using the correct property name
    } else {
      console.log('vendor.ven_id is undefined');
      alert('Vendor ID not found');
    }
  };
  

  return (
    <div className="flex flex-col h-auto pt-10 min-h-screen">
      {/* Search and Filter Section */}
      <div className="flex justify-end items-center p-4">
        <input
          type="text"
          placeholder="Search vendors..."
          className="p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-2 border border-gray-300"
          value={filterClassification}
          onChange={(e) => setFilterClassification(e.target.value)}
        >
          <option value="">Filter by Classification</option>
          <option value="Freelancer">Freelancer</option>
          <option value="Business Owner">Business Owner</option>
          {/* Add more options as needed */}
        </select>
        <button className="p-2 bg-green-900 text-white">
          <i className="fas fa-search"></i>
        </button>
      </div>

      {/* Vendors Section */}
      <div className="mt-10">
        {Object.keys(groupedVendors).map((classification) => (
          <section key={classification} className="mb-8 border border-gray-200 p-4">
            <h2 className="text-xl font-semibold mb-4">{classification}</h2>
            <div className="flex space-x-4 overflow-x-auto">
              {groupedVendors[classification].map((vendor) => (
                <div
                  key={vendor.ven_id}
                  className="relative w-48 bg-white border rounded-lg shadow-md p-2 cursor-pointer group transform transition-transform duration-300 hover:scale-105"
                >
                  {/* Vendor Image */}
                  <div className="relative">
                    <img
                      src={'src/assets/image.png'} // You can replace with vendor image URL
                      alt={vendor.vendor_name}
                      className="w-full h-32 object-cover rounded-md mb-2 border"
                    />
                  </div>
                  
                  {/* Eye Icon Button */}
                  
                  <button
                    onClick={() => handleEyeClick(vendor)} // Pass vendor as an argument
                    className="mt-2 text-white rounded-lg px-4 items-center justify-center py-2 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex"
                  >
                    <FaEye className="text-black h-5 w-5 mr-2" />
                  </button>
         
                  {/* Vendor Name */}
                  <h3 className="text-lg font-medium">{vendor.vendor_name}</h3>
         
                  {/* Contact Number */}
                  <p className="text-sm text-gray-500 flex items-center">
                    <i className="fas fa-phone-alt text-green-600 mr-2"></i>
                    {vendor.vendor_contact_number}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button className="text-blue-500">See more...</button>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default VendorPage;
