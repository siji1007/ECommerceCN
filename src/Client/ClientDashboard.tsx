import Profile from '../../src/assets/profiles/Profile.jpg'
import { FaEdit, FaCog, FaSave  } from 'react-icons/fa';
import { useLocation, useNavigate, Link  } from 'react-router-dom';
import { IoStorefrontSharp } from "react-icons/io5";
import { AiFillProfile } from "react-icons/ai";
import { useState, useEffect } from 'react';
import Business from './Business Page/business';
import ProductList from './Business Page/ProductLIst';

const ClientDashboard: React.FC = () =>{

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [isBusinessForm, setIsBusinessForm] = useState(false);
    const [isProductList, setIsProductList] = useState(false);
    const [isDisabledPesonalInfo, setIsDisabledPersonalInfo] = useState(true);
    const [isDisabledAddress, setIsDisabledAddress] = useState(true);
    const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false); 
    const [isEditingAddress,setIsEditingAddress] = useState(false);

    const navigateToProductList = () => {
        navigate('/clientprofile/product-list');
      };
      

    const location = useLocation();
    const navigate = useNavigate();

    const isActive = location.pathname === '/clientprofile';
    const isProducts = location.pathname == '/clientprofile/product-list';
    const isStart = location.pathname == '/clientprofile/business-form';
  

    useEffect(() => {
      const path = location.pathname;

      const businessFormIncluded = path.includes('business-form');
        const productListIncluded = path.includes('product-list');

        setIsBusinessForm(businessFormIncluded);
        setIsProductList(productListIncluded);
        setIsDropdownOpen(businessFormIncluded || productListIncluded);
    }, [location]); 
  
   
    const toggleDropdown = () => {
      setIsDropdownOpen((prev) => !prev);
    };

    const handleInputClickPersonalInfo = () => {
        setIsDisabledPersonalInfo(false); 
        setIsEditingPersonalInfo(true); 
      };
    
      const handleSaveClickPersonalInfo = () => {
        setIsDisabledPersonalInfo(true); 
        setIsEditingPersonalInfo(false); 
        
      };
    
      const handleInputClickAddress = () =>{
        setIsDisabledAddress(false);
        setIsEditingAddress(true);
      };

      const handleSaveClickAddress = () => {
        setIsDisabledAddress(true);
        setIsEditingAddress(false);
      };
  
    const StartBusiness = () => {
      const newPath = isBusinessForm ? '/clientprofile' : '/clientprofile/business-form';
  
   
      navigate(newPath);
      setIsBusinessForm(!isBusinessForm); 
    };
  
    return (
   
       
        <div className="flex mt-9"> {/* main div of clientDashboard*/}
          {/* Sidebar Section */}
          <div className="w-64 bg-white text-white flex flex-col items-center py-8 h-screen">
          <div className="flex flex-col items-center justify-center mb-8">
            <img
                src={Profile}
                alt="Profile"
                className="w-24 h-24 rounded-full mb-4"
            />
            <h2 className="text-lg text-black font-semibold text-center">
                SiJi
            </h2>
            {/* <h2 className="text-lg text-green-900 font-semibold text-center">
                Verified
            </h2> */}
            </div>


            <div className="w-full p-2  flex flex-col h-full mb-10">
                <Link to="/clientprofile">
                    <button
                        className={`w-full py-2 px-4 mb-4 text-left  font-semibold rounded flex items-center 
                        ${isActive ? 'bg-green-600 text-white' : ' text-black hover:bg-green-600 hover:text-white'}`}
                    >
                        <AiFillProfile className="h-5 w-5 mr-2" />
                        Personal Information
                    </button>
                </Link>

                {/* Register your business button */}
                <button
                    className="w-full py-2 px-4 mb-4 text-left text-black font-semibold hover:bg-green-600 rounded flex items-center"
                    onClick={toggleDropdown} // Toggle dropdown on click
                >
                    <IoStorefrontSharp className="h-5 w-5 mr-2"/>

                    Business
                </button>

            {/* Conditionally rendered dropdown */}
            {isDropdownOpen && (
                <div className="ml-4 mb-4">
                <button className="w-full py-2 px-4 text-left text-black font-semibold hover:bg-green-600 hover:text-white rounded">
                    Tutorial
                </button>
                <button className="w-full py-2 px-4 text-left text-black font-semibold hover:bg-green-600 hover:text-white rounded">
                Contract Details
                </button>
                <Link to="business-form">
                    <button  className={`w-full py-2 px-4 text-left text-black font-semibold ${isStart ? 'bg-green-600 text-white' : 'hover:bg-green-600 hover:text-white'} rounded`} onClick={StartBusiness}>
                        Start
                    </button>
                </Link>
                <button
                      className={`w-full py-2 px-4 text-left text-black font-semibold ${isProducts ? 'bg-green-600 text-white' : 'hover:bg-green-600 hover:text-white'} rounded`}
                    onClick={navigateToProductList}
                    >
                    Products
                    </button>

                </div>
                 )}
                <button className="w-full py-2 px-4 mb-4 text-left text-black font-semibold hover:bg-green-600 rounded flex items-center">
                <FaCog className="h-5 w-5 mr-2" />
                Settings
                </button>
                {/* This div ensures the logout button is pushed to the bottom */}
                <div className="mt-auto ">
                    <button className="w-full py-2 px-4 text-left bg-green-900 text-center hover:bg-green-600 rounded font-bold">
                    Logout
                    </button>
                </div>
            </div>

          </div>
    
          {/* main div */}
          <main className="flex-1 bg-gray-100 p-8 overflow-y-auto">
                {isBusinessForm ? (
                <Business />
                ) : isProductList ? (
                <ProductList />
                ) : (
                    <>
                        <section className="mb-6 shadow p-4 bg-white rounded relative">{/* Client Information Section */}
                        {/* Edit Button */}
                        <button
                            className="absolute top-4 right-4 text-green-900 hover:text-blue-700 font-medium"
                            onClick={isEditingPersonalInfo ? handleSaveClickPersonalInfo : handleInputClickPersonalInfo} // Toggle between Edit and Save
                        >
                            {isEditingPersonalInfo ? <FaSave size={20} /> : <FaEdit size={20} />}
                        </button>
                            
                        {/* Client Personal Information Section */}
                        <h3 className="text-xl font-bold text-gray-700 mb-4">Personal Information</h3>
                        
                        {/* Firstname and Lastname */}
                        <div className="flex gap-4 mb-4">
                            <div className="flex-1">
                            <label htmlFor="firstname" className="block text-gray-600 font-medium mb-1">
                                Firstname
                            </label>
                            <input
                                type="text"
                                id="firstname"
                                name="firstname"
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Enter Firstname"
                                disabled={isDisabledPesonalInfo}
                            />
                            </div>
                            <div className="flex-1">
                            <label htmlFor="lastname" className="block text-gray-600 font-medium mb-1"> Lastname </label>
                            <input type="text" id="lastname" name="lastname" className="w-full p-2 border border-gray-300 rounded" placeholder="Enter Lastname"         disabled={isDisabledPesonalInfo} />
                            </div>
                        </div>
                        <div className="flex justify-between items-center gap-4"> 
                            {/* Email Section */}
                            <section className="flex-1">
                                <label htmlFor="Email" className="block text-gray-600 font-medium mb-1">Email</label>
                                <input 
                                type="text" 
                                id="Email" 
                                name="Email" 
                                className="w-full p-2 border border-gray-300 rounded" 
                                placeholder="Email" 
                                disabled={isDisabledPesonalInfo} 
                                />
                            </section>

                            {/* Gender Section */}
                            <section className="flex-1 text-left ">
                                <label className="block text-gray-600 font-medium mb-1">Gender</label> 
                                <div className="flex justify-start gap-4 border border-gray-300 p-2"> 
                                <label className="flex items-center"> <input type="radio" name="gender" value="female" className="mr-2" disabled={isDisabledPesonalInfo} /> Female </label>
                                <label className="flex items-center">
                                    <input type="radio" name="gender" value="male" className="mr-2" disabled={isDisabledPesonalInfo} /> Male </label>
                                <label className="flex items-center">
                                    <input type="radio" name="gender" value="custom" className="mr-2" disabled={isDisabledPesonalInfo} />
                                    Custom
                                </label>
                                </div>
                            </section>
</div>


                        
                        
                        {/* Birthdate */}
                        <div> 
                            <label htmlFor="birthdate" className="block text-gray-600 font-medium mb-1"> Birthdate </label>
                            <input type="date" id="birthdate" name="birthdate" className="w-full p-2 border border-gray-300 rounded"         disabled={isDisabledPesonalInfo} /> 
                        </div>


                        </section>
                        <section className="mb-6 shadow p-4 bg-white rounded relative">
                        {/* Edit Button */}
                            <button
                                className="absolute top-4 right-4 text-green-900 hover:text-blue-700 font-medium"
                                onClick={isEditingAddress ? handleSaveClickAddress : handleInputClickAddress} // Toggle between Edit and Save
                            >
                                {isEditingAddress ? <FaSave size={20} /> : <FaEdit size={20} />}
                            </button>
                                
                            {/* Province, City, Barangay */}
                            <h1 className='text-xl font-bold text-gray-700 mb-4'>Address</h1>
                            <div className="flex gap-4 mb-4">
                                <div className="flex-1">
                                <label htmlFor="province" className="block text-sm font-medium mb-1">Province</label>
                                <input type="text" id="province" name="province" className="w-full p-2 border border-gray-300 rounded" placeholder="Select or type a Province" list="provinces"  disabled={isDisabledAddress} />
                                <datalist id="provinces">
                                    <option value="Province 1" />
                                    <option value="Province 2" />
                                    <option value="Province 3" />
                                    <option value="Province 4" />
                                </datalist>
                            </div>
                            <div className="flex-1">
                                <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
                                <input type="text" id="city" name="city" className="w-full p-2 border border-gray-300 rounded" placeholder="Select or type a City" list="cities" disabled={isDisabledAddress} />
                                <datalist id="cities">
                                    <option value="City 1" />
                                    <option value="City 2" />
                                    <option value="City 3" />
                                    <option value="City 4" />
                                </datalist>
                                </div>
                                <div className="flex-1">
                                <label htmlFor="barangay" className="block text-sm font-medium mb-1">Barangay</label>
                                <input type="text" id="barangay" name="barangay" className="w-full p-2 border border-gray-300 rounded" placeholder="Select or type a Barangay" list="barangays" disabled={isDisabledAddress} />
                                <datalist id="barangays">
                                    <option value="barangay 1" />
                                    <option value="barangay 2" />
                                    <option value="barangay 3" />
                                    <option value="barangay 4" />
                                </datalist>
                                </div>
                            </div>

                            {/* Postal Code */}
                            <div className="mb-4">
                                <label htmlFor="postalCode" className="block text-sm font-medium mb-1">Postal Code</label>
                                <input
                                type="text"
                                id="postalCode"
                                name="postalCode"
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Postal Code"
                                disabled={isDisabledAddress}
                                />
                            </div>

                            {/* Map */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Map</label>
                                <div className="h-64 border border-gray-300 rounded">
                                {/* Placeholder for map */}
                                <iframe
                                    title="Map"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093066!2d144.9556513156555!3d-37.81732397975164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xff55c0f59bdfe98a!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sph!4v1619941075868!5m2!1sen!2sph"
                                    className="w-full h-full rounded"
                                    allowFullScreen=""
                                    loading="lazy"
                              
                                ></iframe>
                                </div>
                            </div>
                        </section>
                    </>
                    )}

            
          </main>
        </div>
      );
    };

export default ClientDashboard;