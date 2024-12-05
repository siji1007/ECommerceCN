import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logoIcon.png';
import { FaUser } from 'react-icons/fa';
import ModalLogin from '../components/Modal_login';
import axios from 'axios';
import host from '../host/host.txt?raw';


const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fullName, setFullName] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility
    const navigate = useNavigate();
    const serverUrl = host.trim();

    const location = useLocation(); // Get the current location

    const toggleMenu = () => setIsOpen(!isOpen);
    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const isActive = (path: string) => location.pathname === path;
    const storeAuth = localStorage.getItem('Auth') || '';

    // useEffect to read from localStorage when the component mounts
    useEffect(() => {
      const storedFullName = localStorage.getItem('userFullName');
 
      if (storedFullName) {
        setFullName(storedFullName); // Set the state with the stored name
      }
    }, []);

    // Logout function to clear the session and redirect to home page
    const handleLogout = () => {
        // Clear user information from localStorage
        localStorage.removeItem('userFullName');  // Remove userFullName from localStorage
        localStorage.removeItem('Auth');  // Remove Auth from localStorage (if you store the user session here)
    
        // Optionally, send a request to the server to log out or invalidate the session
        fetch(serverUrl + '/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',  // Ensure cookies are sent
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Logout successful');
                setDropdownOpen(false);  // Close the dropdown or any other UI elements
                setFullName('');  // Clear the state for fullName
                navigate('');  // Redirect to login page
            } else {
                console.error('Logout failed');
            }
        })
        .catch(error => {
            console.error('Error during logout:', error);
            setDropdownOpen(false);
            setFullName('');
            navigate('/login');
        });
    };
    
   
    
    
    
    
    
    

    // useEffect to check session when the component mounts


    return (
        <>
            <nav className="fixed z-40 w-full h-19 bg-gradient-to-r from-white to-green-900 flex justify-between items-center px-4 text-white">
                <div className="flex">
                    <Link to="/">
                        <img src={logo} alt="Logo" className="h-16 w-16 object-contain" />
                    </Link>
                    <div className="ml-4 flex flex-col justify-center">
                        <div className="text-green-900 text-lg sm:text-sm md:text-lg lg:text-xm font-bold">Camarines Norte</div>
                        <div className="text-green-900 text-sm sm:text-sm md:text-xs lg:text-xm font-bold">Tour & Shop Hub</div>
                    </div>
                </div>

                {/* Desktop Links */}
                <ul className="hidden md:flex justify-center space-x-6 mr-8">
                    <li><Link to="/" className={`relative after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-[-4px] after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full ${isActive('/') ? 'after:w-full after:bg-white' : ''}`} > Home </Link></li>
                    <li><Link to="/shop" className={`relative after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-[-4px] after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full ${isActive('/shop') ? 'after:w-full after:bg-white' : ''}`} > Shop </Link></li>
                    <li><Link to="/vendor" className={`relative after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-[-4px] after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full ${isActive('/vendor') || isActive('/vendor/vendor_profile') ? 'after:w-full after:bg-white' : ''}`} > Vendor </Link></li>
                    <li><Link to="/about" className={`relative after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-[-4px] after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full ${isActive('/about') ? 'after:w-full after:bg-white' : ''}`} > About </Link></li>
                    <li className="font-bold"> 
                        {fullName ? (
                            <h1 className='ml-5'>Welcome, {fullName}!</h1>
                        ) : (
                            <h1></h1>
                        )}
                    </li>

                    {/* User Profile Icon */}
                    <li className="relative flex justify-center items-center">
                        {fullName ? (
                            <div 
                                className="flex items-center space-x-2 cursor-pointer"
                                onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown on click
                                onMouseEnter={() => setDropdownOpen(true)}  // Open dropdown on hover
                               
                            >
                                <FaUser />
                                <div className="ml-2">Profile</div>
                            </div>
                        ) : (
                            <Link to="#" onClick={toggleModal} className="flex items-center space-x-2">
                                <FaUser />
                                <span>{fullName}</span>
                            </Link>
                        )}

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div className="absolute top-full mt-2 bg-white text-black rounded shadow-lg p-4 w-40">
                                 <Link 
                                to={`/clientprofile/id=${storeAuth}`} 
                                className="block px-4 py-2 hover:bg-gray-200"
                                onClick={() => setDropdownOpen(false)} // Close dropdown on click
                            >
                                My Profile
                            </Link>
                                <button  className="block w-full text-left px-4 py-2 hover:bg-gray-200">Cart</button>
                                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-200">Logout</button>
                            </div>
                        )}
                    </li>
                </ul>

                {/* Menu Icon for Mobile */}
                <div className="md:hidden cursor-pointer text-white text-2xl" onClick={toggleMenu}>
                    ☰
                </div>

                {/* Sidebar for Mobile */}
                <div
                    className={`fixed top-0 right-0 h-full w-1/2 bg-green-800 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}
                >
                    <button className="absolute top-4 right-4 text-white text-2xl" onClick={toggleMenu}>
                        ×
                    </button>
                    <ul className="flex flex-col mt-20 space-y-6 p-6 text-white">
                        <li><Link to="/" onClick={toggleMenu} className="hover:text-gray-300">Home</Link></li>
                        <li><Link to="/shop" onClick={toggleMenu} className="hover:text-gray-300">Shop</Link></li>
                        <li><Link to="/vendor" onClick={toggleMenu} className="hover:text-gray-300">Vendor</Link></li>
                        <li><Link to="/about" onClick={toggleMenu} className="hover:text-gray-300">About</Link></li>
                    </ul>

                    {/* Profile Icon */}
                    <div className="absolute bottom-8 right-8 text-4xl cursor-pointer">
                        <Link onClick={toggleModal} className="text-white hover:text-gray-300" to={''}>
                            <FaUser />
                        </Link>
                    </div>
                </div>
            </nav>

            <ModalLogin isOpen={isModalOpen} onClose={toggleModal} />
        </>
    );
};

export default Header;
