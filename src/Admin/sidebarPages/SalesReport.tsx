import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import host from '../../host/host.txt?raw';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ProductData {
  product_name: string;
  total_quantity: number;
}

interface TransactionDetail {
  user_name: string;
  product_name: string;
  created_at: string;
  payment: string;
}

const SalesReport: React.FC = () => {
  const [productData, setProductData] = useState<ProductData[]>([]);
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetail[]>([]);

  useEffect(() => {
    // Fetch transaction data from the backend
    const fetchData = async () => {
      const response = await fetch(host + '/fetchTransactionsAll');
      const data = await response.json();
      setProductData(data.product_quantities);
      setTransactionDetails(data.transaction_details);
    };

    fetchData();
  }, []);

  if (productData.length === 0 || transactionDetails.length === 0) return <h1>Loading...</h1>;

  // Sort transactions by the created_at date in descending order (latest first)
  const sortedTransactions = transactionDetails.sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return dateB - dateA; // descending order
  });

  // Prepare the chart data
  const chartData = {
    labels: productData.map((item) => item.product_name),
    datasets: [
      {
        label: 'Line Chart Sold By Products',
        data: productData.map((item) => item.total_quantity),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  };

  // Determine if scroll is needed (more than 10 transactions)
  const needsScroll = sortedTransactions.length > 10;

  return (
    <div className="h-screen"> {/* Full screen height */}
      {/* Transaction Table */}
      <h2 className="text-2xl font-semibold mt-2">Transaction Details</h2>
  
      <div className="h-1/2 overflow-y-auto"> {/* Set the table height to 50% of the screen */}
        <table className="w-full mt-2 table-auto border-collapse">
          <thead className="sticky top-0 bg-gray-100 z-10">
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">User Name</th>
              <th className="py-2 px-4 text-left">Product Name</th>
              <th className="py-2 px-4 text-left">Created At</th>
              <th className="py-2 px-4 text-left">Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((transaction, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 px-4">{transaction.user_name}</td>
                <td className="py-2 px-4">{transaction.product_name}</td>
                <td className="py-2 px-4">{new Date(transaction.created_at).toLocaleString()}</td>
                <td className="py-2 px-4">{transaction.payment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {/* Chart Container */}
      <div className="h-1/2 w-full mt-5"> {/* Set the chart height to 50% of the screen */}
        <Line data={chartData} />
      </div>
    </div>
  );
}  
export default SalesReport;
