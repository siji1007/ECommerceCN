import { FC, useState, FormEvent } from 'react';

interface ModalLoginProps {
    isOpen: boolean;
    onClose: () => void;
}

const ModalLogin: FC<ModalLoginProps> = ({ isOpen, onClose }) => {
    const [isSignUp, setIsSignUp] = useState(false); 
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    if (!isOpen) return null;

    const toggleForm = () => {
        setIsSignUp(!isSignUp);
        clearForm();
    };

    const clearForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };

    const handleLoginSubmit = (event: FormEvent) => {
        event.preventDefault();
        console.log('Login Data:', { email, password });
    };

    const handleSignUpSubmit = (event: FormEvent) => {
        event.preventDefault();
        console.log('Sign Up Data:', { name, email, password, confirmPassword });
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
                <h2 className="flex text-xl font-bold mb-4 justify-center items-center">
                    {isSignUp ? "Sign Up" : "Login"}
                </h2>
                
                {isSignUp ? (
                    <form onSubmit={handleSignUpSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-semibold">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                placeholder="Enter your full name"
                                autoComplete="name"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-semibold">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-semibold">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                placeholder="Create a password"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                placeholder="Confirm your password"
                                required
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
                    <form onSubmit={handleLoginSubmit} >
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-semibold">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-semibold">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                placeholder="Enter your password"
                                required
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
                    {isSignUp && (
                        <p className="mt-2 text-xs text-gray-500">
                            By signing up, you agree to our
                            <a href="/terms-of-service" target="_blank" className="text-blue-500 hover:underline ml-1 mr-1">
                                Terms of Service
                            </a> 
                            and 
                            <a href="/privacy-policy" target="_blank" className="text-blue-500 hover:underline ml-1">
                                Privacy Policy
                            </a>.
                        </p>
    )}
                </div>
            </div>
        </div>
    );
};

export default ModalLogin;
