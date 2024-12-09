import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductPlaceholder from '../assets/product_images/kakanin.png'; // Placeholder image
import host from '../host/host.txt?raw';
import NoProductImage from '../assets/OtherImages/product-not-available-icon-vector-21743888-removebg-preview.png'

interface Product {
  id: number;
  image: string;
  title: string;
  category: string;
  unitPrice: number;
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
        // Transform API response into Product format
        const formattedData = data.cart_items.map((item: any) => ({
          id: item.cart_id,
          image: item.product_image || ProductPlaceholder,
          title: item.product_name,
          category: item.product_classification,
          unitPrice: item.unit_price,
          quantity: item.product_quantity,
          totalPrice: item.total_price,
        }));
        setCartItems(formattedData);
        
      } else {
        alert('Failed to fetch cart data');
      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
      alert('An error occurred while fetching cart data.');
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
        image: product.image,
        name: product.title,
        unitPrice: product.unitPrice,
        subtotal: product.totalPrice,
        quantity: product.quantity,
      }));
  
    if (selectedProductDetails.length > 0) {
      // Build the message to be shown in the alert
      let message = 'Your Order:\n\n';
      selectedProductDetails.forEach((product) => {
        // Include product.id and format the message
        message += `Product ID: ${product.id} - ${product.name} - ₱ ${product.unitPrice.toFixed(2)} x ${product.quantity} = ₱ ${product.subtotal.toFixed(2)}\n`;
      });
  
      // Calculate total price of selected products
      const orderTotal = selectedProductDetails.reduce((total, product) => total + product.subtotal, 0);
  
      message += `\nOrder Total: ₱ ${orderTotal.toFixed(2)}`;
  
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
  

  const handleIncreaseQuantity = (id: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
              totalPrice: (item.quantity + 1) * item.unitPrice,
            }
          : item
      )
    );
  };

  const handleDecreaseQuantity = (id: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? {
              ...item,
              quantity: item.quantity - 1,
              totalPrice: (item.quantity - 1) * item.unitPrice,
            }
          : item
      )
    );
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
  

  const handleSelectProduct = (id: number) => {
    console.log('Selecting product with ID:', id);
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProducts(newSelected);
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
    <div className="flex flex-col h-auto w-full min-h-screen pt-8">
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

              <div className="flex items-center justify-center">
                {product.unitPrice ? `₱ ${product.unitPrice.toFixed(2)}` : 'Price not available'}
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
              <h1>Show vendor name here</h1>
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
