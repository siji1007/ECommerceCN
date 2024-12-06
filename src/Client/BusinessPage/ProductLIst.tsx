import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import profileImage from '../../assets/profiles/Profile.jpg';
import axios from 'axios';
import serverURL from '../../host/host.txt?raw';
import ReactHost from '../../host/ReactHost?raw';
import { Line, Bar } from 'react-chartjs-2';
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
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [vendorStatus, setVendorStatus] = useState<string>(''); // Store vendor status
  const hosting = serverURL.trim();
  const reactHost = ReactHost.trim();
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


  let url = window.location.href;
  let match = url.match(/id=(\d+)/);  // This will match 'id=2' or similar
  
  const id = match ? match[1] : null;
  
  if (!id) {
      return <div>ID not found in the URL</div>;
  }

  useEffect(() => {
    const fetchVendorStatus = async () => {
        try {
            // Send the GET request to the backend
            const response = await fetch(`${hosting}/checkVendorStatus/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();

            if (response.ok) {
                const vendorStatus = result.message; // Extract vendor status
                const vendorId = result.vendor_id; // Extract vendor ID

                setVendorStatus(vendorStatus);
                setVendorId(vendorId); // Set vendorId in state
                console.log(`Vendor Status: ${vendorStatus}, Vendor ID: ${vendorId}`);

                // Show the vendor status and vendor ID in an alert
                alert(`Vendor Status: ${vendorStatus}\nVendor ID: ${vendorId}`);
            } else {
                // If the response is not OK, show the message from the server
                alert(result.message || 'Failed to fetch vendor status');
            }
        } catch (error) {
            // Handle any network or unexpected errors
            console.error('Request failed', error);
            alert('An error occurred while trying to fetch vendor status');
        }
    };

    fetchVendorStatus();
}, [hosting, id]);

useEffect(() => {
  const fetchProducts = async () => {
    if (vendorId !== null) {
      try {
        const response = await axios.get<FetchProductsResponse>(`${hosting}/FetchProducts/${vendorId}`);
        const validProducts = response.data.products.filter(
          (product: Product) => product.prod_name && product.prod_category
        );
        setProducts(validProducts);

        // Show products in an alert
        const productDetails = validProducts
          .map((product: Product) =>
            `prod_id: ${product.prod_id}\n` +
            `vendor_id: ${product.vendor_id}\n` +
            `vendor_name: ${product.vendor_name}\n` +
            `prod_name: ${product.prod_name}\n` +
            `prod_category: ${product.prod_category}\n` +
            `prod_descript: ${product.prod_descript}\n` +
            `prod_price: ${product.prod_price}\n` +
            `prod_disc_price: ${product.prod_disc_price}\n` +
            `prod_status: ${product.prod_status}\n` +
            `prod_image_id: ${product.prod_image_id}`
          )
          .join('\n\n');

        alert(`Products:\n\n${productDetails}`);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    }
  };

  fetchProducts();
}, [hosting, vendorId]);



  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const newCommentObject: Comment = {
        id: Date.now(), // Using timestamp as a unique ID
        author: 'Seller', // Can be dynamic depending on the author
        text: newComment.trim(),
      };
      setComments([...comments, newCommentObject]);
      setNewComment('');
    }
  };



  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === 'All' || product.prod_category === selectedCategory) &&
      product.prod_name?.toLowerCase().includes(searchQuery)
  );
  

  if (vendorStatus === 'Pending') {
    return (
      <div className="p-4 text-center text-yellow-500">
        <h1>Your request is pending...</h1>
      </div>
    );

  }
  if (vendorStatus === 'Rejected') {
    return (
      <div className="p-4 text-center text-red-500">
        <h1>Your request is rejected.</h1>
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

      {/* Modal */}
      {modalProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`bg-white rounded-lg p-6 w-96 transition-transform ${isMinimized ? 'scale-50' : 'scale-100'}`}>
            {/* Modal Header with Minimize and Close Buttons */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{modalProduct.prod_name}</h2>
              <div className="flex space-x-2">
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => {
                    setModalProduct(null);
                    setIsMinimized(false);
                  }}
                >
                  X
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                <img
                  src={modalProduct.prod_image_id}
                  alt={modalProduct.prod_name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <p className="text-green-600 text-lg">{modalProduct.prod_price}</p>
                {/* <p className="text-yellow-500">{'⭐'.repeat(Math.round(modalProduct.rating))}</p> */}

                {/* Comment Section */}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Reviews</h3>
                  <div className="space-y-2 mt-2">
                    {comments.map((comment) => (
                      <div key={comment.id} className="p-2 bg-gray-100 rounded-md">
                        <p className="font-bold">{comment.author}:</p>
                        <p>{comment.text}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <input
                      type="text"
                      className="border rounded-md px-2 py-1 w-full"
                      placeholder="Write a review..."
                      value={newComment}
                      onChange={handleCommentChange}
                    />
                    <button
                      className="mt-2 w-full py-2 bg-green-900 text-white rounded-md hover:bg-blue-600"
                      onClick={handleCommentSubmit}
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
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
  );
};

export default ProductList;
