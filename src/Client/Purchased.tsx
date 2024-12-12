import React, { useEffect, useState } from 'react';
import No_order from '../assets/OtherImages/no_order.png';
import host from '../host/host.txt?raw';

const TransactionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('To Pay');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [userId] = useState<number>(parseInt(localStorage.getItem('Auth') || '0')); // Get user ID from localStorage
  const serverURL = host.trim();

  useEffect(() => {
    fetchTransactions();
  }, [activeTab]);

  const fetchTransactions = async () => {
    const endpoint =
      activeTab === 'To Pay'
        ? serverURL +  `/api/transactions/${userId}/to_pay`
        : serverURL + `/api/transactions/${userId}/to_receive`;
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      } else {
        console.error('Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex border-b mb-4">
        {['To Pay', 'To Receive'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium ${
              activeTab === tab ? 'text-green-800 border-b-2 border-green-800' : 'text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <div>
        <div className="grid grid-cols-4 gap-4 mb-4 w-full">
          <div className="font-semibold">Product</div>
          <div className="font-semibold text-center">Unit Price</div>
          <div className="font-semibold text-center">Quantity</div>
          <div className="font-semibold text-center">Total Price</div>
          
        </div>

        {transactions.length > 0 ? (
            transactions.map((transaction) => (
                <div
                key={transaction.transaction_id}
                className="grid grid-cols-4 gap-4 w-full items-center mb-4 border-b pb-4"
                >
                <div className="flex items-center">
                    <img
                    src={transaction.product_image}
                    alt={transaction.product_name}
                    className="w-16 h-16 object-cover"
                    />
                    <div className="ml-4">
                    <h1 className="text-lg font-semibold">{transaction.product_name}</h1>
                    <p className="text-sm text-gray-500">{transaction.product_category}</p>
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    ₱ {transaction.unit_price.toFixed(2)}
                </div>
                <div className="flex items-center justify-center">{transaction.quantity}</div>
                <div className="flex items-center justify-center">
                    ₱ {transaction.subtotal.toFixed(2)}
                </div>
                </div>

            ))
            ) : (
            <div className="flex flex-col items-center justify-center mt-10">
                <p className="text-lg text-gray-700">No available products at the moment. Start shopping now!</p>
                <img className='h-[50vh] w-[50vh]' src={No_order} alt='No Order'></img>
                <button
                onClick={() => window.location.href = '/shop'} // Update '/shop' with the actual shop page route
                className="mt-4 px-6 py-2 bg-green-800 text-white rounded-lg hover:bg-green-600 transition"
                >
                Shop Now
                </button>
            </div>
            )}

      </div>
      
    </div>
  );
};

export default TransactionsPage;
