import React, { FC, useState } from 'react';

interface ModalLoginProps {
    isOpen: boolean;
    onClose: () => void;
}

const ModalLogin: FC<ModalLoginProps> = ({ isOpen, onClose }) => {
    const [isSignUp, setIsSignUp] = useState(false);  // Toggle between login and signup forms

    if (!isOpen) return null;

    const toggleForm = () => {
        setIsSignUp(!isSignUp);  // Switch between login and signup
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-md w-96 relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 text-xl"
                >
                    ×
                </button>
                <h2 className="text-xl font-bold mb-4">{isSignUp ? "Sign Up" : "Login"}</h2>
                
                {isSignUp ? (
                    <form>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-semibold">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-semibold">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-semibold">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                placeholder="Create a password"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                placeholder="Confirm your password"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-green-800 text-white py-2 rounded-md"
                        >
                            Sign Up
                        </button>
                    </form>
                ) : (
                    <form >
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-semibold">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-semibold">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                placeholder="Enter your password"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-green-800 text-white py-2 rounded-md"
                        >
                            Login
                        </button>
                    </form>
                )}

                <div className="mt-4 text-center">
                    <span className="text-sm text-gray-600">
                        {isSignUp ? "Already have an account?" : "Don't have an account?"}
                        <button
                            onClick={toggleForm}
                            className="ml-2 text-blue-500 hover:underline"
                        >
                            {isSignUp ? "Login" : "Sign Up"}
                        </button>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ModalLogin;
