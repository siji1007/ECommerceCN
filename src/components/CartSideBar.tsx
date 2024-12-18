import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductPlaceholder from '../assets/product_images/kakanin.png'; // Placeholder image
import host from '../host/host.txt?raw';
import NoProductImage from '../assets/OtherImages/product-not-available-icon-vector-21743888-removebg-preview.png'

interface Product {
  vendorId: number;
  vendor_name:string;
  id: number;
  productId: number;
  image: string;
  title: string;
  category: string;
  unitPrice: number;
  DicountedPrice:number;
  quantity: number;
  totalPrice: number;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const serverURl = host.trim();
  const navigate = useNavigate();

  useEffect(() => {

    // Fetch logged-in user ID from local storage
    const userId = localStorage.getItem('Auth');
    if (userId) {
      fetchCartData(parseInt(userId));
    } else {
      alert('User not logged in!');
      navigate('/login'); // Redirect to login if no user ID
    }
  }, []);

  const fetchCartData = async (userId: number) => {
    try {
      const response = await fetch(serverURl + `/api/cart/${userId}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data); // Log the full response to see the structure
        const formattedData = data.cart_items.map((item: any) => ({
          id: item.cart_id,
          productId: item.product_id,
          image: item.product_image || ProductPlaceholder,
          title: item.product_name,
          category: item.product_classification,
          unitPrice: item.unit_price,
          DicountedPrice:item.DicountedPrice,
          quantity: item.product_quantity,
          totalPrice: item.total_price,
          vendorId: item.vendor_id,
          vendor_name: item.vendor_name, // Ensure vendor_name is part of the response
        }));
        setCartItems(formattedData);
      } else {
        alert("Failed to fetch cart data");
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
      alert("An error occurred while fetching cart data.");
    } finally {
      setLoading(false);
    }
  };
  
  
  

  const handleCheckout = () => {
    // Create a list of selected products to display in the alert
    const selectedProductDetails = cartItems
      .filter((product) => selectedProducts.has(product.id))
      .map((product) => ({
        id: product.id,
        productId: product.productId,
        image: product.image,
        name: product.title,
        unitPrice: product.unitPrice,
        subtotal: product.totalPrice,
        quantity: product.quantity,
        vendorId: product.vendorId, // Include vendor ID here
        vendor_name: product.vendor_name,
      }));
  
    if (selectedProductDetails.length > 0) {
      // Build the message to be shown in the alert
      let message = 'Your Order:\n\n';
      selectedProductDetails.forEach((product) => {
        // Include product.id, vendorId, and format the message
        message += `Product ID: ${product.productId} - ${product.name} - ₱ ${product.unitPrice.toFixed(2)} x ${product.quantity} = ₱ ${product.subtotal.toFixed(2)}\n`;
        message += `Vendor ID: ${product.vendorId}\n Vendor Name: ${product.vendor_name}`; 
      });
  
      // Calculate total price of selected products
      const orderTotal = selectedProductDetails.reduce((total, product) => total + product.subtotal, 0);
  
      message += `Order Total: ₱ ${orderTotal.toFixed(2)}`;
  
      // Show alert with the order details
      alert(message);
  
      // Proceed to the next page (for example, the payment page) with product details
      navigate('/shop/buy-payment', {
        state: { selectedProductDetails },
      });
    } else {
      alert('No products selected for checkout.');
    }
  };
  
  const handleSelectProduct = (id: number,productId:number ) => {
    console.log('Selecting product cart with ID:', id, 'product ID ', productId);
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProducts(newSelected);
  };
  

const handleIncreaseQuantity = async (id: number) => {
    // Update the cart items' quantity and total price in the state
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
              totalPrice: (item.quantity + 1) * (item.unitPrice - item.DicountedPrice),  // Update total price
            }
          : item
      )
    );
  
    // Find the updated item from the cart items array
    const updatedItem = cartItems.find(item => item.id === id);
  
    if (updatedItem) {
      const userId = localStorage.getItem('Auth'); // Get the userId from localStorage
  
      if (userId) {
        console.log(`User ID: ${userId}`);  // Log the userId to the console
        console.log(`Cart ID: ${updatedItem.id}`); // Log the cartId to the console
  
        try {
          // Send the updated quantity and total price to the backend using cart_id
          const updateResponse = await fetch(serverURl + '/api/cart/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              us_id: userId,                // User ID from localStorage
              cart_id: updatedItem.id,       // cart_id (not product_id)
              product_quantity: updatedItem.quantity + 1,  // Incremented quantity
              total_price: updatedItem.totalPrice,        // Updated total price
            }),
          });
  
          if (updateResponse.ok) {
            alert('Product quantity and total price updated successfully!');
          } else {
            const errorData = await updateResponse.json();
            alert(`Failed to update product quantity: ${errorData.message || 'Unknown error'}`);
          }
        } catch (error) {
          console.error('Error updating cart quantity:', error);
          alert('An error occurred while updating the product quantity.');
        }
      } else {
        alert('User is not logged in');
      }
    }
  };
  
  
  
  const handleDecreaseQuantity = async (id: number) => {
    // Update the cart items' quantity and total price in the state
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1  // Only allow decreasing if quantity > 1
          ? {
              ...item,
              quantity: item.quantity - 1,  // Decrease quantity by 1
              totalPrice: (item.quantity - 1) * (item.unitPrice - item.DicountedPrice),  // Update total price
            }
          : item
      )
    );
  
    // Find the updated item after state update
    const updatedItem = cartItems.find(item => item.id === id);
  
    if (updatedItem && updatedItem.quantity > 1) {
      const userId = localStorage.getItem('Auth');  // Get userId from localStorage
  
      if (userId) {
        console.log(`User ID: ${userId}`);  // Log userId
        console.log(`Cart ID: ${updatedItem.id}`);  // Log cartId
  
        try {
          // Send updated quantity and total price to the backend using cart_id
          const updateResponse = await fetch(serverURl + '/api/cart/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              us_id: userId,                // User ID from localStorage
              cart_id: updatedItem.id,       // cart_id (not product_id)
              product_quantity: updatedItem.quantity - 1,  // Decreased quantity
              total_price: updatedItem.totalPrice,        // Updated total price
            }),
          });
  
          if (updateResponse.ok) {
            alert('Product quantity and total price updated successfully!');
          } else {
            const errorData = await updateResponse.json();
            alert(`Failed to update product quantity: ${errorData.message || 'Unknown error'}`);
          }
        } catch (error) {
          console.error('Error updating cart quantity:', error);
          alert('An error occurred while updating the product quantity.');
        }
      } else {
        alert('User is not logged in');
      }
    } else {
      alert('Quantity cannot be less than 1');
    }
  };
  

  const handleDeleteItem = async (id: number) => {
    try {
      const response = await fetch(serverURl + `/delete-cart-item/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error deleting item:', errorData.error);
        return;
      }
  
      // Update frontend state after successful deletion
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
      setSelectedProducts((prevSelected) => {
        const newSelected = new Set(prevSelected);
        newSelected.delete(id);
        return newSelected;
      });
  
      console.log('Cart item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };
  



  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(cartItems.map((item) => item.id)));
    }
    setSelectAll(!selectAll);
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, product) => {
      if (selectedProducts.has(product.id)) {
        return total + product.totalPrice;
      }
      return total;
    }, 0);
  };

  if (loading) {
    return <div>Loading your cart...</div>;
  }

  const totalPrice = calculateTotalPrice();

  return (
    <div className="flex flex-col h-auto w-full min-h-screen ">
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center text-gray-500 mt-8">
          <img src={NoProductImage} alt="No product found" className="w-1/2 h-1/2 object-contain" />
          <p>No available products in your cart.</p>
        </div>
      ) : (
        <>
          <h1 className='text-2xl font-semibold p-2'>My Cart</h1>
          <div className="grid grid-cols-5 gap-4 mb-4 w-full m-2">
            <div className="font-semibold">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="mr-2"
              />
              Product
            </div>
            <div className="font-semibold text-center">Unit Price</div>
            <div className="font-semibold text-center">Quantity</div>
            <div className="font-semibold text-center">Total Price</div>
            <div className="font-semibold text-center">Actions</div>
          </div>

          {cartItems.map((product) => (
            <div key={product.id} className="grid grid-cols-5 gap-4 w-full items-center mb-4 border-b pb-4 m-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedProducts.has(product.id)}
                  onChange={() => handleSelectProduct(product.id)}
                  className="mr-2"
                />
                <img src={product.image} alt={product.title} className="w-16 h-16 object-cover" />
                <div className="ml-4">
                  <h1 className="text-lg font-semibold">{product.title}</h1>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
              </div>

              <div className="items-center justify-center flex-col flex">
                <span>{product.unitPrice ? `₱ ${(product.unitPrice - product.DicountedPrice).toFixed(2)}` : 'Price not available'}</span>
               
              </div>

              <div className="flex items-center justify-center">
                <button
                  className="px-2 py-1 bg-gray-200 rounded-l"
                  onClick={() => handleDecreaseQuantity(product.id)}
                >
                  -
                </button>
                <span className="mx-2">{product.quantity}</span>
                <button
                  className="px-2 py-1 bg-gray-200 rounded-r"
                  onClick={() => handleIncreaseQuantity(product.id)}
                >
                  +
                </button>
              </div>

              <div className="flex items-center justify-center">{`₱ ${product.totalPrice.toFixed(2)}`}</div>

              <div className="flex items-center justify-center">
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded"
                  onClick={() => handleDeleteItem(product.id)}
                >
                  Delete
                </button>
              </div>
              <h1>{product.vendor_name}</h1>

            </div>
            
          ))}
        </>
      )}

      {/* bottom price information */}
      {cartItems.length > 0 && (  
        <div className="sticky  bottom-0 left-0 right-0 bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
          <div>
            <span>{selectedProducts.size} Selected Product(s)</span>
          </div>
          <div>
            <span className='text-2xl'>Total: ₱ {totalPrice.toFixed(2)}</span>
          </div>
          <button
            className="bg-green-600 py-2 px-6 rounded text-white"
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
