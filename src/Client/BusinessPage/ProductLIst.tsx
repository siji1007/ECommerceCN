import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import profileImage from '../../assets/profiles/Profile.jpg';
import axios from 'axios';
import serverURL from '../../host/host.txt?raw';
import ReactHost from '../../host/ReactHost.txt?raw';
import { Line, Bar } from 'react-chartjs-2';
import NewOrders from './NewOrder'; 
import ProductModal from './productDetails';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

interface Product {
  prod_id: number;
  vendor_id: number;
  vendor_name:string;
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


interface Comment {
  id: number;
  author: string;
  text: string;
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

  const [vendorId, setVendorId] = useState(null); // State to store vendorId
  const [error, setError] = useState(null);
  


  // Extract unique categories from the products array
  const categories = [
    'All', 
    ...Array.from(new Set(products.map((product) => product.prod_category)))
  ];




  const monthlySalesData = [1200, 1500, 1800, 1300, 1700, 1600, 2000, 2100, 1800, 2500, 2300, 2400];
  
  // Sample product sales data
  const topProductsData = [
    { prod_name: 'Product A', prod_sales: 5000 },
    { prod_name: 'Product B', prod_sales: 4500 },
    { prod_name: 'Product C', prod_sales: 4000 },
    { prod_name: 'Product D', prod_sales: 3500 },
    { prod_name: 'Product E', prod_sales: 3000 },
  ];

  const lineChartData = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    datasets: [
      {
        label: 'Monthly Sales',
        data: monthlySalesData,
        fill: false,
        borderColor: '#4CAF50',
        tension: 0.1,
      },
    ],
  };

  const barChartData = {
    labels: topProductsData.map(product => product.prod_name),
    datasets: [
      {
        label: 'Top Products by Sales',
        data: topProductsData.map(product => product.prod_sales),
        backgroundColor: '#FF6347',
        borderColor: '#FF6347',
        borderWidth: 1,
      },
    ],
  };



  const id = localStorage.getItem('Auth')

  useEffect(() => {
    const fetchVendorData = async () => {
        try {
            // Fetch vendor status
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
                console.log(`Vendor Status: ${vendorStatus}, Vendor ID: ${vendorId}`);

                // Fetch products if vendor ID is valid
                if (vendorId !== null) {
                    try {
                        const productsResponse = await axios.get<FetchProductsResponse>(`${hosting}/FetchProducts/${vendorId}`);
                        const validProducts = productsResponse.data.products.filter(
                            (product: Product) => product.prod_name && product.prod_category
                        );
                        setProducts(validProducts);
                    } catch (err) {
                        console.error('Error fetching products:', err);
                    }
                }
            } else {
                console.error('Error fetching vendor status:', vendorStatusResult.message);
            }
        } catch (error) {
            console.error('Request failed', error);
            alert('An error occurred while trying to fetch vendor status');
        }
    };

    fetchVendorData();
}, [hosting, id]);



  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

 
  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === 'All' || product.prod_category === selectedCategory) &&
      product.prod_name?.toLowerCase().includes(searchQuery)
  );
  

  const statusMessages: { [key: string]: { text: string; color: string } } = {
    Pending: { text: 'Your request is pending...', color: 'text-yellow-500' },
    Rejected: { text: 'Your request is rejected.', color: 'text-red-500' },
  };
  
  if (statusMessages[vendorStatus]) {
    const { text, color } = statusMessages[vendorStatus];
    return (
      <div className={`p-4 text-center ${color}`}>
        <h1>{text}</h1>
      </div>
    );
  }



  return (
    <div className="p-4">
      
      {/* Filter and Search */}
      <div className="flex items-center mb-4">
        <select
          className="border rounded-md px-2 py-1 mr-4"
          onChange={handleCategoryChange}
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
          onChange={handleSearchChange}
        />
      </div>

      <div className="flex flex-col lg:flex-row w-full overflow-x-auto mb-2 gap-2 items-center justify-center">
        <div className="mb-6 w-full lg:w-1/2"> {/* For mobile, it's full width, for larger screens it's 50% width */}
          <h2 className="text-xl font-semibold mb-4">Monthly Sales</h2>
          <Line data={lineChartData} />
        </div>

        {/* Bar Chart for Top Products Sales */}
        <div className="mb-6 w-full lg:w-1/2"> {/* For mobile, it's full width, for larger screens it's 50% width */}
          <h2 className="text-xl font-semibold mb-4">Top Products by Sales</h2>
          <Bar data={barChartData} />
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
                src={ reactHost + product.prod_image_id}
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
      </div>
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

      {modalProduct && (
      <ProductModal product={modalProduct} onClose={() => setModalProduct(null)} />
    )}
   

    </div>
  );
};

export default ProductList;
