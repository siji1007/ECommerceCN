import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import host from "../host/host.txt?raw";
import { BsCashCoin } from "react-icons/bs";
import { MdPaid } from "react-icons/md";
import { useEffect } from 'react';


const Payment: React.FC = () => {
  const serverURL = host.trim();
  const location = useLocation();
  const { selectedProductDetails } = location.state || { selectedProductDetails: [] };
  const [userInfo, setUserInfo] = useState<any>(null); // Store user data here
  const [loading, setLoading] = useState<boolean>(true);
  const [userAddress, setUserAddress] = useState<any>(null);
  const navigate = useNavigate();

  // Calculate total price from selected products
  const orderTotal = selectedProductDetails.reduce((total, product) => total + product.subtotal, 0);

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'POD'>('COD'); 
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authData = localStorage.getItem('Auth');
        console.log("Auth Data: ", authData); // Log to see if it's available
        if (authData) {
          const response = await axios.get(`${serverURL}/api/users`);
          console.log("API Response: ", response); // Log the API response
          const user = response.data.find((user: any) => user.id === parseInt(authData)); // Parse authData to match type
          
          if (user) {
            setUserInfo(user); // Set user data in state

            // Fetch address data for the user
            const addressResponse = await axios.get(`${serverURL}/api/addresses/${user.id}`);
            if (addressResponse.data.exists) {
              setUserAddress(addressResponse.data.address); // Set user address in state
            } else {
              console.error("Address not found for user!");
            }
          } else {
            console.error("User not found!");
          }
        } else {
          console.log("No Auth data found.");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [serverURL]);

  if (loading) {
    return <div>Loading user data...</div>; // Show a loading message while user data is being fetched
  }

  if (!userInfo) {
    return <div>User not found</div>; // Show message if no user is found
  }

  const handleConfirmOrder = async () => {
    const authData = localStorage.getItem('Auth');
    const orderData = {
      userId: authData,
      selectedProductDetails: selectedProductDetails.map((product) => ({
        ...product,
        vendorId: product.vendorId,
      })),
      paymentMethod: paymentMethod,
    };
  
    try {
      if (paymentMethod === 'POD') {
        // Ensure amount is passed as a positive integer in cents
        const amountInCents = orderTotal * 100;  // Convert total to cents
  
        const response = await axios.post(`${serverURL}/api/create_gcash_payment`, {
          amount: amountInCents,  // This should be an integer
        });
  
        if (response.data.success) {
          const paymentUrl = response.data.paymentUrl;
  
          // Open the payment URL in a new tab
          window.open(paymentUrl, '_blank');  // This opens the payment link in a new tab
  
          // Create a transaction in your backend with status as POD (Pay on Delivery)
          await axios.post(`${serverURL}/api/create_transaction`, {
            ...orderData,
            status: 'POD',
          });

          navigate(`/clientprofile/id=${authData}/purchased`);
        } else {
          alert("Error with GCash payment. Please try again.");
        }
      } else {
        const orderResponse = await axios.post(`${serverURL}/api/create_transaction`, orderData);
        if (orderResponse.status === 201) {
          alert("Your Order has been placed successfully.");
          navigate(`/clientprofile/id=${authData}/purchased`);
        }
      }
    } catch (error) {
      console.error("Error processing order: ", error);
      alert("There was an issue processing your order. Please try again.");
    }
  };
  
  
  
  

  return (
    <div className="flex flex-col h-auto pt-16 min-h-screen">
      <h1 className="text-3xl font-semibold mb-8">Check Out</h1>

        {/* Address Section */}
        <h2 className="text-xl font-semibold">Shipping Address</h2>
      <div className="flex justify-between items-center mb-8 mx-4 border-b pb-4">
        <div className="flex flex-row gap-2 font-semibold">
          <p className="text-sm">User Name: {userInfo.fullName}</p>
          <p className="text-sm">Email: {userInfo.email}</p>
          {/* Display address data here */}
          {userAddress ? (
            <>
              <p className="text-sm">Province: {userAddress.province}</p>
              <p className="text-sm">City: {userAddress.city}</p>
              <p className="text-sm">Barangay: {userAddress.barangay}</p>
              <p className="text-sm">Postal Code: {userAddress.postal_code}</p>
            </>
          ) : (
            <p className="text-sm">No address found</p>
          )}
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Change</button>
      </div>

      {/* Payment Method Section */}
      <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
      <div className="flex justify-center gap-4 space-around items-center mb-8 mx-4 border-b pb-4">
        <div
          className={`card ${paymentMethod === 'COD' ? 'border-green-800' : 'border-gray-300'} p-4 cursor-pointer border rounded-lg`}
          onClick={() => {
            setPaymentMethod('COD');
          }}
        >
          <div className="flex flex-col items-center">
            <BsCashCoin className='h-10 w-10' />
            <h3 className="text-lg font-semibold">Cash On Delivery (COD)</h3>
          </div>
        </div>

        <div
          className={`card ${paymentMethod === 'POD' ? 'border-green-800' : 'border-gray-300'} p-4 cursor-pointer  border rounded-lg`}
          onClick={() => {
            setPaymentMethod('POD');
          }}
        >
          <div className="flex flex-col items-center">
            <MdPaid className='h-10 w-10' />
            <h3 className="text-lg font-semibold">Pay On Delivery (POD)</h3>
          </div>
        </div>
      </div>

      {/* Product Ordered Section */}
      <div className="mb-8 mx-4">
        <h2 className="text-xl font-semibold mb-4">Product Ordered</h2>

        <div className="grid grid-cols-5 gap-4 mb-4 w-full m-2">
          <div className="font-semibold">Product</div>
          <div className="font-semibold text-center">Unit Price</div>
          <div className="font-semibold text-center">Quantity</div>
          <div className="font-semibold text-center">Total Price</div>
        </div>

        {/* Display each product from selectedProductDetails */}
        {selectedProductDetails.map((product, index) => (
          <div key={index} className="grid grid-cols-5 gap-4 w-full items-center mb-4 border-b pb-4 m-2">
            <div className="flex items-center">
              <img src={product.image || "default_product_image.jpg"} alt={product.name} className="w-16 h-16 object-cover" />
              <div className="ml-4">
                <h1 className="text-lg font-semibold">{product.name}</h1>
                <p className="text-sm text-gray-500">{product.category}</p>
              </div>
            </div>
            <div className="flex items-center justify-center">₱ {product.unitPrice.toFixed(2)}</div>
            <div className="flex items-center justify-center">{product.quantity}</div>
            <div className="flex items-center justify-center">₱ {product.subtotal.toFixed(2)}</div>
          </div>
        ))}
      </div>

      {/* Total Payment */}
      <div className="flex justify-between items-center mx-4 mb-8">
        <h1 className="text-xl font-semibold">Total Payment: ₱ {orderTotal.toFixed(2)}</h1>
      </div>

      {/* Add the Order button here */}
      <div className="flex justify-between items-center mx-4">
        <button className="bg-green-600 py-2 px-6 rounded text-white" onClick={handleConfirmOrder}>
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default Payment;
