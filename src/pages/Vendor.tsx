import React, { useState } from 'react';

const vendorPage: React.FC = () => {
  // Dummy data for vendors
  const vendors = [
    { city: 'Daet', name: 'Vendor 1', contact: '123-456-7890', image: 'https://thumbs.dreamstime.com/z/asian-market-booth-vendor-buyers-isolated-white-background-indian-street-souk-kiosk-spices-local-outdoor-bazaar-vector-200378147.jpg?ct=jpeg' },
    { city: 'Daet', name: 'Vendor 5', contact: '987-654-3210', image: 'https://thumbs.dreamstime.com/z/asian-market-booth-vendor-buyers-isolated-white-background-indian-street-souk-kiosk-spices-local-outdoor-bazaar-vector-200378147.jpg?ct=jpeg' },
    { city: 'Daet', name: 'Vendor 6', contact: '987-654-3210', image: 'https://thumbs.dreamstime.com/z/asian-market-booth-vendor-buyers-isolated-white-background-indian-street-souk-kiosk-spices-local-outdoor-bazaar-vector-200378147.jpg?ct=jpeg' },
    { city: 'Daet', name: 'Vendor 7', contact: '987-654-3210', image: 'https://thumbs.dreamstime.com/z/asian-market-booth-vendor-buyers-isolated-white-background-indian-street-souk-kiosk-spices-local-outdoor-bazaar-vector-200378147.jpg?ct=jpeg' },
    { city: 'Bagasbas', name: 'Vendor 2', contact: '987-654-3210', image: 'https://thumbs.dreamstime.com/z/asian-market-booth-vendor-buyers-isolated-white-background-indian-street-souk-kiosk-spices-local-outdoor-bazaar-vector-200378147.jpg?ct=jpeg' },
    { city: 'Bagasbas', name: 'Vendor 3', contact: '555-555-5555', image: 'https://thumbs.dreamstime.com/z/asian-market-booth-vendor-buyers-isolated-white-background-indian-street-souk-kiosk-spices-local-outdoor-bazaar-vector-200378147.jpg?ct=jpeg' },
    { city: 'Bagasbas', name: 'Vendor 4', contact: '444-444-4444', image: 'https://thumbs.dreamstime.com/z/asian-market-booth-vendor-buyers-isolated-white-background-indian-street-souk-kiosk-spices-local-outdoor-bazaar-vector-200378147.jpg?ct=jpeg' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');

  const filteredVendors = vendors.filter(vendor => {
    return (
      (vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) || vendor.contact.includes(searchTerm)) &&
      (filterCity ? vendor.city === filterCity : true)
    );
  });

  // Group vendors by city
  const groupedVendors = filteredVendors.reduce((acc, vendor) => {
    (acc[vendor.city] = acc[vendor.city] || []).push(vendor);
    return acc;
  }, {});

  return (
    <div className="mt-20">
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
          className="p-2 border border-gray-300 "
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
        >
          <option value="">Filter by City</option>
          <option value="Daet">Bagasbas</option>
          <option value="Bagasbas">Daet</option>
        </select>
        <button className="p-2 bg-green-900 text-white ">
          <i className="fas fa-search"></i> {/* Search Icon */}
        </button>
      </div>

      {/* Vendors Section */}
      <div className="mt-10">
        {Object.keys(groupedVendors).map((city) => (
          <section key={city} className="mb-8 border border-gray-200 p-4">
            <h2 className="text-xl font-semibold mb-4">{city}</h2>
            <div className="flex space-x-4 overflow-x-auto">
              {groupedVendors[city].map((vendor) => (
                <div key={vendor.name} className="card w-48 bg-white border border-gray-300 rounded-lg p-4 shadow-md">
                  <img src={vendor.image} alt={vendor.name} className="w-full h-32 object-cover rounded-lg mb-2" />
                  <h3 className="font-medium">{vendor.name}</h3>
                  <p className="text-sm text-gray-500">{vendor.contact}</p>
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

export default vendorPage;
