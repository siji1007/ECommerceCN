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
  const [quantity, setQuantity] = useState(1);


  if (!isOpen) return null; // Don't render if modal is closed

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    // Handle comment submission
    console.log('Comment:', comment);
    setComment(''); // Clear the comment field after submission
  };

  const [activeTab, setActiveTab] = useState('comments');

  const [rating, setRating] = useState(0);



  const handleRating = (star) => setRating(star);

  function onBuyNow(product: any, quantity: number): void {
    throw new Error('Function not implemented.');
  }

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

            
              <div className="flex items-center justify-between">
              <p className="font-semibold mb-2">Description</p>
                <div
                  className="ml-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 cursor-pointer"
                  title="More information about the product" // Tooltip on hover
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2.25m0 4.5h.008v.008H12v-.008zM21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-gray-700">
                  {product.prod_descript}
                </p>
            </div>

          {/* Right Section: Product Price and Comment Section */}
          <div className="w-1/3 pl-4 flex flex-col justify-between">
          <section className="flex justify-between items-center border-b">
            <section className='flex items-center'>
            <img src="src/assets/profiles/Profile.jpg" alt="" className="mr-1 h-5 w-5" />
            <h1 className='font-bold'>{product.vendor_name}</h1>
            </section>
              
              <button className="btn text-xs mr-2">Follow</button>
          </section>


            {/* Product Price */}
            <div className="flex justify-between items-center mb-4 mt-2">
              <span className="text-green-800 font-bold text-xl">{"₱ " + product.prod_price}</span>
              <p className="text-yellow-500">
                {'⭐'.repeat(Math.round(2))} {/* Star rating */}
              </p>
            </div>

            <div className="flex flex-col h-full">
              <p className='text-medium'>{"Category: " + product.prod_category}</p>
              <p className='text-medium'>{"Stocks: " + product.prod_stock}</p>
              <div className="mb-6">
              {/* Quantity Selector */}
              <div className="flex items-center justify-center mb-4">
                <button
                  onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                  className="bg-gray-200 text-gray-700 rounded-l-lg px-4 py-2"
                >
                  -
                </button>
                <span className="text-lg font-semibold px-4">{quantity}</span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="bg-gray-200 text-gray-700 rounded-r-lg px-4 py-2"
                >
                  +
                </button>
              </div>

            {/* Add to Cart and Buy Now Buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => onAddToCart(product, quantity)}
                className="border text-green-800 rounded-lg px-6 py-2 text-sm flex items-center"
              >
                <FaShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </button>

              <button
                onClick={() => onBuyNow(product, quantity)}
                className="bg-green-600 text-white rounded-lg text-sm  px-6 py-2 flex items-center"
              >
                      <FaShoppingCart className="h-5 w-5 mr-2" />
                Buy Now
              </button>
            </div>
          </div>


     
          {/* Comments and Reviews Section */}
          <div className="mt-auto  h-full w-full flex flex-col ">
            {/* Tabs */}
            <div className="flex justify-between ">
              <button
                onClick={() => setActiveTab('comments')}
                className={`w-1/2 py-2 ${activeTab === 'comments' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Comments
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`w-1/2 py-2 ${activeTab === 'reviews' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'} `}
              >
                Reviews
              </button>
            </div>

            {/* Content Section */}
            <div className="flex-grow flex flex-col justify-end ">
              {activeTab === 'comments' && (
                <div className="overflow-y-auto max-h-72"> {/* Added scrollable area */}
                  <input
                    type="text"
                    value={comment}
                    onChange={handleCommentChange}
                    placeholder="Leave a comment..."
                    className="border p-2 w-full"
                  />
                  <button
                    onClick={handleCommentSubmit}
                    className="mt-2 bg-green-600 text-white rounded-lg px-6 py-2 w-full"
                  >
                    Submit Comment
                  </button>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="overflow-y-auto max-h-50"> {/* Added scrollable area */}
                  <div className="flex flex-col items-center space-y-2">
                    {[
                      { label: "Very Satisfied", star: 5 },
                      { label: "Satisfied", star: 4 },
                      { label: "Neutral", star: 3 },
                      { label: "Dissatisfied", star: 2 },
                      { label: "Very Dissatisfied", star: 1 },
                    ].map((item) => (
                      <div key={item.star} className="flex items-center justify-between w-full">
                        <span className="text-xs text-gray-700 w-1/3">{item.label}</span>
                        <div className="flex space-x-1">
                          {[...Array(item.star)].map((_, index) => (
                            <button
                              key={index}
                              onClick={() => handleRating(item.star)}
                              className={`text-sm ${rating >= item.star ? 'text-yellow-500' : 'text-gray-400'}`}
                            >
                              ⭐
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
