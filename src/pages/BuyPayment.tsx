import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import host from "../host/host.txt?raw";

const Payment: React.FC = () => {
  // Get the passed data from the location state

  
  const serverURL = host.trim();
  const location = useLocation();
  const { selectedProductDetails } = location.state || { selectedProductDetails: [] };

  // Calculate total price from selected products
  const orderTotal = selectedProductDetails.reduce((total, product) => total + product.subtotal, 0);

  const handleConfirmOrder = async () => {
    const authData = localStorage.getItem('Auth');  // Get user ID from local storage
   
  
    const orderTotal = selectedProductDetails.reduce((total, product) => total + product.subtotal, 0);
  
    const orderData = {
      userId: authData,
      selectedProductDetails: selectedProductDetails,
    };
  
    try {
      // Send the order data to the Flask API
      const response = await axios.post(serverURL + '/api/create_transaction', orderData);
      
      if (response.status === 201) {
        // Show the confirmation message in an alert
        let message = 'Your Order Details:\n\n';
        selectedProductDetails.forEach((product) => {
          message += `${product.name} - ₱${product.unitPrice.toFixed(2)} x ${product.quantity} = ₱${product.subtotal.toFixed(2)}\n`;
        });
  
        message += `\nUserId: ${authData} \nTotal Payment: ₱${orderTotal.toFixed(2)}`;
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
        <div className="flex flex-col">
          <p className="text-sm">User Name: John Doe</p>
          <p className="text-sm">Email: johndoe@example.com</p>
          <p className="text-sm">Postal Code: 12345</p>
          <p className="text-sm">Barangay: Sample Barangay</p>
          <p className="text-sm">City: Sample City</p>
          <p className="text-sm">Province: Sample Province</p>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Change</button>
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
        {selectedProductDetails.map((product: { image: any; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined; category: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; unitPrice: number; quantity: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; subtotal: number; }, index: Key | null | undefined) => (
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
