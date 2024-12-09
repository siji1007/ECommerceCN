import React, { useState, } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import ModalLogin from '../components/Modal_login';
import { useNavigate } from 'react-router-dom';
import host from '../host/host.txt?raw';

interface ProductModalProps {
  isOpen: boolean;
  product: any;
  onClose: () => void;
  onAddToCart: (product: any, quantity: number) => void;
  onBuyNow: (product: any, quantity: number) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, product, onClose, onAddToCart, onBuyNow }) => {
  const [comment, setComment] = useState<string>(''); // State for comment input
  const [quantity, setQuantity] = useState<number>(1); // Quantity state with explicit typing
  const [activeTab, setActiveTab] = useState<string>('comments'); // Active tab state with explicit typing
  const [rating, setRating] = useState<number>(0); // Rating state with explicit typing
  const severURL = host.trim();
  const navigate = useNavigate();

  // State for ModalLogin
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Fix: explicitly typing isModalOpen as boolean

  // Handle comment change
  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  // Handle comment submission
  const handleCommentSubmit = () => {
    console.log('Comment:', comment);
    setComment(''); // Clear the comment field after submission
  };

  // Handle rating
  const handleRating = (star: number) => setRating(star);

  // Handle Buy Now action
  // Handle Buy Now action
const handleBuyNow = async (product: any, quantity: number): Promise<void> => {
  try {
      // Fetch current session from the server
      const response = await fetch(severURL + '/api/get-current-session', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies for authentication
      });

      if (response.ok) {
        const data = await response.json();
        if (data.session_cookie && data.user_id) {
            // Session exists, display alert with product details
            const userId = data.user_id;
            const alertMessage = `
                User ID: ${userId}\n
                Product ID: ${product.prod_id}\n
                Product Name: ${product.prod_name}\n
                Product Classification: ${product.prod_category}\n
                Quantity: ${quantity}\n
                Total Price: ₱ ${(product.prod_price - product.prod_disc_price) * quantity}
            `;
            alert(alertMessage);
    
            // Add the product to the cart in the database via API
            try {
                const addToCartResponse = await fetch(severURL + '/api/cart/add', {
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
                    alert('Product successfully added to the cart! Navigating to your cart...');
                    // Navigate to the cart page
                    navigate(`/shop/cart/id=${userId}`);
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



  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 ">
      <div className="bg-white p-6 rounded-lg w-3/4 max-w-5xl relative overflow-hidden">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600">
          X
        </button>

        <div className="flex h-[70vh] overflow-hidden">
          {/* Left Section: Product Name, Image, and Description */}
          <div className="w-2/3 pr-4 overflow-auto">
            <h2 className="text-xl font-bold mb-4">{product.prod_name}</h2>

            {/* Image container with discount */}
            <div className="relative w-full h-[50vh] mb-4">
              {/* Discount Label */}
              <div className="absolute top-0 left-0 bg-green-500 text-white font-bold py-1 px-2 rounded">
                {`-${((product.prod_disc_price / product.prod_price) * 100).toFixed(2)}%`}
              </div>
              {/* Product Image */}
              <img 
                src={product.prod_image_id} 
                alt={product.prod_name} 
                className="w-full h-full object-cover rounded-md border" 
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="font-semibold mb-2">Description</p>
              <div 
                className="ml-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 cursor-pointer" 
                title="More information about the product"
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
            <p className="text-gray-700">{product.prod_descript}</p>
          </div>


          {/* Right Section: Product Price and Comment Section */}
          <div className="w-1/3 pl-4 flex flex-col justify-between overflow-auto">
            <section className="flex justify-between items-center border-b">
              <section className="flex items-center">
                <img src="src/assets/profiles/Profile.jpg" alt="" className="mr-1 h-5 w-5" />
                <h1 className="font-bold">{product.vendor_name}</h1>
              </section>
              <button className="btn text-xs mr-2 flex items-center">Follow <i className="fas fa-user-plus ml-2"></i></button>
            </section>

          {/* Product Price and Discount */}
            <div className="flex flex-col mb-4 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-green-800 font-bold text-xl">
                  {"₱ " + (product.prod_price - product.prod_disc_price).toFixed(2)}
                </span>
                <p className="text-yellow-500">
                  {'⭐'.repeat(Math.round(2))}
                </p>
              </div>
              <p className="text-gray-600">
                Original Price: 
                <span className="line-through ml-2">{"₱ " + product.prod_price.toFixed(2)}</span>
              </p>
            </div>


            <div className="flex flex-col h-full">
              <p className="text-medium">{"Category: " + product.prod_category}</p>
              <p className="text-medium">{"Stocks: " + product.prod_stock}</p>

              {/* Quantity Selector */}
              <div className="flex items-center justify-center mb-4">
                <button onClick={() => setQuantity(prev => Math.max(prev - 1, 1))} className="bg-gray-200 text-gray-700 rounded-l-lg px-4 py-2">-</button>
                <span className="text-lg font-semibold px-4">{quantity}</span>
                <button onClick={() => setQuantity(prev => Math.min(prev + 1, product.prod_stock))} className={`bg-gray-200 text-gray-700 rounded-r-lg px-4 py-2 ${quantity >= product.prod_stock ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={quantity >= product.prod_stock} > + </button>
              </div>

              {/* Add to Cart and Buy Now Buttons */}
              <div className="flex justify-between">
                <button onClick={() => onAddToCart(product, quantity)} className="border text-green-800 rounded-lg px-6 py-2 text-sm flex items-center">
                  <FaShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </button>

                <button onClick={() => handleBuyNow(product, quantity)} className="bg-green-600 text-white rounded-lg text-sm px-6 py-2 flex items-center">
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
