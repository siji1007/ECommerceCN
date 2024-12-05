import { FC, useState, FormEvent } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Cookies from 'js-cookie';
import host_backend from '../host/host.txt?raw';
import { useNavigate } from 'react-router-dom';



interface ModalLoginProps {
    isOpen: boolean;
    onClose: () => void;
}



const ModalLogin: FC<ModalLoginProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [year, setYear] = useState('');
    const [gender, setGender] = useState('');
    const [emailOrMobile, setEmailOrMobile] = useState('');
    const [password, setPassword] = useState('');
    const serverUrl = host_backend.trim();

    if (!isOpen) return null;

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
      };
    

    const toggleForm = () => {
        setIsSignUp(!isSignUp);
        clearForm();
    };

    const clearForm = () => {
        setFirstName('');
        setLastName('');
        setMonth('');
        setDay('');
        setYear('');
        setGender('');
        setEmailOrMobile('');
        setPassword('');
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        // Prepare the data to be sent to the Flask API
        const data = {
            emailOrMobile,
            password
        };

        try {
            const response = await fetch(serverUrl + '/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
        
            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.message || 'Login failed');
            }
        
            const result = await response.json();
            alert(`LOGIN successful! Welcome, ${result.user.full_name}`);
            localStorage.setItem('userFullName', result.user.full_name);
            localStorage.setItem('Auth', result.user.id);
            Cookies.set('unauth_cookie', result.unauth_cookie, { expires: 7 });
            
        
            // Navigate to another page
            window.location.reload(); 
        } catch (error: unknown) {
        // TypeScript requires error to be cast to an instance of Error
        if (error instanceof Error) {
            console.error('Error during login:', error.message);
            alert(error.message || 'An unexpected error occurred. Please try again.');
        } else {
            console.error('Unknown error occurred');
            alert('An unexpected error occurred. Please try again.');
        }
    }
        
    };
    const handleSignUpSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
    
        // Create the data object to be sent to the Flask server
        const data = {
            first_name: firstName,      // Send first name
            last_name: lastName,        // Send last name
            birth_month: month,         // Send birth month
            birth_day: day,             // Send birth day
            birth_year: year,           // Send birth year
            email_or_mobile: emailOrMobile,  // Send email or mobile
            password: password,         // Send password
        };
    
        try {
            const response = await fetch( serverUrl + "/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
    
            const result = await response.json();
            if (response.ok) {
                console.log("User registered successfully:", result);
             
                // Optionally redirect or show success message
            } else {
                console.error("Error registering user:", result.message);
                // Show error message
            }
        } catch (error) {
            console.error("Request failed", error);
        }
    };
    
    
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-md w-1/2 relative ">
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
                        {/* Full Name Section */}
                        <div className="mb-4 flex gap-4">
                            <div className="w-1/2">
                                <label htmlFor="firstName" className="block text-sm font-semibold"> First Name </label>
                                <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Enter your first name" required />  
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="lastName" className="block text-sm font-semibold">
                                    Last Name
                                </label>
                                <input type="text" id="lastName" value={lastName}onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Enter your last name" required
                                />
                            </div>
                        </div>
                        {/* Birthdate Section */}
                        <div className="mb-4">

                        <label htmlFor="month" className="block text-sm font-semibold mt-2" style={{ whiteSpace: "nowrap" }} >
                            Birthdate
                        </label>
                        <div className="flex flex-1 gap-4">
                            <div className="flex-1">
                                <select id="month" value={month} onChange={(e) => setMonth(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md w-full" required> <option value="">Month</option> <option value="January">January</option> <option value="February">February</option> {/* Continue with all months */} </select>
                            </div>
                            <div className="flex-1">
                                <select id="day" value={day} onChange={(e) => setDay(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md w-full" required >
                                    <option value="">Day</option>
                                    {Array.from({ length: 31 }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {i + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-1">
                                <select id="year" value={year} onChange={(e) => setYear(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-md w-full"
                                    required
                                >
                                    <option value="">Year</option>
                                    {Array.from({ length: 100 }, (_, i) => (
                                        <option key={i} value={new Date().getFullYear() - i}>
                                            {new Date().getFullYear() - i}
                                        </option>
                                    ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Email or Mobile Number Section */}
                        <div className="mb-4">
                            <label htmlFor="emailOrMobile" className="block text-sm font-semibold">
                                Email or Mobile Number
                            </label>
                            <input type="text" id="emailOrMobile" value={emailOrMobile} onChange={(e) => setEmailOrMobile(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Enter your email or mobile number" required />
                        </div>
                        {/* Password Section */}
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-semibold">
                                New Password
                            </label>
                            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Create a password" required />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-green-800 text-white py-2 rounded-md"
                        >
                            Sign Up
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleLoginSubmit}>
                        <div className="mb-4">
                            <label htmlFor="emailOrMobile" className="block text-sm font-semibold">
                                Email or Mobile Number
                            </label>
                            <input type="text" id="emailOrMobile" value={emailOrMobile} onChange={(e) => setEmailOrMobile(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Enter your email or mobile number" required />
                        </div>
                        <div className="mb-4 relative">
                                <label htmlFor="password" className="block text-sm font-semibold">
                                    Password
                                </label>
                                <div className="relative"> {/* Wrap the input and button */}
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10"  // Add pr-10 for padding to the right
                                        placeholder="Enter your password"
                                        required
                                    />
                                    {/* Eye icon button to toggle password visibility */}
                                    <button
                                        className="absolute inset-y-0 right-2 flex items-center justify-center text-gray-600"
                                        type="button"
                                        onClick={handleTogglePassword}
                                    >
                                        {/* Displaying the correct icon */}
                                        {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                                    </button>
                                </div>
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
                    {isSignUp ? (
                        <p className="text-sm">
                            Already have an account?{' '}
                            <span className="text-blue-600 cursor-pointer" onClick={toggleForm} > Login </span>
                        </p>
                    ) : (
                        <p className="text-sm">
                            Don't have an account?{' '}
                            <span
                                className="text-blue-600 cursor-pointer"
                                onClick={toggleForm}
                            >
                                Sign Up
                            </span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalLogin;
