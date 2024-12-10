import React, { useState } from 'react';
import axios from 'axios';
import hosting from '../../host/host.txt?raw'

// Define Product type if you don't have it already
interface Product {
  prod_id: number;
  prod_name: string;
  prod_category: string;
  prod_descript: string;
  prod_price: number;
  prod_disc_price: number;
  prod_image_id: string;
}

const ProductDetails: React.FC<{ product: Product; onClose: () => void; onProductDeleted: (prod_id: number) => void }> = ({ product, onClose, onProductDeleted }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true); // Set loading state before the request
      await axios.delete(`${hosting}/deleteProduct/${product.prod_id}`);
      alert('Product deleted successfully!');
      onProductDeleted(product.prod_id); // Custom callback to remove the product from the UI
      onClose(); // Close modal after deletion
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('An error occurred while deleting the product.');
    } finally {
      setLoading(false); // Ensure loading is turned off after the request
    }
  };

  const handleUpdate = () => {
    // Redirect to update page or show form to update product details
    alert(`Navigate to update product with ID: ${product.prod_id}`);
  };

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
        <h2 className="text-xl font-semibold mb-4">Product Details</h2>
        <div>
          <p><strong>Product Name:</strong> {product.prod_name}</p>
          <p><strong>Category:</strong> {product.prod_category}</p>
          <p><strong>Description:</strong> {product.prod_descript}</p>
          <p><strong>Price:</strong> ${product.prod_price}</p>
          <p><strong>Discounted Price:</strong> ${product.prod_disc_price}</p>
        </div>
        <div className="mt-4 flex justify-between">
          <button
            className="bg-red-500 text-white py-2 px-4 rounded-md"
            onClick={handleDelete}
            disabled={loading} // Disable delete button when loading
          >
            {loading ? 'Deleting...' : 'Delete Product'}
          </button>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
            onClick={handleUpdate}
          >
            Update Product
          </button>
        </div>
        <button
          className="absolute top-2 right-2 text-xl text-gray-500"
          onClick={onClose} // Close modal
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
