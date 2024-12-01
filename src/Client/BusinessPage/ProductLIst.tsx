import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import profileImage from '../../assets/profiles/Profile.jpg';
import axios from 'axios';
import serverURL from '../../host/host.txt?raw';

interface Product {
  id: number;
  title: string;
  price: string;
  rating: number;
  category: string;
  image: string;
}

interface Comment {
  id: number;
  author: string;
  text: string;
}

const products: Product[] = [
  { id: 1, title: 'Kakanin', price: '$10', rating: 4.5, category: 'Electronics', image: 'https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350' },
  { id: 2, title: 'Product 2', price: '$20', rating: 4.0, category: 'Books', image: 'https://www.filipino-recipes-lutong-pinoy.com/images/xpichi-pichi-Filipino-kakanin-Recipe.jpg.pagespeed.ic.jMT7AVXNgg.webp' },
  { id: 3, title: 'Product 3', price: '$30', rating: 5.0, category: 'Clothing', image: 'https://www.filipino-recipes-lutong-pinoy.com/images/xpichi-pichi-Filipino-kakanin-Recipe.jpg.pagespeed.ic.jMT7AVXNgg.webp' },
  { id: 4, title: 'Product 4', price: '$40', rating: 3.5, category: 'Electronics', image: 'https://www.filipino-recipes-lutong-pinoy.com/images/xpichi-pichi-Filipino-kakanin-Recipe.jpg.pagespeed.ic.jMT7AVXNgg.webp' },
  { id: 5, title: 'Product 5', price: '$50', rating: 4.8, category: 'Books', image: 'https://www.filipino-recipes-lutong-pinoy.com/images/xpichi-pichi-Filipino-kakanin-Recipe.jpg.pagespeed.ic.jMT7AVXNgg.webp0' },
];

const ProductList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [vendorStatus, setVendorStatus] = useState<string>(''); // Store vendor status
  const hosting = serverURL.trim();


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
              const vendorStatus = result.message;
              setVendorStatus(vendorStatus);
              console.log(`Vendor Status: ${vendorStatus}`);
          
             
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

    // Call the function inside useEffect
    if (id) {
        fetchVendorStatus();
    }
}, [id, hosting]);

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
      (selectedCategory === 'All' || product.category === selectedCategory) &&
      product.title.toLowerCase().includes(searchQuery)
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
          <option value="All">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Books">Books</option>
          <option value="Clothing">Clothing</option>
        </select>
        <input
          type="text"
          className="border rounded-md px-2 py-1 flex-grow"
          placeholder="Search products..."
          onChange={handleSearchChange}
        />
      </div>

      {/* Product List */}
      <div className="flex flex-wrap gap-4 ">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="w-48 bg-white border rounded-lg shadow-md p-2 cursor-pointer"
            onClick={() => setModalProduct(product)}
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-32 object-cover rounded-md mb-2"
            />
            <h2 className="text-lg font-semibold">{product.title}</h2>
            <div className="flex justify-between items-center mt-2">
              <span className="text-green-600 font-bold">{product.price}</span>
              <span className="text-yellow-500">{'⭐'.repeat(Math.round(product.rating))}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`bg-white rounded-lg p-6 w-96 transition-transform ${isMinimized ? 'scale-50' : 'scale-100'}`}>
            {/* Modal Header with Minimize and Close Buttons */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{modalProduct.title}</h2>
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
                  src={modalProduct.image}
                  alt={modalProduct.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <p className="text-green-600 text-lg">{modalProduct.price}</p>
                <p className="text-yellow-500">{'⭐'.repeat(Math.round(modalProduct.rating))}</p>

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
