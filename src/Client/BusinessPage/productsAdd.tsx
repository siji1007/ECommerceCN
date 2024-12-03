import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import hosting from '../../host/host.txt?raw';
const ProductsAdd: React.FC = () => {
    const serverURL = hosting.trim();
    const [images, setImages] = useState([]);
    const [vendorID, setVendorID] = useState<string | null > (null); 
    const [formData, setFormData] = useState({
      prodName: '',
      prodCategory: '',
      prodStocks : '',
      description: '',
      price: '',
      discountPrice: ''
    });

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files ? event.target.files[0] : null;
      if (file && images.length < 3) {
        const formData = new FormData();
        formData.append('file', file);
      
        // Upload the image file to the Flask server
        axios.post(`${serverURL}/uploadProductImage`, formData)
          .then((response) => {
            if (response.status === 200) {
              // Assuming server returns the image filename
              setImages((prevImages) => [...prevImages, response.data.imageUrl]); // storing only the filename
            } else {
              alert('Failed to upload image. Please try again.');
            }
          })
          .catch((error) => {
            console.error('Error uploading image:', error);
            alert('An error occurred while uploading the image.');
          });
      }
    };

    
    const handleImageDelete = (index: number) => {
      const imageToDelete = images[index]; // Get the image URL (not the full URL)
      
      // Extract just the filename from the image URL
      const filename = imageToDelete.split('/').pop(); // Get the filename from the full URL
    
      // Send a DELETE request to Flask to delete the image from the server
      axios.delete(serverURL + `/deleteProductImage/${filename}`)
        .then((response) => {
          if (response.status === 200) {
            // Remove the image from the state if the server deletion is successful
            const newImages = images.filter((_, i) => i !== index);
            setImages(newImages);
          } else {
            alert('Failed to delete the image from the server.');
          }
        })
        .catch((error) => {
          console.error('Error deleting image:', error);
          alert('An error occurred while deleting the image from the server.');
        });
    };
    
    


    let url = window.location.href;
    let match = url.match(/id=(\d+)/);  
    const id = match ? match[1] : null;
    if (!id) {
        return <div>ID not found in the URL</div>;
    }


    useEffect(() => {
      const fetchVendorID = async () => {
        try {
          const response = await axios.get( serverURL + `/fetchVendorId/${id}`);
          setVendorID(response.data.vendor_id);
        } catch (error) {
          console.error('Error fetching vendor ID:', error);
          setVendorID(null);
        }
      };
  
      fetchVendorID();
    }, [id]);


    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
  
    const handleAddClick = async () => {
      const { prodName, prodCategory, prodStocks, description, price, discountPrice } = formData;
    
      // Convert images array to a comma-separated string
      const imageString = Array.isArray(images) ? images.join(',') : images;
    
      // Prepare the product data
      const productData = {
        vendor_id: vendorID || null,
        prod_name: prodName,
        prod_category: prodCategory,
        prod_stock: prodStocks,
        prod_descript: description,
        prod_price: price,
        prod_disc_price: discountPrice,
        prod_image_id: imageString, // Send as a single string
      };
    
      try {
        const response = await axios.post(`${serverURL}/addProduct`, productData);
        if (response.status === 201) {
          alert('Product added successfully!');
          console.log('Server Response:', response.data);
        } else {
          alert('Failed to add product. Please try again.');
          console.error('Error Response:', response);
        }
      } catch (error) {
        alert('An error occurred while adding the product.');
        console.error('Error:', error);
      }
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
            <input type="text" name="prodName" placeholder="Enter product name" value={formData.prodName} onChange={handleInputChange} className="mt-1 p-2 border border-gray-300 rounded w-full" />
          </div>
         
        </div>

 
        {/* Product Media Upload Section */}
        <div className="mb-6 flex justify-between">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Product Media</label>
              <div className="relative w-24 h-24 mx-auto border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImageUpload}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-8 h-8 text-gray-500"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
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
           src={`${image}`}  // The image path not url returned from Flask
            alt={`Uploaded ${index}`}
            className="w-24 h-24 object-cover rounded-lg"
          />
          <button
            onClick={() => handleImageDelete(index)}
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-6 ">
          <label className="block text-gray-700 font-bold border-b border-gray-700">Pricing</label>
          <div className="flex space-x-4 mt-2">
            {/* Price Div */}
            <div className="flex-1">
              <label className="block text-gray-600 font-semibold">Price</label>
              <input type="number" placeholder="Enter price" name='price' className="mt-1 p-2 border border-gray-300 rounded w-full" value={formData.price} onChange={handleInputChange}/>
            </div>

            {/* Discount Price Div */}
            <div className="flex-1">
              <label className="block text-gray-600 font-semibold">Discounted Price</label>
              <input type="number" name='discountPrice' placeholder="Enter discounted price" className="mt-1 p-2 border border-gray-300 rounded w-full" value={formData.discountPrice} onChange={handleInputChange} />
            </div>
          </div>
     
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full sm:w-1/4 p-4 border border-gray-300 rounded-md relative">
        {/* Product Category Section */}
 
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold">Product Category</label>
          <select
            name="prodCategory"
            value={formData.prodCategory}
            onChange={handleInputChange}
            className="mt-2 p-2 border border-gray-300 rounded w-full"
          >
            <option value="">Select a category</option>
            <option value="food">Food</option>
            <option value="handcraft">Handcraft</option>
          </select>
        </div>

        {/* Stock Section */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold">Stocks</label>
          <input type="number" placeholder="Enter product stocks" className="mt-2 p-2 border border-gray-300 rounded w-full" name='prodStocks' value={formData.prodStocks} onChange={handleInputChange} />
       
        </div>

        {/* Product Handle Section */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold">Product Description</label>
          <textarea placeholder="Enter product description" className="mt-2 p-2 border border-gray-300 rounded w-full h-32 resize-none" name='description' value={formData.description} onChange={handleInputChange} />

      
        </div>
      </div>

      {/* Add Button */}
      
      <div className="absolute space-x-2 bottom-4 right-4">
        <Link to={`/clientprofile/id=${id}/product-list`}>
            <button className=" text-black px-6 py-3 rounded mb-20">Back</button>
        </Link>
        <button className="bg-green-900 text-white px-6 py-3 rounded mb-20" onClick={handleAddClick}>Add</button>
      </div>
    </div>
  );
};

export default ProductsAdd;
