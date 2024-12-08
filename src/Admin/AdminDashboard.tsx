import Profile from '../../src/assets/profiles/Profile.jpg';
import { FaUsersCog } from "react-icons/fa";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { FaCog } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CustomerManagement from '../Admin/sidebarPages/consumerManagement'; 
import VendorManagement from '../Admin/sidebarPages/vendorManagement';
import Settings from '../Admin/sidebarPages/adminSettings';

const AdminDashboard: React.FC = () => {
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const [selectedDashboard, setSelectedDashboard] = useState<string | null>(null);
  const location = useLocation(); // Get the current URL path
  const adminID = localStorage.getItem('adminID'); 

  const toggleUserManagement = () => {
    setIsUserManagementOpen((prev) => !prev);
  };

  const handleCustomerClick = () => {
    setSelectedDashboard('customer'); 
  };

  const handleVendorClick = () => {
    setSelectedDashboard('vendor');
  };

  const handleSettings = () =>{
    setSelectedDashboard('settings');
  };


  const isCustomerActive = location.pathname === `/admin/id_admin=${adminID}/customer-management`;
  const isVendorActive = location.pathname ===`/admin/id_admin=${adminID}/vendor-management`;
  const isSettingsActive = location.pathname === `/admin/id_admin=${adminID}/settings`;


  useEffect(() => {
    if (isCustomerActive) {
      setIsUserManagementOpen(true);
    }
  }, [isCustomerActive]);

  return (
    <div className="flex ">
      {/* Sidebar Section */}
      <div className="w-64 bg-white text-white flex flex-col items-center py-8 h-screen border">
        <div className="flex flex-col items-center justify-center mb-8 border-b w-full">
          <img
            src={Profile}
            alt="Profile"
            className="w-24 h-24 rounded-full mb-4"
          />
          <h2 className="text-lg text-black font-semibold text-center">
            Welcome, Admin.
          </h2>
        </div>
        <div className="w-full p-2 flex flex-col h-full mb-10">
          {/* User Management Button */}
          <button
            className={`w-full py-2 px-4 mb-4 text-left font-semibold rounded ${
              isUserManagementOpen ? ' text-black flex' : 'flex text-black hover:bg-green-600 hover:text-white'
            }`}
            onClick={toggleUserManagement}
          >
            <FaUsersCog className="h-5 w-5 mr-2" /> 
            User Management
          </button>

          {isUserManagementOpen && (
            <div className="ml-8 flex flex-col">
              <Link to={`/admin/id_admin=${adminID}/customer-management`}>
                <button
                  className={`w-full py-2 px-4 mb-2 text-left font-semibold rounded ${
                    isCustomerActive ? 'bg-green-600 text-white' : 'text-black hover:bg-green-600 hover:text-white'
                  }`}
                  onClick={handleCustomerClick} 
                >
                  Customer
                </button>
              </Link>
              <Link to={`/admin/id_admin=${adminID}/vendor-management`}>
                <button
                  className={`w-full py-2 px-4 mb-2 text-left font-semibold rounded ${
                    isVendorActive ? 'bg-green-600 text-white' : 'text-black hover:bg-green-600 hover:text-white'
                  }`}
                  onClick={handleVendorClick} 
                >
                  Vendor
                </button>
              </Link>
            </div>
          )}

          <button className="w-full py-2 px-4 mb-4 text-left text-black font-semibold hover:bg-green-600 hover:text-white rounded flex items-center">
            <MdOutlineProductionQuantityLimits className="h-5 w-5 mr-2" /> Product Management
          </button>
          <button className="w-full py-2 px-4 mb-4 text-left text-black font-semibold hover:bg-green-600 hover:text-white rounded flex items-center">
            <FaMoneyBillTrendUp className="h-5 w-5 mr-2" /> Sales Report
          </button>
          <Link to={`/admin/id_admin=${adminID}/settings`}>
            <button  onClick={handleSettings}  className={`w-full py-2 px-4 mb-2 text-left font-semibold rounded ${
                    isSettingsActive ? 'flex bg-green-600 text-white' : 'flex text-black hover:bg-green-600 hover:text-white'
                  }`}> <FaCog className="h-5 w-5 mr-2" /> Settings </button>
          </Link>
        </div>
      </div>

      {/* Right Section - Dynamic Content */}
      <main className="flex-1 p-8">
        {selectedDashboard === 'customer' && <CustomerManagement/>}
        {selectedDashboard === 'vendor' && <VendorManagement/>}
        {selectedDashboard === 'settings' && <Settings/>}

      
      </main>
    </div>
  );
};

export default AdminDashboard;
