import React, { useState, useEffect  } from 'react';
import { FaEdit } from 'react-icons/fa';
import axios from 'axios';
import hosting from "../../host/host.txt?raw";
import { useNavigate } from 'react-router-dom';

const Business: React.FC = () => {
  const serverHost = hosting.trim();
  const [step, setStep] = useState(1); // To track which section to display
  const [isEditing, setIsEditing] = useState(false); 
  const navigate = useNavigate();


  let url = window.location.href;
  let match = url.match(/id=(\d+)/);  // This will match 'id=2' or similar
  
  const id = match ? match[1] : null;
  
  if (!id) {
      return <div>ID not found in the URL</div>;
  }

  const [imageName, setImageName] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageName(file.name); // Set the image file name
      const reader = new FileReader();
      
      // Create a FormData object to send the file to the server
      const formData = new FormData();
      formData.append('file', file);  // Append the file to FormData
      
      // Read the file as DataURL for previewing (optional)
      reader.onload = (e) => {
        setImageSrc(e.target.result); 
      };
      reader.readAsDataURL(file);
      
      try {
        // Send the file to the server and capture the response (with the document_url)
        const response = await axios.post(serverHost + '/UploadDocument', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        // Once the file is uploaded, update formData with the document URL
        if (response.data.document_url) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            image_src: response.data.document_url, // Update image_src with the uploaded image URL
          }));
        }
        
        alert(`Image uploaded: ${file.name}`);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image.');
      }
    }
  };
  
  
  

  const [formData, setFormData] = useState({
    businessName: '',
    businessCategory: '',
    businessEmail: '',
    businessContact: '',
    province: '',
    city: '',
    barangay: '',
    postalCode: '',
    image_src:'',
  });


  const handleNext = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      // Validate the form data before moving to the next step (except image_src)
      const isFormValid = Object.entries(formData)
        .filter(([key]) => key !== 'image_src') // Exclude image_src from validation
        .every(([key, value]) => value.trim() !== '');
    
      if (!isFormValid) {
        alert('Please fill in all required fields.');
        return; // Stop if validation fails
      }
    
      // Proceed to step 2 after validation
      setStep(2);
    } else if (step === 2) {
      setStep(3);
      // At Step 2, handle the file upload and proceed to Step 3
      
    } else if (step === 3) {
      const formDataToSend = new FormData();
      
      // Append form data (including the image_src that was updated after file upload)
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      try {
        const userId = id;
        const response = await axios.post(`${serverHost}/submit-form-vendor/${userId}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }, // Set content type for file upload
        });
        console.log(response.data.message); // Log success message
        alert('Form data sent to server!');
        navigate(`/clientprofile/id=${id}/product-list`);
      
        // Proceed to step 3 after successful upload
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Failed to submit form.');
      }
    }
  };
  
  
    
  

  const handleBack = () => {
    if (step === 2) {
      setStep(1); // Go back to the shop information section
    } else if (step === 3) {
      setStep(2); // Go back to the address section
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  

  const handleToggleEdit = () => {
    if (isEditing) {
      // Logic to save changes
      console.log("Saved Email:", formData.businessEmail);
    }
    setIsEditing(!isEditing); // Toggle between edit and save modes
  };


  useEffect(() => {
    if (id) {
      const fetchBusinessEmail = async () => {
        try {
          const response = await axios.get(`${serverHost}/fetchEmail/${id}`);
          const email = response.data.email;
          if (email) {
            setFormData((prev) => ({ ...prev, businessEmail: email }));
          }
        } catch (error) {
          console.error("Error fetching business email:", error);
        }
      };
      fetchBusinessEmail();
    } else {
      console.error("Invalid userId:", id);
    }
  }, [id]);


  


  
  return (
    <div className="p-2">

      {/* Shop Information Section */}
      {step === 1 && (
        <div className="mb-6 shadow p-4 bg-white rounded">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Business Information</h2>
          
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label htmlFor="shopName" className="block text-sm font-medium mb-1">
                Business Name
              </label>
              <input type="text" id="businessName" name="businessName" value={formData.businessName} className="w-full p-2 border border-gray-300 rounded" placeholder="Enter your business name" onChange={handleChange} required />
            </div>
            <div className="flex-1">
              <label htmlFor="shopCategory" className="block text-sm font-medium mb-1">
                Business Category
              </label>
              <select 
                id="shopCategory" 
                name="shopCategory" 
                value={formData.businessCategory} 
                onChange={(e) => setFormData({ ...formData, businessCategory: e.target.value })} 
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="" disabled>Select your business category</option>
                <option value="Business Owner">Business Owner</option>
                <option value="Freelancer">Freelancer</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label htmlFor="businessEmail" className="block text-sm font-medium mb-1">
                Business Email
              </label>
              <div className="relative">
                {/* Input Field */}
                <input
                  type="text"
                  id="businessEmail"
                  name="businessEmail"
                  value={formData.businessEmail}
                  onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                  disabled={!isEditing} // Disable input if not in editing mode
                  className={`w-full p-2 border border-gray-300 rounded pr-20 ${
                    isEditing ? "bg-white" : "bg-gray-100"
                  }`} // Change background based on state
                  placeholder="Enter your business email"
                />

                {/* Default Text and Icon */}
                <div className="absolute inset-y-0 right-2 flex items-center space-x-2">
                  {!isEditing && <span className="text-gray-500 text-sm">Default</span>}
                  <button
                    onClick={handleToggleEdit}
                    className="text-green-900 hover:text-green-500"
                  >
                    {isEditing ? (
                      <i className="fas fa-save"></i> // Save Icon
                    ) : (
                      <i className="fas fa-edit"></i> // Edit Icon
                    )}
                  </button>
                </div>
              </div>
            </div>

            
            <div className="flex-1">
              <label htmlFor="businessContact" className="block text-sm font-medium mb-1">
                Business Contact Number
              </label>
              <input type="number" id="businessContact" name="businessContact" value={formData.businessContact} onChange={(e) => setFormData({ ...formData, businessContact: e.target.value })} className="w-full p-2 border border-gray-300 rounded" placeholder="Enter your business category" />

            </div>
          </div>
          
          <section className="shadow  bg-white rounded relative">
                     
                  {/* Province, City, Barangay */}
                  <h1 className='text-xl font-bold text-gray-700 mb-4'>Business Address</h1>
                  <div className="flex gap-4 mb-4">
                      <div className="flex-1">
                      <label htmlFor="province" className="block text-sm font-medium mb-1">Province</label>
                      <input type="text" id="province" name="province" value={formData.province} onChange={(e) => setFormData({ ...formData, province: e.target.value })} className="w-full p-2 border border-gray-300 rounded" placeholder="Select or type a Province" list="provinces" />
                      <datalist id="provinces">
                          <option value="Province 1" />
                          <option value="Province 2" />
                          <option value="Province 3" />
                          <option value="Province 4" />
                      </datalist>
                  </div>
                  <div className="flex-1">
                      <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
                      <input type="text" id="city" name="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full p-2 border border-gray-300 rounded" placeholder="Select or type a City" list="cities"
          />
                      <datalist id="cities">
                          <option value="City 1" />
                          <option value="City 2" />
                          <option value="City 3" />
                          <option value="City 4" />
                      </datalist>
                      </div>
                      <div className="flex-1">
                      <label htmlFor="barangay" className="block text-sm font-medium mb-1">Barangay</label>
                      <input type="text" id="barangay" name="barangay" value={formData.barangay} onChange={(e) => setFormData({ ...formData, barangay: e.target.value })} className="w-full p-2 border border-gray-300 rounded" placeholder="Select or type a Barangay" list="barangays" />
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
                      <input type="text" id="postalCode" name="postalCode" value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} className="w-full p-2 border border-gray-300 rounded" placeholder="Postal Code" /> </div>

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
              </div>
          )}

    {/* Submit Section */}
      {step === 2 && (
         <div className="flex flex-col h-auto p-4">
         <h1 className="text-xl font-bold mb-4">
           {formData.businessCategory === "Freelancer"
             ? "Upload your document image as FREELANCER"
             : "Upload your document image as BUSINESS OWNER"}
         </h1>
         <ul className="list-disc list-inside text-gray-500 mb-4">
           {formData.businessCategory === "Freelancer" ? (
             <li>Take a picture of yourself holding your valid ID</li>
           ) : (
             <li>Upload a scanned copy of your business permit</li>
           )}
           <p className="text-gray-400 text-sm mt-2">
             This is for verification purposes, and we assure that all private
             information is secured.
           </p>
         </ul>
   
         <section className="w-full justify-center items-center flex">
           <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
             <h2 className="text-lg font-semibold mb-4 text-center">Upload Image</h2>
             <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-4 rounded-md">
               <p className="text-gray-500 mb-2">Drag & Drop or Click to Upload</p>
               <input
                 type="file"
                 className="hidden"
                 id="file-upload"
                 accept="image/*"
                 onChange={handleImageUpload}
               />
               <label
                 htmlFor="file-upload"
                 className="cursor-pointer bg-green-800 text-white px-4 py-2 rounded hover:bg-blue-600"
               >
                 Choose File
               </label>
             </div>
             {imageSrc && (
                <div className="mt-4">
                  <img src={imageSrc} alt={imageName} className="w-full h-auto rounded" />
                </div>
              )}

           </div>
         </section>
       </div>
  
      )}



      {/* Review Information Section */}
      {step === 3 && (
        <div className="shadow p-4 bg-white rounded">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Review Information</h2>
          <div className="mb-4">
            <p><strong>Business Name:</strong> {formData.businessName}</p>
            <p><strong>Business Category:</strong> {formData.businessCategory}</p>
            <p><strong>Business Email:</strong> {formData.businessEmail}</p>
            <p><strong>Business Contact:</strong> {formData.businessContact}</p>
            <p><strong>Province:</strong> {formData.province}</p>
            <p><strong>City:</strong> {formData.city}</p>
            <p><strong>Barangay:</strong> {formData.barangay}</p>
            <p><strong>Postal Code:</strong> {formData.postalCode}</p>
          </div>
        </div>
      )}

      {/* Navigation Button */}
      <div className="flex justify-end mt-6">
        {step === 2 || step === 3 ? (
          <button
            onClick={handleBack}
            className="text-black px-6 py-2"
          >
            Back
          </button>
        ) : null}
        <button
          onClick={handleNext}
          type="submit"
          className="text-white px-6 py-2 rounded-lg bg-green-800 hover:bg-green-800 hover:text-white"
        >
          {step === 1 ? 'Next' : step === 2 ? 'Next' : 'Submit'}
        </button>
      </div>
    </div>
  );
};


export default Business;
