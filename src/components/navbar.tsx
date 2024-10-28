// src/components/Navbar.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logoIcon.png'

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="flex items-center justify-between p-4 bg-green-800 text-white">
            <div className="flex">
            <img src={logo}></img>
              <div>
                <div className="text-2xl font-bold">Camarines Norte</div>
                <div className="text-1xl font-medium text-left">Tour & Shop Hub</div>
              </div>
            </div>
            
            
            
            {/* Desktop Links */}
            <ul className="hidden md:flex space-x-6">
                <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
                <li><Link to="/about" className="hover:text-gray-300">About</Link></li>
                <li><Link to="/contact" className="hover:text-gray-300">Contact</Link></li>
            </ul>

            {/* Menu Icon for Mobile */}
            <div className="md:hidden cursor-pointer" onClick={toggleMenu}>
                ☰
            </div>

            {/* Mobile Links */}
            {isOpen && (
                <ul className="absolute top-16 right-4 w-40 flex flex-col bg-gray-800 rounded-lg p-4 space-y-4 md:hidden">
                    <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
                    <li><Link to="/about" className="hover:text-gray-300">About</Link></li>
                    <li><Link to="/contact" className="hover:text-gray-300">Contact</Link></li>
                </ul>
            )}
        </nav>
    );
};

export default Navbar;
