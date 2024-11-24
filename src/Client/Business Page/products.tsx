import React, { useState } from 'react';
const Products: React.FC = () => {

    const [images, setImages] = useState([]);

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file && images.length < 3) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages((prevImages) => [...prevImages, reader.result]);
        };
        reader.readAsDataURL(file);
      }
    };
  
    const handleImageDelete = (index) => {
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
    };
  
  return (
    <div className="flex flex-wrap space-x-2 w-full relative h-screen">
      {/* Left Section */}
      <div className="flex-grow p-4 relative">
        {/* Product Information Section */}
        <div className="mb-6 ">
        <label className="block text-gray-700 font-bold border-b border-gray-700">Product Information</label>

          <div className="mt-5 ">
            <label className="block text-gray-600 font-semibold">Product Name</label>
            <input type="text" placeholder="Enter product name" className="mt-1 p-2 border border-gray-300 rounded w-full" />
          </div>
         
        </div>

 
    <div className="mb-6 flex justify-between ">
      {/* Product Media Upload Section */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Product Media</label>
          <div className="relative w-24 h-24 mx-auto border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <input type="file" accept="image/*" className="absolute w-full h-full opacity-0 cursor-pointer" onChange={handleImageUpload} />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-gray-500" > <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /> </svg>
          </div>
          <p className="mt-2 text-gray-500 text-sm text-center">Upload Image</p>
        </div>
      </div>

        {/* Display Uploaded Images */}
        <div className="flex justify-end border border-gray-100 p-2">
            <div className="mt-4 flex justify-end space-x-2">
                {images.map((image, index) => (
                    <div key={index} className="relative">
                        <img
                        src={image}
                        alt={`Uploaded ${index}`}
                        className="w-24 h-24 object-cover rounded-lg"
                        />
                        <button onClick={() => handleImageDelete(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center" > <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4" > <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> </svg> </button>
                    </div>
                    ))}
                </div>
            </div>
        </div>



        {/* Pricing Section */}
        <div className="mb-6 ">
          <label className="block text-gray-700 font-semibold">Pricing</label>
          <div className="flex space-x-4 mt-2">
            {/* Price Div */}
            <div className="flex-1">
              <label className="block text-gray-600">Price</label>
              <input type="number" placeholder="Enter price" className="mt-1 p-2 border border-gray-300 rounded w-full" />
            </div>

            {/* Discount Price Div */}
            <div className="flex-1">
              <label className="block text-gray-600">Discounted Price</label>
              <input type="number" placeholder="Enter discounted price" className="mt-1 p-2 border border-gray-300 rounded w-full" />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button className=" text-black px-4 py-2 rounded">Save</button>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full sm:w-1/4 p-4 border border-gray-300 rounded-md relative">
        {/* Product Category Section */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold">Product Category</label>
          <input type="text" placeholder="Enter category" className="mt-2 p-2 border border-gray-300 rounded w-full" />
        
        </div>

        {/* Collection Section */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold">Collection</label>
          <input type="text" placeholder="Enter collection" className="mt-2 p-2 border border-gray-300 rounded w-full" />
       
        </div>

        {/* Product Handle Section */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold">Product Description</label>
          <textarea placeholder="Enter product description" className="mt-2 p-2 border border-gray-300 rounded w-full h-32 resize-none" />

          <div className="flex justify-end mt-4">
          <button className=" text-black px-4 py-2 rounded ">Save</button>
          </div>
        </div>
      </div>

      {/* Add Button */}
      <div className="absolute bottom-4 right-4">
        <button className="bg-green-500 text-white px-6 py-3 rounded">Add</button>
      </div>
    </div>
  );
};

export default Products;
