import React, { useState } from 'react';
import { FaShoppingCart, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import host from '../host/host.txt?raw';
import ModalLogin from '../components/Modal_login';

interface ProductModalProps {
  isOpen: boolean;
  product: any;
  onClose: () => void;
  onAddToCart: (product: any, quantity: number) => void;
  onBuyNow: (product: any, quantity: number) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, product, onClose, onAddToCart, onBuyNow }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [buttonState, setButtonState] = useState<boolean>(false); // To trigger checkmark animation
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal login state
  const navigate = useNavigate();
  const severURL = host.trim();

  // Handle cart addition
  const handleCartNow = async (product: any, quantity: number) => {
    try {
      const response = await fetch(host + '/api/get-current-session', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
      });

      if (response.ok) {
        const data = await response.json();
        if (data.session_cookie && data.user_id) {
          const userId = data.user_id;

          try {
            const addToCartResponse = await fetch(host + '/api/cart/add', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                cart_id: null, // Auto-generated if applicable
                us_id: userId,
                product_id: product.prod_id,
                product_name: product.prod_name,
                product_classification: product.prod_category,
                product_quantity: quantity,
                total_price: (product.prod_price - product.prod_disc_price) * quantity,
                date_added: new Date().toISOString(),
              }),
            });

            if (addToCartResponse.ok) {
              // Show checkmark animation
              setButtonState(true);
              setTimeout(() => {
                setButtonState(false); // Reset the button state after animation
              }, 1500); // Animation duration (1.5s)
            } else {
              const errorData = await addToCartResponse.json();
              alert(`Failed to add product to cart: ${errorData.message || 'Unknown error'}`);
            }
          } catch (error) {
            console.error('Error while adding product to cart:', error);
            alert('An error occurred while adding the product to your cart.');
          }
        }
      } else if (response.status === 401) {
        // No active session, prompt login
        alert('Please log in to continue.');
        navigate('/login');
      } else {
        throw new Error('Unexpected error while checking session.');
      }
    } catch (error) {
      console.error('Error checking session:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  // Don't render if modal is closed
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-3/4 max-w-5xl relative overflow-hidden">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600">X</button>

        <div className="flex h-[70vh] overflow-hidden">
          {/* Left Section: Product Image and Description */}
          <div className="w-2/3 pr-4 overflow-auto">
            <h2 className="text-xl font-bold mb-4">{product.prod_name}</h2>
            <div className="relative w-full h-[50vh] mb-4">
              {/* Discount Label */}
              <div className="absolute top-0 left-0 bg-green-500 text-white font-bold py-1 px-2 rounded">
                {`-${((product.prod_disc_price / product.prod_price) * 100).toFixed(2)}%`}
              </div>
              <img src={product.prod_image_id} alt={product.prod_name} className="w-full h-full object-cover rounded-md border" />
            </div>
            <p className="text-gray-700">{product.prod_descript}</p>
          </div>

          {/* Right Section: Product Price, Quantity and Cart */}
          <div className="w-1/3 pl-4 flex flex-col justify-between overflow-auto">
            <div className="flex justify-between items-center border-b">
              <section className="flex items-center">
                <img src="src/assets/profiles/Profile.jpg" alt="" className="mr-1 h-5 w-5" />
                <h1 className="font-bold">{product.vendor_name}</h1>
              </section>
            </div>

            <div className="flex flex-col mb-4 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-green-800 font-bold text-xl">
                  {"₱ " + (product.prod_price - product.prod_disc_price).toFixed(2)}
                </span>
              </div>
              <p className="text-gray-600">
                Original Price: <span className="line-through ml-2">{"₱ " + product.prod_price.toFixed(2)}</span>
              </p>
            </div>

            <div className="flex flex-col h-full">
              <p className="text-medium">{"Category: " + product.prod_category}</p>
              <p className="text-medium">{"Stocks: " + product.prod_stock}</p>

              {/* Quantity Selector */}
              <div className="flex items-center justify-center mb-4">
                <button onClick={() => setQuantity(prev => Math.max(prev - 1, 1))} className="bg-gray-200 text-gray-700 rounded-l-lg px-4 py-2">-</button>
                <span className="text-lg font-semibold px-4">{quantity}</span>
                <button onClick={() => setQuantity(prev => Math.min(prev + 1, product.prod_stock))} className={`bg-gray-200 text-gray-700 rounded-r-lg px-4 py-2 ${quantity >= product.prod_stock ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={quantity >= product.prod_stock}>+</button>
              </div>

              {/* Add to Cart and Buy Now Buttons */}
              <div className="flex justify-between">
                <button 
                  onClick={() => handleCartNow(product, quantity)} 
                  className="border text-green-800 rounded-lg px-6 py-2 text-sm flex items-center"
                >
                  {buttonState ? (
                    <FaCheck className="h-5 w-5 mr-2 text-green-600 animate-pulse" />
                  ) : (
                    <FaShoppingCart className="h-5 w-5 mr-2" />
                  )}
                  {buttonState ? "Added! " : "Add to Cart"}
                </button>

                <button onClick={() => onBuyNow(product, quantity)} className="bg-green-600 text-white rounded-lg text-sm px-6 py-2 flex items-center">
                  <FaShoppingCart className="h-5 w-5 mr-2" />
                  Buy Now
                </button>
              </div>
            </div>
                 {/* Comments and Reviews Section */}
            {/* <div className="mt-auto h-full w-full flex flex-col">
             
              <div className="flex justify-between">
                <button onClick={() => setActiveTab('comments')} className={`w-1/2 py-2 ${activeTab === 'comments' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`} >
                  Comments
                </button>
                <button onClick={() => setActiveTab('reviews')} className={`w-1/2 py-2 ${activeTab === 'reviews' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`} >
                  Reviews
                </button>
              </div> */}

              {/* Content Section */}
              {/* <div className="flex-grow flex flex-col justify-end">
                {activeTab === 'comments' && (
                  <div className="overflow-y-auto max-h-72">
                    <input type="text" value={comment} onChange={handleCommentChange} placeholder="Leave a comment..." className="border p-2 w-full" />
                    <button onClick={handleCommentSubmit} className="mt-2 bg-green-600 text-white rounded-lg px-6 py-2 w-full">Submit Comment</button>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="overflow-y-auto max-h-50">
                    <div className="flex flex-col items-center space-y-2">
                      {[{ label: "Very Satisfied", star: 5 }, { label: "Satisfied", star: 4 }, { label: "Neutral", star: 3 }, { label: "Dissatisfied", star: 2 }, { label: "Very Dissatisfied", star: 1 }].map((item) => (
                        <div key={item.star} className="flex items-center justify-between w-full">
                          <span className="text-xs text-gray-700 w-1/3">{item.label}</span>
                          <div className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} onClick={() => handleRating(i + 1)} className={`cursor-pointer text-xl ${i < item.star ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div> */}
            {/* </div> */}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {isModalOpen && <ModalLogin onClose={() => setIsModalOpen(false)} isOpen={true} />}
    </div>
  );
};

export default ProductModal;
