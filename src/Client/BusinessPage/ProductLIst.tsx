import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import serverURL from '../../host/host.txt?raw';
import ReactHost from '../../host/ReactHost.txt?raw';
import { Line, Bar } from 'react-chartjs-2';
import ProductModal from './productDetails';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

interface Product {
  prod_id: number;
  vendor_id: number;
  vendor_name: string;
  prod_name: string;
  prod_category: string;
  prod_descript: string;
  prod_price: number;
  prod_disc_price: number;
  prod_status: string;
  prod_image_id: string;
}

interface FetchProductsResponse {
  products: Product[];
}

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [vendorStatus, setVendorStatus] = useState<string>(''); // Store vendor status
  const hosting = serverURL.trim();
  const reactHost = ReactHost.trim();
  const [modalProduct, setModalProduct] = useState<Product | null>(null); // State to store the selected product
  const [transactions, setTransactions] = useState<any[]>([]); // Store fetched transactions
  const [weeklySubtotals, setWeeklySubtotals] = useState<any[]>([]); // Store weekly subtotals
  const [vendorId, setVendorId] = useState(null); // State to store vendorId
  const [filterPeriod, setFilterPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly'); // State for time filter
  const [error, setError] = useState(null);

  const id = localStorage.getItem('Auth');

  // Handle filter change (daily, weekly, monthly)
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterPeriod(e.target.value as 'daily' | 'weekly' | 'monthly');
};

// Fetch vendor data and transactions
useEffect(() => {
  const fetchVendorData = async () => {
    try {
      const vendorStatusResponse = await fetch(`${hosting}/checkVendorStatus/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const vendorStatusResult = await vendorStatusResponse.json();

      if (vendorStatusResponse.ok) {
        const vendorStatus = vendorStatusResult.message;
        const vendorId = vendorStatusResult.vendor_id;

        setVendorStatus(vendorStatus);
        setVendorId(vendorId);

        if (vendorId !== null) {
          const productsResponse = await axios.get<FetchProductsResponse>(`${hosting}/FetchProducts/${vendorId}`);
          const validProducts = productsResponse.data.products.filter(
            (product: Product) => product.prod_name && product.prod_category
          );
          setProducts(validProducts);
        }

        // Fetch transactions with product names
        const transactionsResponse = await axios.get(`${hosting}/fetchTransactions/${vendorId}`);
        const filteredTransactions = transactionsResponse.data.filter(
          (transaction: any) => transaction.status === 'processed'
        );

        // Optionally, if product name is not in the response, match product manually by prod_id
        const transactionsWithProductNames = filteredTransactions.map((transaction: any) => {
          const product = products.find((p) => p.prod_id === transaction.p_ID);
          return { ...transaction, prod_name: product ? product.prod_name : 'Unknown' };
        });

        setTransactions(transactionsWithProductNames);

        // Calculate weekly subtotals after fetching transactions
        calculateWeeklySubtotals(transactionsWithProductNames);

        showProcessedTotalAlert(transactionsWithProductNames);
      }
    } catch (error) {
      console.error('Error fetching vendor data or transactions:', error);
    }
  };

  fetchVendorData();
}, [hosting, id, products]);




const showProcessedTotalAlert = (transactions: any[]) => {
  const transactionTotals: any = {};

  // Sum subtotals for each unique transaction ID
  transactions.forEach((transaction) => {
    const transactionId = transaction.transaction_id;
    const subtotal = transaction.subtotal;

    // If this transaction ID is already in the totals object, add the subtotal
    if (transactionTotals[transactionId]) {
      transactionTotals[transactionId].subtotal += subtotal;
    } else {
      // Initialize the transaction total with the current subtotal and date
      const transactionDate = new Date(transaction.created_at);
      transactionTotals[transactionId] = {
        subtotal: subtotal,
        date: transactionDate,
        productName: transaction.prod_name,  // Add product name here
      };
    }
  });

  // Display an alert for each unique transaction ID with its total processed subtotal, the date, and product name
  Object.keys(transactionTotals).forEach((transactionId) => {
    const total = transactionTotals[transactionId];
    const formattedDate = total.date.toLocaleDateString(); // Format the date
    // Show alert including the product name
    // alert(
    //   `Transaction ID: ${transactionId} - Product: ${total.productName} - Total Processed Subtotal: ${total.subtotal} - Date: ${formattedDate}`
    // );
  });
};

// Calculate weekly subtotals for the last 7 days (starting from Monday)
const calculateWeeklySubtotals = (transactions: any[]) => {
  const weekData: number[] = new Array(7).fill(0); // Initialize sales data for each day (set to 0 initially)
  const today = new Date();
  const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
  
  // Set the start of the week (Monday, December 9, 2024)
  const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1); // This will give the previous Monday
  
  // Ensure that we are calculating for the week starting December 9th
  const weekStart = new Date('2024-12-09'); // Hardcoded to start on Monday, December 9th, 2024
  const weekEnd = new Date('2024-12-14'); // End on Sunday, December 14th, 2024

  // Loop through the transactions and sum up the subtotals for the past 7 days (Monday-Sunday)
  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.created_at);

    // Check if the transaction falls within the week of December 9-14, 2024
    if (transactionDate >= weekStart && transactionDate <= weekEnd) {
      const daysAgo = Math.floor((transactionDate.getTime() - weekStart.getTime()) / oneDay); // Days from Monday

      if (daysAgo >= 0 && daysAgo < 7) {
        weekData[daysAgo] += transaction.subtotal; // Add subtotal to the corresponding day
      }
    }
  });

  // Store the weekly data to state
  setWeeklySubtotals(weekData);
};

// Prepare data for the chart
const LinechartData = {
  labels: weeklySubtotals.length
    ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    : [],
  datasets: [
    {
      label: 'Sales (Processed)',
      data: weeklySubtotals,
      fill: false,
      borderColor: '#4CAF50',
      tension: 0.1,
    },
  ],
};


// Calculate the top-selling products by quantity
const calculateTopProducts = (transactions: any[]) => {
  const productQuantities: { [prod_id: number]: number } = {}; // Store quantities sold by product

  // Loop through transactions to count the quantity sold for each product
  transactions.forEach((transaction) => {
    const transactionItems = transaction.items || []; // Assuming transaction has an array of items

    transactionItems.forEach((item: any) => {
      const productId = item.prod_id;
      const quantity = item.quantity;

      // Add quantity to the corresponding product
      if (productQuantities[productId]) {
        productQuantities[productId] += quantity;
      } else {
        productQuantities[productId] = quantity;
      }
    });
  });

  // Create an array of product quantities sorted by quantity sold (descending)
  const sortedProducts = Object.keys(productQuantities)
    .map((prod_id) => ({
      prod_id: parseInt(prod_id),
      quantity: productQuantities[prod_id],
    }))
    .sort((a, b) => b.quantity - a.quantity); // Sort by quantity in descending order

  return sortedProducts;
};

// Fetch and prepare data for the bar chart (top products)
const prepareTopProductsChartData = () => {
  const topProducts = calculateTopProducts(transactions);
  const topProductIds = topProducts.slice(0, 5); // Get the top 5 products

  const labels = topProductIds.map((product) => {
    const productData = products.find((p) => p.prod_id === product.prod_id);
    return productData ? productData.prod_name : 'Unknown Product';
  });

  const data = topProductIds.map((product) => product.quantity);

  return {
    labels,
    datasets: [
      {
        label: 'Top Products by Quantity Sold',
        data,
        backgroundColor: '#4CAF50',
        borderColor: '#388E3C',
        borderWidth: 1,
      },
    ],
  };
};

// Use useEffect to update the top products chart when transactions change
useEffect(() => {
  const topProductsChartData = prepareTopProductsChartData();

  // You can use the topProductsChartData for your Bar chart
  // For example, setting state or directly passing it to your Bar component
}, [transactions, products]);




  

  const categories = [
    'All',
    ...Array.from(new Set(products.map((product) => product.prod_category))),
  ];

  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === 'All' || product.prod_category === selectedCategory) &&
      product.prod_name?.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="p-4">
      {/* Filter and Search */}
      <div className="flex items-center mb-4 justify-between">
        <div className="flex items-center">
          <select
            className="border rounded-md px-2 py-1 mr-4"
            onChange={(e) => setSelectedCategory(e.target.value)}
            value={selectedCategory}
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="border rounded-md px-2 py-1 flex-grow"
            placeholder="Search products..."
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
          />
        </div>

        {/* Filter Dropdown for Daily, Weekly, Monthly */}
        <select
          className="border rounded-md px-2 py-1"
          onChange={handleFilterChange}
          value={filterPeriod}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div className="flex flex-col lg:flex-row w-full overflow-x-auto mb-2 gap-2 items-center justify-center">
        {/* Line Chart for Weekly Sales */}
        <div className="mb-6 w-full lg:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Weekly Sales</h2>
          <Line data={LinechartData} />
        </div>

        {/* Bar Chart for Top Products Sales */}
        <div className="mb-6 w-full lg:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Top Products by Sales</h2>
          <Bar data={prepareTopProductsChartData()} />
        </div>
      </div>

      {/* Product List */}
      <div className="flex flex-wrap gap-4">
        {filteredProducts.length === 0 ? (
          <h1 className="text-center w-full text-xl font-bold text-gray-600">
            Your inventory is empty, try adding products.
          </h1>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.prod_id}
              className="w-48 bg-white border rounded-lg shadow-md p-2 cursor-pointer"
              onClick={() => setModalProduct(product)}
            >
              <img
                src={reactHost + product.prod_image_id}
                alt={product.prod_name}
                className="w-full h-32 object-cover rounded-md mb-2"
              />
              <h2 className="text-lg font-semibold">{product.prod_name}</h2>
              <div className="flex justify-between items-center mt-2">
                <span className="text-green-600 font-bold">{product.prod_price}</span>
              </div>
            </div>
          ))
        )}

<div className='flex w-full justify-end space-x-2'>
      <Link to={`/clientprofile/id=${id}`}>
        <button className='mt-2 p-10 py-2  text-black rounded-md '>
            Back
        </button>
      </Link>
        <Link to={`/clientprofile/id=${id}/products-add`}>
        <button className='mt-2 p-10 py-2 bg-green-900 text-white rounded-md hover:bg-blue-600'>
            Add
        </button>
      </Link>
        
      </div>

      </div>

      {/* Modal */}
      {modalProduct && (
        <ProductModal product={modalProduct} onClose={() => setModalProduct(null)} />
      )}
    </div>
  );
};

export default ProductList;
