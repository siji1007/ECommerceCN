import React, { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';

interface ProductModalProps {
  isOpen: boolean;
  product: any;
  onClose: () => void;
  onAddToCart: (product: any) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, product, onClose, onAddToCart }) => {
  const [comment, setComment] = useState<string>(''); // State for comment input

  if (!isOpen) return null; // Don't render if modal is closed

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    // Handle comment submission
    console.log('Comment:', comment);
    setComment(''); // Clear the comment field after submission
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-3/4 max-w-5xl relative overflow-hidden">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600">
          X
        </button>

        {/* Modal Content */}
        <div className="flex h-[70vh] overflow-hidden">
          {/* Left Section: Product Name, Image, and Description */}
          <div className="w-2/3 pr-4 overflow-auto">
            {/* Product Name */}
            <h2 className="text-xl font-bold mb-4">{product.prod_name}</h2>

            {/* Product Image */}
            <img
              src={product.prod_image_id}
              alt={product.prod_name}
              className="w-full h-[50vh] object-cover rounded-md mb-4 border"
            />

            {/* Product Description */}
            <p className="font-semibold">Description</p>
            <p className="text-gray-700 mb-4">{product.prod_descript}</p>
          </div>

          {/* Right Section: Product Price and Comment Section */}
          <div className="w-1/3 pl-4 flex flex-col justify-between">
            {/* Product Price */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-green-800 font-bold text-xl">{"₱ " + product.prod_price}</span>
              <p className="text-yellow-500">
                {'⭐'.repeat(Math.round(2))} {/* Star rating */}
              </p>
            </div>

            {/* Comment Section */}
            <div className="flex flex-col h-full">
            <p className='text-medium'>{"Category: " + product.prod_category}</p>
            <p className='text-medium'>{"Stocks: " + product.prod_stock}</p>
              <div className="flex justify-end mb-4">
                {/* Add to Cart Button */}
               
                <button
                  onClick={() => onAddToCart(product)}
                  className="bg-green-600 text-white rounded-lg px-6 py-2 flex"
                >
                  <FaShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </button>
              </div>

              {/* Comment Input and Submit */}
              <div className="mt-auto">
                <input
                  type="text"
                  value={comment}
                  onChange={handleCommentChange}
                  placeholder="Leave a comment..."
                  className="border rounded-lg p-2 w-full"
                />
                <button
                  onClick={handleCommentSubmit}
                  className="mt-2 bg-blue-600 text-white rounded-lg px-6 py-2 w-full"
                >
                  Submit Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
