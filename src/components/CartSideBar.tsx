import React, { useState } from 'react';
import Product from '../assets/product_images/kakanin.png';
const CartPage: React.FC = () => {
    const [cartItems, setCartItems] = useState<Product[]>([
      {
        id: 1,
        image: Product,
        title: 'Product 1',
        category: 'food',
        unitPrice: 500,
        quantity: 1,
        totalPrice: 500,
      },
      {
        id: 2,
        image: Product,
        title: 'Product 2',
        category: 'food',
        unitPrice: 300,
        quantity: 2,
        totalPrice: 600,
      },
    ]);
  
    const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set()); // Track selected products
    const [selectAll, setSelectAll] = useState(false); // Track if "select all" is checked
    const selectedProductsCount = selectedProducts.size; // Updated to use selectedProducts set
  
    const handleCheckout = () => {
      alert("Proceed to checkout");
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
  
    const handleDeleteItem = (id: number) => {
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
      setSelectedProducts((prevSelected) => {
        const newSelected = new Set(prevSelected);
        newSelected.delete(id);
        return newSelected;
      });
    };
  
    const handleSelectProduct = (id: number) => {
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
  
    return (
      <div className="flex flex-col h-auto pt-16 min-h-screen px-4">
        <h1 className="text-xl font-bold mb-6">Customer Cart</h1>
  
        <div className="grid grid-cols-5 gap-4 mb-4 w-full">
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
          <div key={product.id} className="grid grid-cols-5 gap-4 w-full items-center mb-4 border-b pb-4">
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
  
            <div className="flex items-center justify-center">{`₱ ${product.unitPrice.toFixed(2)}`}</div>
  
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
          </div>
        ))}
  

        {/* checkout information */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
          <div>
            <span>{selectedProductsCount} Selected Product(s)</span>
          </div>
          <button
            className="bg-green-600 py-2 px-6 rounded text-white"
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      </div>
    );
  };
  
  export default CartPage;
  
