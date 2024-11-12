import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
    id: number;
    Fname: string;
    Lname: string;
}

const HomePage: React.FC = () => {

    return (
        <div>
            <div className="relative flex items-center justify-center min-h-screen bg-custom-bg bg-cover bg-center text-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-50"></div>
            
            {/* Content */}
            <div className="relative z-10 p-8">
                <h1 className="text-9xl font-bold text-white mb-4">Calaguas Island</h1>
                <p className="text-lg text-gray-300 mb-8">
                Vinzons, Camarines Norte
                </p>
            </div>
            </div>
            <div className="relative flex items-center justify-center min-h-screen bg-custom-bg bg-cover bg-center text-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-50"></div>
            
            {/* Content */}
            <div className="relative z-10 p-8">
                <h1 className="text-9xl font-bold text-white mb-4">Calaguas Island</h1>
                <p className="text-lg text-gray-300 mb-8">
                Vinzons, Camarines Norte
                </p>
            </div>
            </div>
        </div>
    );
}

export default HomePage;
