import Profile from '../../src/assets/profiles/Profile.jpg';
import { FaUsersCog } from "react-icons/fa";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FaMoneyBillTrendUp } from "react-icons/fa6";

import { FaCog } from 'react-icons/fa';

const AdminDashboard: React.FC = () =>{

    
    return (
        <div className="flex mt-16"> {/* main div of clientDashboard*/}
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
              <div className="w-full p-2  flex flex-col h-full mb-10">
                <button className="w-full py-2 px-4 mb-4 text-left text-black font-semibold hover:bg-green-600 hover:text-white rounded flex items-center"> <FaUsersCog className="h-5 w-5 mr-2" /> User Management </button>
                <button className="w-full py-2 px-4 mb-4 text-left text-black font-semibold hover:bg-green-600 hover:text-white rounded flex items-center"> <MdOutlineProductionQuantityLimits className="h-5 w-5 mr-2"/> Product Management </button>
                <button className="w-full py-2 px-4 mb-4 text-left text-black font-semibold hover:bg-green-600 hover:text-white rounded flex items-center"> <FaMoneyBillTrendUp className="h-5 w-5 mr-2" /> Sales Report </button>
                <button className="w-full py-2 px-4 mb-4 text-left text-black font-semibold hover:bg-green-600 hover:text-white rounded flex items-center"> <FaCog className="h-5 w-5 mr-2" /> Settings </button>
            </div>

          </div>
    
          <main>
            <h1>right information</h1>
          </main>
        </div>
      );
    };

export default AdminDashboard;