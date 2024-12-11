import React, { useState, useEffect } from 'react';
import axios from 'axios';
import hosting from '../../host/host.txt?raw';

// Define Product type
interface Product {
  prod_id: number;
  prod_name: string;
  prod_category: string;
  prod_descript: string;
  prod_price: number;
  prod_disc_price: number;
  prod_image_id: string;
  prod_stock: number;
  prod_status: string;
}

const ProductDetails: React.FC<{ product: Product; onClose: () => void; onProductDeleted: (prod_id: number) => void }> = ({ product, onClose, onProductDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState<Product>(product);
  const [imagePreview, setImagePreview] = useState<string | null>(product.prod_image_id);
  const [imageChanged, setImageChanged] = useState(false);
  const [actionStatus, setActionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle'); // Track action status
  const [loadingMessage, setLoadingMessage] = useState(''); // State to hold loading message

  useEffect(() => {
    if (product.prod_image_id) {
      setImagePreview(product.prod_image_id);
    }
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      setActionStatus('loading');
      setLoadingMessage('Deleting product...');
      await axios.delete(`${hosting}/deleteProduct/${product.prod_id}`);
      setActionStatus('success');
      setLoadingMessage('Product deleted successfully!');

      onProductDeleted(product.prod_id);
      onClose();
    } catch (error) {
      console.error('Error deleting product:', error);
      setActionStatus('error');
      setLoadingMessage('An error occurred while deleting the product.');
    
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      setActionStatus('loading');
      setLoadingMessage('Updating product...');
      const updatedData = { ...updatedProduct, prod_image_id: imagePreview };

      await axios.put(`${hosting}/updateProduct/${updatedProduct.prod_id}`, updatedData);
      setActionStatus('success');
      setLoadingMessage('Product updated successfully!');
   
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      setActionStatus('error');
      setLoadingMessage('An error occurred while updating the product.');
  
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      axios.post(`${hosting}/uploadProductImage`, formData)
        .then((response) => {
          if (response.status === 200) {
            const uploadedImageUrl = response.data.imageUrl;
            setImagePreview(uploadedImageUrl);
            setImageChanged(true);
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

  const handleImageDelete = () => {
    if (imagePreview) {
      const filename = imagePreview.split('/').pop();
      axios.delete(`${hosting}/deleteProductImage/${filename}`)
        .then((response) => {
          if (response.status === 200) {
            setImagePreview(null);
            setImageChanged(false);
          } else {
            alert('Failed to delete the image.');
          }
        })
        .catch((error) => {
          console.error('Error deleting image:', error);
          alert('An error occurred while deleting the image.');
        });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center">
      {/* Loading Spinner Centered */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
          <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <div className="animate-spin mb-4 w-12 h-12 border-4 border-t-4 border-gray-500 border-solid rounded-full" />
            <p className="text-xl">{loadingMessage}</p>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
        <h2 className="text-xl font-semibold mb-4">Product Details</h2>

        <div className="overflow-y-auto max-h-[400px]">
          <label className="block mb-2">
            Product Name:
            <input
              type="text"
              name="prod_name"
              value={updatedProduct.prod_name}
              onChange={handleInputChange}
              className="border rounded-md p-2 w-full"
            />
          </label>

          <label className="block mb-2">
            Category:
            <input
              type="text"
              name="prod_category"
              value={updatedProduct.prod_category}
              onChange={handleInputChange}
              className="border rounded-md p-2 w-full"
            />
          </label>

          <label className="block mb-2">
            Description:
            <textarea
              name="prod_descript"
              value={updatedProduct.prod_descript}
              onChange={handleInputChange}
              className="border rounded-md p-2 w-full"
              rows={4}
            />
          </label>

          <label className="block mb-2">
            Price:
            <input
              type="number"
              name="prod_price"
              value={updatedProduct.prod_price}
              onChange={handleInputChange}
              className="border rounded-md p-2 w-full"
            />
          </label>

          <label className="block mb-2">
            Discounted Price:
            <input
              type="number"
              name="prod_disc_price"
              value={updatedProduct.prod_disc_price}
              onChange={handleInputChange}
              className="border rounded-md p-2 w-full"
            />
          </label>

          <label className="block mb-2">
            Stock:
            <input
              type="number"
              name="prod_stock"
              value={updatedProduct.prod_stock}
              onChange={handleInputChange}
              className="border rounded-md p-2 w-full"
            />
          </label>

          <div className="mt-4">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Product Image"
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <button
                  onClick={handleImageDelete}
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
            ) : (
              <p>No image uploaded</p>
            )}
          </div>

          <div className="mt-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mb-4"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-between">
          <button
            className="bg-red-500 text-white py-2 px-4 rounded-md"
            onClick={handleDelete}
            disabled={loading}
          >
            {actionStatus === 'loading' && <span>Deleting...</span>}
            {actionStatus === 'success' && <span>Deleted ✔️</span>}
            {actionStatus === 'idle' && 'Delete Product'}
          </button>

          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
            onClick={handleUpdate}
            disabled={loading}
          >
            {actionStatus === 'loading' && <span>Updating...</span>}
            {actionStatus === 'success' && <span>Updated ✔️</span>}
            {actionStatus === 'idle' && 'Update Product'}
          </button>
        </div>

        <button
          className="absolute top-2 right-2 text-xl text-gray-500"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
