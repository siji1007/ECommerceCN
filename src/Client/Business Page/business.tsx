import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa';

const Business: React.FC = () => {
  const [step, setStep] = useState(1); // To track which section to display

  const handleNext = () => {
    if (step === 1) {
      setStep(2); // Go to the submit section
    } else {
      
        alert('Form Submitted!'); // Handle the submit action
        localStorage.setItem('BusinessStatus', 'verified');
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1); // Go back to the shop information section
    }
  };

  return (
    <div className="p-6">
      {/* Shop Information Section */}
      {step === 1 && (
        <div className="mb-6 shadow p-4 bg-white rounded">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Shop Information</h2>
          
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label htmlFor="shopName" className="block text-sm font-medium mb-1">
                Shop Name
              </label>
              <input
                type="text"
                id="shopName"
                name="shopName"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your shop name"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="shopCategory" className="block text-sm font-medium mb-1">
                Shop Category
              </label>
              <input
                type="text"
                id="shopCategory"
                name="shopCategory"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your shop category"
              />
            </div>
          </div>
          
          <section className="shadow  bg-white rounded relative">
                     
                            
                            {/* Province, City, Barangay */}
                            <h1 className='text-xl font-bold text-gray-700 mb-4'>Address</h1>
                            <div className="flex gap-4 mb-4">
                                <div className="flex-1">
                                <label htmlFor="province" className="block text-sm font-medium mb-1">Province</label>
                                <input type="text" id="province" name="province" className="w-full p-2 border border-gray-300 rounded" placeholder="Select or type a Province" list="provinces" />
                                <datalist id="provinces">
                                    <option value="Province 1" />
                                    <option value="Province 2" />
                                    <option value="Province 3" />
                                    <option value="Province 4" />
                                </datalist>
                            </div>
                            <div className="flex-1">
                                <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
                                <input type="text" id="city" name="city" className="w-full p-2 border border-gray-300 rounded" placeholder="Select or type a City" list="cities" />
                                <datalist id="cities">
                                    <option value="City 1" />
                                    <option value="City 2" />
                                    <option value="City 3" />
                                    <option value="City 4" />
                                </datalist>
                                </div>
                                <div className="flex-1">
                                <label htmlFor="barangay" className="block text-sm font-medium mb-1">Barangay</label>
                                <input type="text" id="barangay" name="barangay" className="w-full p-2 border border-gray-300 rounded" placeholder="Select or type a Barangay" list="barangays" />
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
        </div>
      )}

      {/* Submit Section */}
      {step === 2 && (
        <div className="mb-6 shadow p-4 bg-white rounded">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Submit Your Information</h2>
          
          <p className="mb-4">Review your shop information and submit.</p>

          {/* Display the values if needed, or just a message */}
          <div className="mb-4">
            <p><strong>Shop Name:</strong> [Shop Name]</p>
            <p><strong>Shop Category:</strong> [Shop Category]</p>
            <p><strong>Shop Location:</strong> [Shop Location]</p>
          </div>
        </div>
      )}
       

      {/* Navigation Button */}
      <div className="flex justify-end mt-6">
      {step === 2 && (
          <button
            onClick={handleBack}
            className=" text-black px-6 py-2"
          >
            Back
          </button>
        )}
        <button
          onClick={handleNext}
          className=" text-white px-6 py-2 rounded-lg bg-green-800 hover:bg-green-800 hover:text-white "
        >
          {step === 1 ? 'Next' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default Business;
