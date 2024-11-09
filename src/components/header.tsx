import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logoIcon.png';

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="w-full h-19 bg-green-800 flex justify-between items-center px-4 text-white">
            <div className="flex">
                <img src={logo} alt="Logo"  className="h-16 w-16 object-contain" />
                <div className='ml-4 flex flex-col justify-center'>
                    <div className="text-white text-lg sm:text-sm md:text-lg lg:text-xm font-bold">Camarines Norte</div>
                    <div className="text-white text-sm sm:text-sm md:text-xs lg:text-xm font-bold">Tour & Shop Hub</div>
                </div>
            </div>
            
            {/* Desktop Links */}
            <ul className="hidden md:flex justify-center space-x-6 mr-8">
                <li><Link to="/" className="relative after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-[-4px]  after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full   ">Home</Link></li>
                <li><Link to="/shop" className="relative after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-[-4px]  after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full">Shop</Link></li>
                <li><Link to="/vendor" className="relative after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-[-4px]  after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full   ">Vendor</Link></li>
                <li><Link to="/about" className="relative after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-[-4px]  after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full">About</Link></li>
            </ul>

            {/* Menu Icon for Mobile */}
            <div className="md:hidden cursor-pointer text-white text-2xl" onClick={toggleMenu}>
                ☰
            </div>

            {/* Mobile Links */}
            {/* Sidebar for Mobile */}
            <div
              className={`fixed top-0 right-0 h-full w-1/2  bg-green-800 via-green-800 bg-[length:100%] transform ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            } transition-transform duration-300 ease-in-out z-50`}
            
            
            >
                <button
                    className="absolute top-4 right-4 text-white text-2xl"
                    onClick={toggleMenu}
                >
                    ×
                </button>
                <ul className="flex flex-col mt-20 space-y-6 p-6 text-white">
                    <li><Link to="/" onClick={toggleMenu} className="hover:text-gray-300">Home</Link></li>
                    <li><Link to="/shop" onClick={toggleMenu} className="hover:text-gray-300">Shop</Link></li>
                    <li><Link to="/vendor" onClick={toggleMenu} className="hover:text-gray-300">Vendor</Link></li>
                    <li><Link to="/about" onClick={toggleMenu} className="hover:text-gray-300">About</Link></li>
                </ul>
            </div>
        </nav>
    );
};

export default Header;
