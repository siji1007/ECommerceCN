import Profile from '../../src/assets/profiles/Profile.jpg'
import { FaEdit, FaCog, FaSave, FaBars  } from 'react-icons/fa';
import { useLocation, useNavigate, Link  } from 'react-router-dom';
import { IoStorefrontSharp } from "react-icons/io5";
import { AiFillProfile } from "react-icons/ai";
import { useState, useEffect } from 'react';
import { MdArrowForward } from 'react-icons/md';
import Business from './BusinessPage/business';
import ProductList from './BusinessPage/ProductLIst';
import ProductAdd from './BusinessPage/productsAdd';
import host_backend from '../host/host.txt?raw';
import axios from 'axios';

const ClientDashboard: React.FC = () =>{
    const [firstName, setFirstName] = useState<string>('');    
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] =  useState<string>('');
    const [gender, setGender] =  useState<string>('');
    const [birthMonth, setBirthmonth] =  useState<string>('');
    const [birthDay, setBirthday] =  useState<string>('');
    const [birthYear, setBirthyear] =  useState<string>('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [user, setUser] = useState<{ first_name: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isBusinessForm, setIsBusinessForm] = useState(false);
    const [isProductList, setIsProductList] = useState(false);
    const [isProductAdd, setIsProductAdd] = useState(false);
    const [isDisabledPesonalInfo, setIsDisabledPersonalInfo] = useState(true);
    const [isDisabledAddress, setIsDisabledAddress] = useState(true);
    const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false); 
    const [isEditingAddress,setIsEditingAddress] = useState(false);
    const serverUrl = host_backend.trim();




        // Extract the ID from the URL
        let url = window.location.href;
        let match = url.match(/id=(\d+)/);  // This will match 'id=2' or similar
        
        const id = match ? match[1] : null;
        
        if (!id) {
            return <div>ID not found in the URL</div>;
        }

     
        const [locations, setLocation] = useState(null);
        const [addressDetails, setAddressDetails] = useState({
          province: '',
          city: '',
          barangay: '',
          postalCode: '',
          street: '',
        });
        const [mapUrl, setMapUrl] = useState('');
      
        useEffect(() => {
          // Get the current location of the user when component mounts
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(handlePositionSuccess, handlePositionError);
          }
        }, []);
      
        const handlePositionSuccess = (position) => {
          const { latitude, longitude } = position.coords;
      
          // Update the location state with latitude and longitude
          setLocation({ latitude, longitude });
      
          // Call reverse geocoding to get address details
          fetchAddressDetails(latitude, longitude);
      
          // Update the map iframe URL
          updateMapWithLocation(latitude, longitude);
        };
      
        const handlePositionError = (error) => {
          console.error("Error fetching location", error);
        };
      
        const fetchAddressDetails = async (latitude, longitude) => {
            const apiKey = "AIzaSyDgCKNuxx-s5uQfSs0AiD62wFNmgpurtyQ"; // Your Google API key
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
            
            try {
              const response = await fetch(url);
              const data = await response.json();
              
              console.log('API Response:', data); // Log the entire response for debugging
              
              if (data.status === "OK" && data.results.length > 0) {
                const addressComponents = data.results[0].address_components;
                
                // Extract address components safely
                const address = {
                  province: addressComponents.find(component => component.types.includes("administrative_area_level_1"))?.long_name || 'Not Available',
                  city: addressComponents.find(component => component.types.includes("locality"))?.long_name || 'Not Available',
                  barangay: addressComponents.find(component => component.types.includes("sublocality_level_1"))?.long_name || 'Not Available',
                  postalCode: addressComponents.find(component => component.types.includes("postal_code"))?.long_name || 'Not Available',
                  street: addressComponents.find(component => component.types.includes("route"))?.long_name || 'Not Available',
                };
                
                setAddressDetails(address);
                alert(`Province: ${address.province}\nCity: ${address.city}\nBarangay: ${address.barangay}`);
              } else {
                // Handle failure to get results
                alert("Failed to retrieve address details");
              }
            } catch (error) {
              console.error("Error fetching address details", error);
              alert("Error fetching address details");
            }
          };
          
      
        const updateMapWithLocation = (latitude, longitude) => {
          const mapUrl = `https://www.google.com/maps/embed/v1/view?key=AIzaSyDgCKNuxx-s5uQfSs0AiD62wFNmgpurtyQ&center=${latitude},${longitude}&zoom=17`;
          setMapUrl(mapUrl);
        };  
    
        useEffect(() => {
            const userId = id;  // The user ID you want to query for
    
            // Send the GET request with the id query parameter
            fetch(serverUrl + `/api/get-credentials?id=${userId}`, {
                method: 'GET',
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('User not found or server error');
                    }
                    return response.json();
                })
                .then((data) => {
                    setUser(data);
                    {
                        setFirstName(data.first_name);
                        setLastName(data.last_name);
                        setEmail(data.email);
                        setGender(data.gender);
                        setBirthmonth(data.birthmonth);
                        setBirthday(data.birthday);
                        setBirthyear(data.birthyear);
                        

                        
                

                    }
                    setError('');
                })
                .catch((error) => {
                    setUser(error.message);
                    console.error('Error:', error);
                });
        }, []);

    const navigateToProductList = () => {
        navigate(`/clientprofile/id=${id}/product-list`);
      };

      const months = [
        { name: "January", value: 1 },
        { name: "February", value: 2 },
        { name: "March", value: 3 },
        { name: "April", value: 4 },
        { name: "May", value: 5 },
        { name: "June", value: 6 },                      //show months and paire to its array
        { name: "July", value: 7 },
        { name: "August", value: 8 },
        { name: "September", value: 9 },
        { name: "October", value: 10 },
        { name: "November", value: 11 },
        { name: "December", value: 12 }
      ];

     
  
    
    
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = location.pathname === `/clientprofile/id=${id}`;
    const isProducts = location.pathname === `/clientprofile/id=${id}/product-list` ||location.pathname === `/clientprofile/id=${id}/products-add` ;
   
    const isStart = location.pathname == `/clientprofile/id=${id}/business-form`;
  

    useEffect(() => {
      const path = location.pathname;

      const businessFormIncluded = path.includes('business-form');
        const productListIncluded = path.includes('product-list');
        const productAddIncluded = path.includes('products-add');

        setIsBusinessForm(businessFormIncluded);
        setIsProductList(productListIncluded);
        setIsProductAdd(productAddIncluded);
        setIsDropdownOpen(businessFormIncluded || productListIncluded || productAddIncluded);


 

    }, [location]); 
  
   
    const toggleDropdown = () => {
      setIsDropdownOpen((prev) => !prev);
    };

    const handleInputClickPersonalInfo = () => {
        setIsDisabledPersonalInfo(false); 
        setIsEditingPersonalInfo(true); 
        alert("Edit Personal Information");
      };
    
      const handleSaveClickPersonalInfo = () => {
        setIsDisabledPersonalInfo(true); 
        setIsEditingPersonalInfo(false); 
        alert("Save Personal Information");
        
      };
    
      const handleInputClickAddress = () =>{
        setIsDisabledAddress(false);
        setIsEditingAddress(true);

        alert("Edit Personal Address");
      };

      const handleSaveClickAddress = () => {
        setIsDisabledAddress(true);
        setIsEditingAddress(false);

        alert("Save Personal Address");
      };
  
    const StartBusiness = () => {
      const newPath = isBusinessForm ? `/clientprofile/id=${id}` : `/clientprofile/id=${id}/business-form`;
  
   
      navigate(newPath);
      setIsBusinessForm(!isBusinessForm); 
    };


    const [image, setImage] = useState(null);

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = () => setImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = () => setImage(reader.result);
            reader.readAsDataURL(file);
        }
    };



    // Get current location and fill in the address fields
    const getCurrentLocation = () => {
        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fetchAddressFromCoordinates, handleLocationError);
        } else {
        alert("Geolocation is not supported by this browser.");
        }
    };

    // Fetch address using reverse geocoding API
    const fetchAddressFromCoordinates = (position) => {
        const { latitude, longitude } = position.coords;
        const apiKey = "YOUR_GOOGLE_MAPS_API_KEY";  // Replace with your Google Maps API key
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

        fetch(geocodeUrl)
        .then((response) => response.json())
        .then((data) => {
            if (data.results.length > 0) {
            const addressComponents = data.results[0].address_components;
            setStreetName(addressComponents.find(component => component.types.includes('route'))?.long_name || '');
            setBarangay(addressComponents.find(component => component.types.includes('sublocality_level_1'))?.long_name || '');
            setCity(addressComponents.find(component => component.types.includes('locality'))?.long_name || '');
            setProvince(addressComponents.find(component => component.types.includes('administrative_area_level_1'))?.long_name || '');
            setPostalCode(addressComponents.find(component => component.types.includes('postal_code'))?.long_name || '');
            } else {
            alert("Address not found.");
            }
        })
        .catch((error) => {
            console.error("Error fetching address:", error);
            alert("Unable to fetch address.");
        });
    };

    // Handle geolocation errors
    const handleLocationError = (error) => {
        alert("Error getting location: " + error.message);
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
                    <Link   to={`/clientprofile/id=${id}`}>
                        <button
                            className={`w-full py-2 px-4 mb-4 text-left  font-semibold rounded flex items-center 
                            ${isActive ? 'bg-green-600 text-white' : ' text-black hover:bg-green-600 hover:text-white'}`}
                        >
                            <AiFillProfile className="h-5 w-5 mr-2" />
                            Personal Information
                        </button>
                    </Link>

                    {/* Register your business button */}
                    <button className="w-full py-2 px-4 mb-4 text-left text-black font-semibold hover:bg-green-600 rounded flex items-center" onClick={toggleDropdown} >
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
                            Start Selling
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
                  
                  
              </div>

            </div>
      
          {/* main div */}
          <main className="flex-1 bg-gray-100 p-8 overflow-y-auto">
                {isBusinessForm ? (
                <Business />
                ) : isProductList ? (
                <ProductList />
                ) : isProductAdd ? (
                <ProductAdd/>
                ):
                (
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
                            <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" placeholder="Enter your first name" disabled={isDisabledPesonalInfo} />
                            </div>
                            <div className="flex-1">
                            <label htmlFor="lastname" className="block text-gray-600 font-medium mb-1"> Lastname </label>
                            <input type="text" id="lastname" value={lastName}  name="lastname"  className="w-full p-2 border border-gray-300 rounded" placeholder="Enter Lastname"   onChange={(e) => setLastName(e.target.value)}      disabled={isDisabledPesonalInfo} />
                            </div>
                        </div>
                        <div className="flex justify-between items-center gap-4"> 
                            {/* Email Section */}
                            <section className="flex-1">
                                <label htmlFor="Email" className="block text-gray-600 font-medium mb-1">Email</label>
                                <input type="text" id="Email" name="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border border-gray-300 rounded" placeholder="Email" disabled={isDisabledPesonalInfo} />
                            </section>

                            {/* Gender Section */}
                            <section className="flex-1 text-left ">
                                <label className="block text-gray-600 font-medium mb-1">Gender</label> 
                                <div className="flex justify-start gap-4 border border-gray-300 p-2"> 
                                <label className="flex items-center"> 
                                    <input type="radio" name="gender" value="Female" className="mr-2"  checked={gender === 'Female'}  disabled={isDisabledPesonalInfo} /> Female </label>
                                <label className="flex items-center">
                                    <input type="radio" name="gender" value="Male" className="mr-2"  checked={gender === 'Male'}  disabled={isDisabledPesonalInfo} /> Male </label>
                                <label className="flex items-center">
                                    <input type="radio" name="gender" value="Custom" className="mr-2"  checked={gender === 'Custom'} disabled={isDisabledPesonalInfo} />
                                    Custom
                                </label>
                                </div>
                            </section>
                        </div>


                        
                        
                     
                      {/* Birthdate */}
                      <div className="flex w-full items-start justify-between space-x-4 mt-3">
                        {/* Left Side: Dropdown Section */}
                        <div className="flex-1">
                            <div className="flex items-start space-x-2">
                                <div className="flex-1">
                                    <label htmlFor="birthMonth" className="block text-gray-600 font-medium mb-1">Month</label>
                                    <select id="birthMonth" name="birthMonth" className="p-2 border border-gray-300 rounded w-full" disabled={isDisabledPesonalInfo} value={months.find(month => month.name === birthMonth)?.value || 1}  >
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {new Date(0, i).toLocaleString("default", { month: "long" })}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="birthDay" className="block text-gray-600 font-medium mb-1">Day</label>
                                    <select id="birthDay" name="birthDay" className="p-2 border border-gray-300 rounded w-full" disabled={isDisabledPesonalInfo} value={birthDay}>
                                        {Array.from({ length: 31 }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="birthYear" className="block text-gray-600 font-medium mb-1">Year</label>
                                    <select id="birthYear" name="birthYear" className="p-2 border border-gray-300 rounded w-full" disabled={isDisabledPesonalInfo} value={birthYear}>
                                        {Array.from({ length: 120 }, (_, i) => (
                                            <option key={i} value={new Date().getFullYear() - i}>
                                                {new Date().getFullYear() - i}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Image Upload Section */}
                        <div
                            className="w-64 h-64 border-2 m-4 border-dashed border-gray-300 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            {image ? (
                                <img src={image} alt="Uploaded" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center">
                                    <label
                                        htmlFor="fileInput"
                                        className="cursor-pointer text-blue-500 underline"
                                    >
                                        Click to upload
                                    </label>
                                    <p className="text-gray-500">or drag an image here</p>
                                    <input
                                        type="file"
                                        id="fileInput"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileInputChange}
                                    />
                                </div>
                            )}
                        </div>
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
                              <input type="text" id="province" name="province" className="w-full p-2 border border-gray-300 rounded" placeholder="Select or type a Province" list="provinces" disabled={isDisabledAddress} value={addressDetails.province} onChange={(e) => setAddressDetails({ ...addressDetails, province: e.target.value })} />
                              <datalist id="provinces">
                                <option value="Province 1" />
                                <option value="Province 2" />
                                <option value="Province 3" />
                                <option value="Province 4" />
                              </datalist>
                            </div>
                            <div className="flex-1">
                              <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
                              <input type="text" id="city" name="city" className="w-full p-2 border border-gray-300 rounded" placeholder="Select or type a City" list="cities" disabled={isDisabledAddress} value={addressDetails.city} onChange={(e) => setAddressDetails({ ...addressDetails, city: e.target.value })} />
                              <datalist id="cities">
                                <option value="City 1" />
                                <option value="City 2" />
                                <option value="City 3" />
                                <option value="City 4" />
                              </datalist>
                            </div>
                            <div className="flex-1">
                              <label htmlFor="barangay" className="block text-sm font-medium mb-1">Barangay</label>
                              <input type="text" id="barangay" name="barangay" className="w-full p-2 border border-gray-300 rounded" placeholder="Select or type a Barangay" list="barangays" disabled={isDisabledAddress} value={addressDetails.barangay} onChange={(e) => setAddressDetails({ ...addressDetails, barangay: e.target.value })} />
                              <datalist id="barangays">
                                <option value="Barangay 1" />
                                <option value="Barangay 2" />
                                <option value="Barangay 3" />
                                <option value="Barangay 4" />
                              </datalist>
                            </div>
                          </div>

                          {/* Postal Code */}
                          <div className="mb-4">
                            <label htmlFor="postalCode" className="block text-sm font-medium mb-1">Postal Code</label>
                            <input type="text" id="postalCode" name="postalCode" className="w-full p-2 border border-gray-300 rounded" placeholder="Postal Code" disabled={isDisabledAddress} value={addressDetails.postalCode} onChange={(e) => setAddressDetails({ ...addressDetails, postalCode: e.target.value })} />
                          </div>

                          {/* Get Current Location Button */}
                          <button type="button" className="text-white bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded" onClick={() => { if (navigator.geolocation) { navigator.geolocation.getCurrentPosition(handlePositionSuccess, handlePositionError); } }} > Get Current Location </button>

                          {/* Map */}
                          <div>
                            <label className="block text-sm font-medium mb-2">Map</label>
                            <div className="h-64 border border-gray-300 rounded">
                              {/* Display the dynamic iframe with the updated map URL */}
                              <iframe title="Map" className="w-full h-full rounded" src={mapUrl} loading="lazy" ></iframe>
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