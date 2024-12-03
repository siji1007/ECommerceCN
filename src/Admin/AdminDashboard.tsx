import Profile from '../../src/assets/profiles/Profile.jpg'
import { FaCog } from 'react-icons/fa';

const AdminDashboard: React.FC = () =>{

      

  
   
    
  
    return (
   
       
        <div className="flex mt-16"> {/* main div of clientDashboard*/}
          {/* Sidebar Section */}
          <div className="w-64 bg-white text-white flex flex-col items-center py-8 h-screen">
          <div className="flex flex-col items-center justify-center mb-8">
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
               
                <button className="w-full py-2 px-4 mb-4 text-left text-black font-semibold hover:bg-green-600 rounded flex items-center">
                User Management
                </button>

                <button className="w-full py-2 px-4 mb-4 text-left text-black font-semibold hover:bg-green-600 rounded flex items-center">
                Product Management  
                </button>

                <button className="w-full py-2 px-4 mb-4 text-left text-black font-semibold hover:bg-green-600 rounded flex items-center">
                Sales Report
                </button>

                <button className="w-full py-2 px-4 mb-4 text-left text-black font-semibold hover:bg-green-600 rounded flex items-center">
                <FaCog className="h-5 w-5 mr-2" />
                Settings
                </button>

                {/* This div ensures the logout button is pushed to the bottom */}
                <div className="mt-auto ">
                    <button className="w-full py-2 px-4 bg-green-900 text-center hover:bg-green-600 rounded font-bold">
                    Logout
                    </button>
                </div>
            </div>

          </div>
    
          {/* main div */}
        </div>
      );
    };

export default AdminDashboard;