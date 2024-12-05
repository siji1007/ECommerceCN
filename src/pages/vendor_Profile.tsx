// Vendor information is not showing

import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import host from '../host/host.txt?raw';
import { FaProductHunt } from 'react-icons/fa';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

import Profile from '../../src/assets/image.png';

const VendorProfile = () => {
    const location = useLocation();
    const { vendorId } = location.state || {}; // Access vendorId passed as state
    const serverURL = host.trim();
  
    const [vendorData, setVendorData] = useState<Vendor | null>(null); // Specify the type for vendorData
    const [products, setProducts] = useState<Product[]>([]); // Specify the type for products
    const [loading, setLoading] = useState<boolean>(true);
  
    // Fetch vendor data and products when the component is mounted
    useEffect(() => {
        if (!vendorId) return;
      
        // Fetch vendor details using vendorId
        fetch(serverURL + `/api/vendor/${vendorId}`)
          .then((response) => response.json())
          .then((data) => {
            console.log('Vendor Data:', data); // Log vendor data
            setVendorData(data); // Update state
          })
          .catch((error) => console.error('Error fetching vendor data:', error));
      
        // Fetch products related to this vendor
        fetch(serverURL + `/FetchProducts/${vendorId}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Failed to fetch products: ${response.statusText}`);
            }
            return response.json(); // Only try to parse JSON if the response is OK
          })
          .then((data) => {
            setProducts(data.products); // Assuming 'products' is the key in your response
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching products:', error);
            setLoading(false);
          });
      }, [vendorId]);
      
      // Add a useEffect to track changes in vendorData
      
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (!vendorData) {
      return <div>No vendor data found.</div>;
    }
  
    return (
      <div className="flex flex-col h-auto pt-16 min-h-screen">
        {/* Vendor Image */}
        <div className="relative mb-6">
  {/* Back Icon */}
  <button 
    className="absolute top-0 left-0 text-gray-800 hover:text-gray-500 transition-colors duration-200 p-2"
    onClick={() => window.history.back()} // Navigate back to the previous page
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-10 h-10 shadow rounded-lg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 19.5L8.25 12l7.5-7.5"
      />
    </svg>
  </button>

  {/* Vendor Image */}
  <div className="flex justify-center">
    <img
      src={Profile} // Use default image if image_url is unavailable
      alt={vendorData.vendor_name}
      className="w-36 h-36 rounded-full object-cover"
    />
  </div>
</div>


        <section className="flex justify-center space-x-4 mt-6">
                    {/* Facebook */}
                    <a
                      href="https://www.facebook.com/YourPage"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-800 hover:text-blue-600 transition-colors duration-200"
                    >
                      <i className="fab fa-facebook text-2xl"></i>
                    </a>

                    {/* Instagram */}
                    <a
                      href="https://www.instagram.com/YourProfile"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-800 hover:text-pink-500 transition-colors duration-200"
                    >
                      <i className="fab fa-instagram text-2xl"></i>
                    </a>

                    {/* YouTube */}
                    <a
                      href="https://www.youtube.com/YourChannel"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-800 hover:text-red-500 transition-colors duration-200"
                    >
                      <i className="fab fa-youtube text-2xl"></i>
                    </a>
        </section>
  
        {/* Vendor Name */}
        <div className="text-center mb-8 border-b">
          <h1 className="text-3xl font-semibold text-gray-800">{vendorData.vendor_name}</h1>
          <p>{vendorData.vendor_classification}</p>
        </div>
  
        {/* Vendor Products */}
        <div className="mt-12">
         
        
          <div className="flex flex-wrap gap-4 m-10">
            {products.length === 0 ? (
              <p className="text-center col-span-4 text-gray-500">No products available</p>
            ) : (
              products.map((product) => (
                <div    
                  className="relative w-48 bg-white border rounded-lg shadow-md p-2 cursor-pointer group transform transition-transform duration-300 hover:scale-105"
                  key={product.prod_id}
                >
                  <img
                    src={product.prod_image_id || '/default-product.jpg'}
                    alt={product.prod_name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-800">{product.prod_name}</h3>
                    <p className="text-sm text-gray-600 mt-2">{product.prod_descript}</p>
                    <p className="mt-2 font-semibold text-gray-800">
                      <strong>Price:</strong> ₱{product.prod_disc_price || product.prod_price}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default VendorProfile;
  