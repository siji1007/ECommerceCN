import React, { useEffect, useState } from 'react';
import axios from 'axios';
import host from '../../host/host.txt?raw';
import hostreact from '../../host/ReactHost.txt?raw';

const NewOrders: React.FC = () => {
    const [venId, setVenId] = useState<number | null>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [userDetails, setUserDetails] = useState<{ [key: string]: { first_name: string, last_name: string } }>({});
    const [productDetails, setProductDetails] = useState<{ [key: string]: { prod_name: string, prod_category: string, prod_image_id: string } }>({});
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const userId = localStorage.getItem('Auth');
        
        if (userId) {
            axios.get(`${host}/get_vendor_by_user_id?user_id=${userId}`)
                .then((response) => {
                    const venId = response.data.ven_id;
                    setVenId(venId);

                    return axios.get(`${host}/get_transactions_by_vendor?ven_id=${venId}`);
                })
                .then((response) => {
                    const transactions = response.data;
                    setTransactions(transactions);

                    // Fetch user and product details for all transactions
                    const userPromises = transactions.map(transaction => 
                        axios.get(`${host}/get_user_by_id?u_id=${transaction.u_ID}`)
                            .then((res) => ({ u_ID: transaction.u_ID, ...res.data }))
                    );

                    const productPromises = transactions.map(transaction => 
                        axios.get(`${host}/get_product_by_id?p_id=${transaction.p_ID}`)
                            .then((res) => ({ p_ID: transaction.p_ID, ...res.data }))
                    );

                    // Resolve all promises
                    Promise.all(userPromises).then(users => {
                        const userMap = users.reduce((acc, user) => {
                            acc[user.u_ID] = { first_name: user.first_name, last_name: user.last_name };
                            return acc;
                        }, {});
                        setUserDetails(userMap);
                    });

                    Promise.all(productPromises).then(products => {
                        const productMap = products.reduce((acc, product) => {
                            acc[product.p_ID] = { prod_name: product.prod_name, prod_category: product.prod_category, prod_image_id: product.prod_image_id };
                            return acc;
                        }, {});
                        setProductDetails(productMap);
                    });
                })
                .catch((err) => {
                    setError('Error occurred while fetching data');
                    console.error(err);
                });
        } else {
            setError('User ID not found in localStorage');
        }
    }, []);

    const handleConfirm = (transactionId: number) => {
        // Make an API call to update the transaction status
        axios
            .post(`${host}/update_transaction_status`, {
                transaction_id: transactionId,
                status: 'processed', // New status
            })
            .then(() => {
                alert(`Transaction ID ${transactionId} marked as processed`);
                
                // Optionally, update the UI by removing the processed transaction or changing its state
                setTransactions((prevTransactions) =>
                    prevTransactions.map((transaction) =>
                        transaction.transaction_id === transactionId
                            ? { ...transaction, status: 'processed' }
                            : transaction
                    )
                );
            })
            .catch((err) => {
                console.error('Error updating transaction status:', err);
                alert(`Failed to update status for Transaction ID ${transactionId}`);
            });
    };
    

    const handleCancel = (transactionId: number) => {
        alert(`Cancel clicked for Transaction ID: ${transactionId}`);
        // Additional logic for canceling the transaction can go here
    };

    return (
        <div>
            {error && <p>{error}</p>}
            <h1 className='text-2xl mb-2 font-semibold'>Request Order </h1>
            <ul>
                {transactions.map((transaction) => (
                    <li key={transaction.transaction_id} className="flex justify-between border mb-2 bg-gray-200 p-4 rounded shadow-lg shadow-green-400">
                        {/* Product Order Section */}
                        <div className="flex">
                            <div className="w-20 h-20 bg-gray-300 flex items-center justify-center">
                                {/* Product Image */}
                                {productDetails && productDetails[transaction.p_ID]?.prod_image_id ? (
                                    <img
                                        src={`${hostreact}${productDetails[transaction.p_ID]?.prod_image_id}`}
                                        alt={productDetails[transaction.p_ID]?.prod_name}
                                        className="object-cover w-full h-full rounded"
                                    />
                                ) : (
                                    <span className="text-sm text-gray-600">Loading...</span>
                                )}
                            </div>
                            <div className="ml-4">
                                <p className="font-bold">
                                    Product Name: {productDetails[transaction.p_ID]?.prod_name || 'Loading...'}
                                </p>
                                <p>
                                    Category: {productDetails[transaction.p_ID]?.prod_category || 'Loading...'}
                                </p>
                                <p>Price: ${transaction.unit_price}</p>
                                <p>Quantity: {transaction.quantity}</p>
                            </div>
                        </div>

                        {/* Customer Information Section */}
                        <div className="flex flex-col justify-center">
                            <p className="font-bold">Customer Information</p>
                            <p>
                                Full Name: {userDetails[transaction.u_ID]
                                    ? `${userDetails[transaction.u_ID].first_name} ${userDetails[transaction.u_ID].last_name}`
                                    : 'Loading...'}
                            </p>
                        </div>

                        {/* Confirm and Cancel Buttons */}
                        <div className="flex flex-col items-end justify-between">
                            <p className="font-bold">Subtotal: ${transaction.subtotal}</p>
                            <div className="mt-4">
                                <button
                                    className="bg-green-800 text-white px-4 py-2 rounded mr-2"
                                    onClick={() => handleConfirm(transaction.transaction_id)}
                                >
                                    Confirm
                                </button>
                                <button
                                    className="bg-gray-400 text-white px-4 py-2 rounded"
                                    onClick={() => handleCancel(transaction.transaction_id)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NewOrders;