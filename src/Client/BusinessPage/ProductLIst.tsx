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
  prod_stock:number;
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
  const [vendorStatus, setVendorStatus] = useState<string>(''); 
  const hosting = serverURL.trim();
  const reactHost = ReactHost.trim();
  const [modalProduct, setModalProduct] = useState<Product | null>(null); 
  const [transactions, setTransactions] = useState<any[]>([]); 
  const [weeklySubtotals, setWeeklySubtotals] = useState<any[]>([]); 
  const [vendorId, setVendorId] = useState(null); 
  const [filterPeriod, setFilterPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly'); 
  const [transactionTotals, setTransactionTotals] = useState<any>({});

  const [error, setError] = useState(null);

  const id = localStorage.getItem('Auth');


  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterPeriod(e.target.value as 'daily' | 'weekly' | 'monthly');
};


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

        // Fetch products first
        if (vendorId !== null) {
          const productsResponse = await axios.get<FetchProductsResponse>(`${hosting}/FetchProducts/${vendorId}`);
          const validProducts = productsResponse.data.products.filter(
            (product: Product) => product.prod_name && product.prod_category
          );
          setProducts(validProducts);
        }

     
        const transactionsResponse = await axios.get(`${hosting}/fetchTransactions/${vendorId}`);
        const filteredTransactions = transactionsResponse.data.filter(
          (transaction: any) => transaction.status === 'processed'
        );

      
        const transactionsWithProductNames = filteredTransactions.map((transaction: any) => {
          // Find the matching product by p_ID (prod_id)
          const product = products.find((p) => p.prod_id === transaction.p_ID);
          return { 
            ...transaction, 
            prod_name: product ? product.prod_name : 'Unknown' 
          };
        });

        setTransactions(transactionsWithProductNames);  

      
        calculateWeeklySubtotals(transactionsWithProductNames);

    
        showProcessedTotalAlert(transactionsWithProductNames);
      }
    } catch (error) {
      console.error('Error fetching vendor data or transactions:', error);
    }
  };

  fetchVendorData();
}, [hosting, id, products]);  





const calculateWeeklySubtotals = (transactions: any[]) => {
  const weekData: number[] = new Array(7).fill(0); 
  const today = new Date();
  const oneDay = 24 * 60 * 60 * 1000; 
  

  const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1); 
  

  const weekStart = new Date('2024-12-09'); 
  const weekEnd = new Date('2024-12-15'); 


  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.created_at);

    if (transactionDate >= startOfWeek && transactionDate <= weekEnd) {
      const daysAgo = Math.floor((transactionDate.getTime() - weekStart.getTime()) / oneDay); 

      if (daysAgo >= 0 && daysAgo < 7) {
        weekData[daysAgo] += transaction.subtotal; 
      }
    }
  });


  setWeeklySubtotals(weekData);
};


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



const calculateTopProducts = (transactions: any[]) => {
  const productQuantities: { [prod_id: number]: number } = {};
  transactions.forEach((transaction) => {
    const transactionItems = transaction.items || []; 
    transactionItems.forEach((item: any) => {
      const productId = item.prod_id;
      const quantity = item.quantity;
      if (productQuantities[productId]) {
        productQuantities[productId] += quantity;
      } else {
        productQuantities[productId] = quantity;
      }
    });
  });


  const sortedProducts = Object.keys(productQuantities)
    .map((prod_id) => ({
      prod_id: parseInt(prod_id),
      quantity: productQuantities[prod_id],
    }))
    .sort((a, b) => b.quantity - a.quantity); 

  return sortedProducts;
};



const showProcessedTotalAlert = (transactions: any[]) => {
  const transactionTotals: any = {};


  transactions.forEach((transaction) => {
    const transactionId = transaction.transaction_id;
    const subtotal = transaction.subtotal;

    if (transactionTotals[transactionId]) {
      transactionTotals[transactionId].subtotal += subtotal;
    } else {
  
      const transactionDate = new Date(transaction.created_at);
      transactionTotals[transactionId] = {
        subtotal: subtotal,
        date: transactionDate,
        productName: transaction.prod_name, 
        quantity: transaction.quantity, 
      };
    }
  });


  setTransactionTotals(transactionTotals);


  Object.keys(transactionTotals).forEach((transactionId) => {
    const total = transactionTotals[transactionId];
    const formattedDate = total.date.toLocaleDateString(); 
    
  });
};



const prepareTopProductsChartData = () => {

  const topProducts = calculateTopProducts(transactions);


  const aggregatedProductData: { [prod_name: string]: { quantity: number; prod_id: number } } = {};

  transactions.forEach((transaction) => {
    const productName = transaction.prod_name;
    const quantity = transaction.quantity;

 
    if (aggregatedProductData[productName]) {
      aggregatedProductData[productName].quantity += quantity;
    } else {
     
      aggregatedProductData[productName] = {
        quantity: quantity,
        prod_id: transaction.prod_id, 
      };
    }
  });


  const aggregatedProducts = Object.keys(aggregatedProductData)
    .map((prod_name) => ({
      prod_name: prod_name,
      quantity: aggregatedProductData[prod_name].quantity,
      prod_id: aggregatedProductData[prod_name].prod_id,
    }))
    .sort((a, b) => b.quantity - a.quantity); 

 
  const topProductIds = aggregatedProducts.slice(0, 5); 

 
  const labels = topProductIds.map((product) => product.prod_name);
  const data = topProductIds.map((product) => product.quantity);


  console.log('Labels for Chart:', labels);
  console.log('Data for Chart:', data);


  return {
    labels: labels,
    datasets: [
      {
        label: 'Top Products by Quantity Sold',
        data: data,
        backgroundColor: '#4CAF50',
        borderColor: '#388E3C',
        borderWidth: 1,
      },
    ],
  };
};




  

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
      <div className="flex items-center pb-10 justify-between">
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

      <div className="flex flex-col lg:flex-row w-full overflow-x-auto overflow-y-hidden mb-2 gap-2 items-center justify-center">
        {/* Line Chart for Weekly Sales */}
        <div className="mb-6 w-full lg:w-1/2 border p-5 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Weekly Sales</h2>
          <Line data={LinechartData} />
        </div>

        {/* Bar Chart for Top Products Sales */}
        <div className="mb-6 w-full lg:w-1/2 border p-5 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Top Products by Sales</h2>
          <Bar data={prepareTopProductsChartData()} />
        </div>
      </div>

      {/* Product List */}

      <h1 className='ml-2 text-lg font-semibold'>My product list</h1>
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
                <span className="text-green-600 font-bold">₱ {product.prod_price}</span>
                <span className="text-black-600 font-bold">Stocks: {product.prod_stock}</span>
              </div>
            </div>
          ))
        )}

    <div className='flex w-full justify-end space-x-2 pb-10 '>
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
