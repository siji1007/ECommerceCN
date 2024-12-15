import React, { useState, useEffect } from "react";
import axios from "axios";
import host from '../../host/host.txt?raw';

interface Product {
  prod_id: number;
  vendor_id: number | null;
  vendor_name: string | null;
  prod_category: string;
  prod_name: string;
  prod_descript: string;
  prod_price: number;
  prod_disc_price: number | null;
  prod_status: string;
  prod_image_id: string;
  prod_stock: number;
}

const ProductManage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ServerURl = host.trim();

  const fetchProducts = async () => {
    try {
      const response = await axios.get(ServerURl + "/FetchProducts");
      if (response.data.products) {
        setProducts(response.data.products);
      } else {
        setError("No products found.");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Error fetching products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openModal = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const handleDelete = async (id: number) => {
    try {
      // Make a DELETE request to the server
      const response = await axios.delete(`${host}/DeleteProduct/${id}`);
      if (response.status === 200) {
        // Remove the product from the state by filtering it out
        setProducts((prevProducts) => prevProducts.filter((product) => product.prod_id !== id));
        alert("Product deleted successfully.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete the product. Please try again.");
    } finally {
      closeModal();  // Ensure the modal is closed even after the delete operation
    }
  };
  
  const handleSave = () => {
    if (selectedProduct) {
      // Update the product list with the updated product details
      setProducts(
        products.map((product) =>
          product.prod_id === selectedProduct.prod_id ? selectedProduct : product
        )
      );
      // Send the updated product data to the backend
      fetch(ServerURl+`/updateProduct/${selectedProduct.prod_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prod_name: selectedProduct.prod_name,
          prod_price: selectedProduct.prod_price,
          prod_descript: selectedProduct.prod_descript,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Product updated:', data);
          closeModal(); // Close the modal after saving
        })
        .catch((error) => {
          console.error('Error updating product:', error);
        });
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Product Management</h1>

      {loading ? (
          <div className="relative">
          {/* Content here (e.g., filtered products) */}
        
          {/* Loading Modal */}
          <div className="absolute mt-10 inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
          </div>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.prod_id}
              className="border rounded-lg p-4 shadow hover:shadow-lg cursor-pointer"
              onClick={() => openModal(product)}
            >
              <img
                src={product.prod_image_id || "https://via.placeholder.com/150"}
                alt={product.prod_name}
                className="w-full h-48 object-cover rounded"
              />
              <h2 className="text-lg font-bold mt-2">{product.prod_name}</h2>
              <p className="text-gray-600">
              ₱ {product.prod_price.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Custom Modal */}
      {selectedProduct && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto" >
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <img
              src={selectedProduct.prod_image_id || "https://via.placeholder.com/150"}
              alt={selectedProduct.prod_name}
              className="w-full h-64 object-cover rounded mb-4"
            />
            <label className="block mb-2 font-medium">Name</label>
            <input
              type="text"
              value={selectedProduct.prod_name}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  prod_name: e.target.value,
                })
              }
              className="border rounded px-3 py-2 w-full mb-4"
            />
            <label className="block mb-2 font-medium">Price</label>
            <input
              type="number"
              value={selectedProduct.prod_price}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  prod_price: parseFloat(e.target.value),
                })
              }
              className="border rounded px-3 py-2 w-full mb-4"
            />
            <label className="block mb-2 font-medium">Description</label>
            <textarea
              value={selectedProduct.prod_descript}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  prod_descript: e.target.value,
                })
              }
              className="border rounded px-3 py-2 w-full mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => handleDelete(selectedProduct.prod_id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManage;
