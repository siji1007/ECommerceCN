import React, {FC,  useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Cookies from 'js-cookie';
import host_backend from '../host/host.txt?raw';
import { useNavigate } from 'react-router-dom';
import AdminButton from '../assets/profiles/admin.png'
import CustomerButton from '../assets/profiles/buyer.png';
import OtpModal from '../Auth/otp';


const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [selectedAccountType, setSelectedAccountType] = useState<"User" | "Admin">("User");
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
    const [generatedOtp, setGeneratedOtp] = useState('');  // Store OTP here
    const [senderEmail, setSenderEmail] = useState<string>('');



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

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        // Admin Login Logic
        if (selectedAccountType === "Admin") {
            try {
                const data = { emailOrMobile, password };
            
                const response = await fetch(serverUrl + '/api/admin/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data), // Send email and password in the request body
                });
            
                if (response.status === 200) {
                    const result = await response.json(); // Parse the JSON response
                    alert('Login successful');
                    console.log(result);
                    
                    // Assuming result contains admin_id, save it to localStorage
                    localStorage.setItem('adminID', result.admin.admin_id); // Store adminID in localStorage
                    
                    // You can also store other details like full name if necessary
                    localStorage.setItem('adminName', result.admin.admin_fname + " " + result.admin.admin_lname); 
                    const adminID = result.admin.admin_id;
                    // Navigate to the admin page
                    navigate(`/admin/id_admin=${adminID}/product-management`);

                } else {
                    const errorResult = await response.json();
                    alert(errorResult.message || "Login failed");
                }
            } catch (error) {
                if (error instanceof Error) {
                    console.error("Error during login:", error.message);
                    alert(error.message || "An unexpected error occurred. Please try again.");
                } else {
                    console.error("Unknown error occurred");
                    alert("An unexpected error occurred. Please try again.");
                }
            }
        }
            
    
        // Customer Login Logic
        if (selectedAccountType === "User") {
            const data = {
                emailOrMobile,
                password,
            };
    
            try {
                const response = await fetch(serverUrl + "/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data), // Send emailOrMobile and password in the request body
                });
    
                if (!response.ok) {
                    const errorResult = await response.json();
                    throw new Error(errorResult.message || "Login failed");
                }
    
                const result = await response.json();
                alert(`LOGIN successful! Welcome, ${result.user.full_name}`);
                localStorage.setItem("userFullName", result.user.full_name);
                localStorage.setItem("Auth", result.user.id);
                Cookies.set("unauth_cookie", result.unauth_cookie, { expires: 7 });
                navigate("/"); // Redirect to customer dashboard
                window.location.reload();
            } catch (error) {
                if (error instanceof Error) {
                    console.error("Error during login:", error.message);
                    alert(error.message || "An unexpected error occurred. Please try again.");
                } else {
                    console.error("Unknown error occurred");
                    alert("An unexpected error occurred. Please try again.");
                }
            }
        }
    };
    
    
    const handleSignUpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
      
        if (selectedAccountType === "Admin") {
          alert("Admin sign-up is not supported!");
          return;
        }
      
        fetch(serverUrl + '/api/send-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email_or_mobile: emailOrMobile }),
        })
        .then(response => response.json())
        .then(result => {
          console.log('API Response:', result);
      
          if (result.success) {
            setGeneratedOtp(result.otp);  // Save OTP received from backend
            setShowOtpModal(true);  // Trigger modal state change
        
        
            setSenderEmail(emailOrMobile); // Set the sender's email address
         
            
          } else {
            alert(result.message || 'Failed to send OTP');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('An error occurred while sending OTP. Please try again.');
        });
      };
      
      
      
      
     
      
    
    
    
      // Handle OTP Verification
      const handleVerifyOtp = (otp: string) => {
        const data = {
          first_name: firstName,
          last_name: lastName,
          birth_month: month,
          birth_day: day,
          birth_year: year,
          email_or_mobile: emailOrMobile,
          password: password,
        };
      
        // Send data to the register API
        fetch(serverUrl + '/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
          .then(response => response.json())
          .then(result => {
            if (result.success) {
              alert('Sign-up successful! Please log in.');
              setShowOtpModal(false);
              navigate('/login');
            } else {
              alert(result.message || 'An error occurred during sign-up.');
              setShowOtpModal(false);
              navigate('/login');
            }
          })
          .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred during sign-up. Please try again.');
          });
      };
      
    
    
      const handleCloseOtpModal = () => {
        setShowOtpModal(false);
      };
    
    return (
        <div className="flex flex-col h-auto pt-8 min-h-screen items-center justify-center px-4 sm:px-8">
            <h1 className="mb-2 text-lg sm:text-xl mt-20 pt-10 sm:mt-0">Choose Account Type</h1>{/* Add a margin to separate the header */}
            {/* Account Type Selection */}
            <div className="flex flex-wrap gap-4 sm:gap-8 mb-8 justify-center">
                <div
                    onClick={() => setSelectedAccountType("User")}
                    className={`relative cursor-pointer border rounded-lg p-4 shadow-lg w-32 sm:w-40 lg:w-40 lg:h-40 ${
                        selectedAccountType === "User" ? "border-green-800 shadow-[0_4px_6px_0_rgba(34,197,94,0.5)]" : "border-gray-300"
                    }`}
                >
                    {selectedAccountType === "User" && (
                        <div className="absolute top-2 left-2 flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-4 h-4 sm:w-6 sm:h-6" > <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /> </svg>
                        </div>
                    )}
                    <img
                        src={CustomerButton}
                        alt="Customer"
                        className="w-full h-24 sm:h-32 object-contain mx-auto"
                    />
                    <h3 className="text-center text-xs sm:text-sm lg:text-lg font-semibold mt-2 sm:mt-4">
                        User
                    </h3>
                </div>

                {!isSignUp && (
                    <div
                        onClick={() => setSelectedAccountType("Admin")}
                        className={`relative cursor-pointer border rounded-lg p-4 shadow-lg w-32 sm:w-40 lg:w-40 lg:h-40 ${
                            selectedAccountType === "Admin" ? "border-green-800 shadow-[0_4px_6px_0_rgba(34,197,94,0.5)]" : "border-gray-300"
                        }`}
                    >
                        {selectedAccountType === "Admin" && (
                            <div className="absolute top-2 left-2 flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-4 h-4 sm:w-6 sm:h-6" > <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /> </svg>
                            </div>
                        )}
                        <img
                            src={AdminButton}
                            alt="Admin"
                            className="w-full h-24 sm:h-32 object-contain mx-auto"
                        />
                        <h3 className="text-center text-xs sm:text-sm lg:text-lg font-semibold mt-2 sm:mt-4">
                            Admin
                        </h3>
                    </div>
                    )}
            </div>

    
            {/* Login/SignUp Form */}
            <div className="bg-white p-6 sm:p-8 rounded-md w-full max-w-md relative border">
                <h2 className="text-lg sm:text-xl font-bold mb-4 text-center">
                    {isSignUp 
                        ? `Sign Up as ${selectedAccountType}` 
                        : `Login as ${selectedAccountType}`}
                </h2>

                {isSignUp ? (
                    <form onSubmit={handleSignUpSubmit}>
                        {/* Full Name Section */}
                        <div className="mb-4 flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <label htmlFor="firstName" className="block text-sm font-semibold">First Name</label>
                                <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Enter your first name" required />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="lastName" className="block text-sm font-semibold">Last Name</label>
                                <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Enter your last name" required />
                            </div>
                        </div>
                        {/* Birthdate Section */}
                        <div className="mb-4">
                            <label htmlFor="month" className="block text-sm font-semibold">Birthdate</label>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <select id="month" value={month} onChange={(e) => setMonth(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md flex-1" required>
                                    <option value="">Month</option>
                                    <option value="January">January</option>
                                    {/* Continue with other months */}
                                </select>
                                <select id="day" value={day} onChange={(e) => setDay(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md flex-1" required>
                                    <option value="">Day</option>
                                    {Array.from({ length: 31 }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                    ))}
                                </select>
                                <select id="year" value={year} onChange={(e) => setYear(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md flex-1" required>
                                    <option value="">Year</option>
                                    {Array.from({ length: 100 }, (_, i) => (
                                        <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/* Email and Password */}
                        <div className="mb-4">
                            <label htmlFor="emailOrMobile" className="block text-sm font-semibold">Email or Mobile Number</label>
                            <input type="text" id="emailOrMobile" value={emailOrMobile} onChange={(e) => setEmailOrMobile(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Enter your email or mobile number" required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-semibold">Password</label>
                            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Create a password" required />
                        </div>
                        <button type="submit" className="w-full bg-green-800 text-white py-2 rounded-md">Sign Up</button>
                    </form>
                ) : (
                    <form onSubmit={handleLoginSubmit}>
                        <div className="mb-4">
                            <label htmlFor="emailOrMobile" className="block text-sm font-semibold">Email or Mobile Number</label>
                            <input type="text" id="emailOrMobile" value={emailOrMobile} onChange={(e) => setEmailOrMobile(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Enter your email or mobile number" required />
                        </div>
                        <div className="mb-4 relative">
                            <label htmlFor="password" className="block text-sm font-semibold">Password</label>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10" placeholder="Enter your password" required />
                                <button type="button" onClick={handleTogglePassword} className="absolute inset-y-0 right-2 text-gray-600">
                                    {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                                </button>
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-green-800 text-white py-2 rounded-md">Login</button>
                    </form>
                )}
                <div className="mt-4 text-center">
                    {isSignUp ? (
                        <p className="text-sm">
                            Already have an account?{" "}
                            <span className="text-blue-600 cursor-pointer" onClick={toggleForm}>Login</span>
                        </p>
                    ) : (
                            <p className="text-sm">
                            {selectedAccountType !== "Admin" && (
                                <> Don't have an account?{" "} <span className="text-blue-600 cursor-pointer" onClick={toggleForm}>Sign Up</span> </>
                            )}
                        </p>
                    
                    )}
                </div>

                {showOtpModal && (
               <OtpModal 
                    onClose={() => setShowOtpModal(false)} 
                    onVerifyOtp={handleVerifyOtp} 
                    generatedOtp={generatedOtp}
                    senderEmail={senderEmail}  // Pass senderEmail prop to OtpModal
                    />
                )}
            </div>
        </div>
    );
    
};

export default LoginPage;
