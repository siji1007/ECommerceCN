import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import host from "../host/host.txt?raw";
import { BsCashCoin } from "react-icons/bs";
import { MdPaid } from "react-icons/md";

const Payment: React.FC = () => {
  const serverURL = host.trim();
  const location = useLocation();
  const { selectedProductDetails } = location.state || { selectedProductDetails: [] };


  // Calculate total price from selected products
  const orderTotal = selectedProductDetails.reduce((total, product) => total + product.subtotal, 0);

  
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'POD'>('COD'); 
  alert(paymentMethod);
  const handleConfirmOrder = async () => {
    const authData = localStorage.getItem('Auth');  // Get user ID from local storage
  
    // Add the vendorId to the orderData, which will be sent to the API
    const orderData = {
      userId: authData,
      selectedProductDetails: selectedProductDetails.map((product) => ({
        ...product,
        vendorId: product.vendorId,  // Include vendor ID in each product
      })),
      paymentMethod: paymentMethod, // Include payment method in the order data
    };
  
    try {
      // Send the order data to the Flask API
      const response = await axios.post(serverURL + '/api/create_transaction', orderData);
  
      if (response.status === 201) {
        // Show the confirmation message in an alert
        let message = 'Your Order Details:\n\n';
        selectedProductDetails.forEach((product) => {
          message += `${product.name} - ₱${product.unitPrice.toFixed(2)} x ${product.quantity} = ₱${product.subtotal.toFixed(2)}\n`;
          message += `Vendor ID: ${product.vendorId}\n`; // Display Vendor ID in the alert
        });
  
        message += `\nUserId: ${authData} \nTotal Payment: ₱${orderTotal.toFixed(2)}\nPayment Method: ${paymentMethod}`;
        alert(message);
      }
    } catch (error) {
      console.error("Error while placing order: ", error);
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
          <p className="text-sm">User Name: John Doe</p>
          <p className="text-sm">Email: johndoe@example.com</p>
          <p className="text-sm">Postal Code: 12345</p>
          <p className="text-sm">Barangay: Sample Barangay</p>
          <p className="text-sm">City: Sample City</p>
          <p className="text-sm">Province: Sample Province</p>
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
