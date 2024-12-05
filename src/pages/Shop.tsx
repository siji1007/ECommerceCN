// TODO: 
//   -display product image
//   -sort product alphabetically
//   -add section for top 10 product most buy 
//   -add section for advertisement 
//   -cart button 

import React, { useEffect, useState } from 'react';
import ImageSlider from "../components/slider";
import host from '../host/host.txt?raw';
import ErrorBoundary from '../components/ErrorBoundary';
import { FaBookmark, FaShoppingCart } from 'react-icons/fa';
import ProductModal from '../components/productModal'; 
import ReactHost from '../host/ReactHost?raw';

const images = [
  "src/assets/slide1.jpg",
  "src/assets/slide2.jpg",
  "src/assets/slide3.jpg",
];

const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]); 
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]); 
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(""); 
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); 
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false); 
  const [cart, setCart] = useState<any[]>([]); 
  const serverURL = host.trim();
  const reactHost = ReactHost.trim();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${serverURL}/FetchProducts`);
        const data = await response.json();
        if (Array.isArray(data.products)) {
          setProducts(data.products);
          setFilteredProducts(data.products); 
          
         
          const uniqueCategories = Array.from(new Set(data.products.map((product: any) => product.prod_category)));
          setCategories(uniqueCategories); //d ko pa naayos HAHAHA
        } else {
          setError("Failed to load products");
        }
      } catch (error) {
        setError("An error occurred while fetching products");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [serverURL]);

  // Search function by name
  const handleSearch = () => { const searchResult = products.filter((product) => product.prod_name.toLowerCase().includes(searchTerm.toLowerCase()) ); setFilteredProducts(searchResult); };

  
  const handleCategoryChange = (category: string) => { setSelectedCategory(category); if (category === "All") { setFilteredProducts(products); } else { const filteredByCategory = products.filter( (product) => product.prod_category === category ); setFilteredProducts(filteredByCategory); } };
 
  const openModal = (product: any) => {
    setSelectedProduct(product);
    setModalOpen(true);
     // Force re-render
  };
 const closeModal = () => { setModalOpen(false); setSelectedProduct(null); };

  const addToCart = (product: any) => { setCart([...cart, product]); closeModal(); };
  return (
    <ErrorBoundary>
      <div className="flex flex-col h-auto pt-16 min-h-screen">
        <div>
          <ImageSlider images={images} autoSlideInterval={1500} />
        </div>

        {/* Shop Section */}
        <div className="h-[15vh] bg-white relative">
          {/* Category Buttons */}
          <div className="flex justify-center gap-4 pt-4 pb-10 z-10 relative">
            <button onClick={() => handleCategoryChange("All")} className={`bg-green-600 text-white rounded-lg px-6 py-2 ${selectedCategory === "All" ? 'bg-green-800' : ''}`} > All </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`bg-green-600 text-white rounded-lg px-6 py-2 ${selectedCategory === category ? 'bg-green-800' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Section */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:w-1/2 justify-end absolute bottom-6 right-6 z-10">
            <input
              type="text"
              placeholder="Search for products..."
              className="border rounded-lg w-[90vw] md:w-[70%] lg:w-[50vh] p-3 text-black bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
              <button onClick={handleSearch} className="p-2 bg-green-900 text-white ">
              <i className="fas fa-search"></i> {/* Search Icon */}
            </button>
          </div>
        </div>

        {/* Product Area */}
        <div className="bg-white pt-10 px-6 min-h-screen">
          {loading ? (
            <h2>Loading products...</h2>
          ) : error ? (
            <h2>{error}</h2>
          ) : filteredProducts.length === 0 ? (
            <h2>No available products. Try adding some!</h2>
          ) : (
            <div className="flex flex-wrap gap-4">
              {filteredProducts.map((product: any) => (
                <div
                  key={product.prod_id}
                  className="relative w-48 bg-white border rounded-lg shadow-md p-2 cursor-pointer group transform transition-transform duration-300 hover:scale-105"
                  onClick={() => openModal(product)} // Open modal on click
                >
                  {/* Bookmark/Star icon in the top right */}
                  <div className="absolute top-2 right-2">
                    <FaBookmark className="text-gray-600 hover:text-green-800 cursor-pointer" />
                  </div>

                  <img
                    src={reactHost+product.prod_image_id}
                    alt={product.prod_name}
                    className="w-full h-32 object-cover rounded-md mb-2 border"
                  />
                  <h2 className="text-lg font-semibold">{product.prod_name}</h2>

                  {/* Add to Cart Button (hidden initially, shows on hover) */}
                    <button
                        onClick={() => openModal(product)}
                      className="mt-2  text-white rounded-lg px-4 items-center justify-center py-2 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex"
                    >
                      <FaShoppingCart className="text-black h-5 w-5 mr-2" />
                    </button>

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-green-600 font-bold">{"₱ " + product.prod_price}</span>
                    <p className="text-yellow-500">
                      {'⭐'.repeat(Math.round(2))} {/* Star rating */}
                    </p>
                  </div>

                  {/* Product Description (hidden initially, shows on hover) */}
                  <p className="text-gray-700 mt-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {product.prod_descript}
                  </p>
                </div>
              ))}
            </div>

          )}
        </div>
        
        {/* Modal */}
        <div className='w-full'> 
          <ProductModal isOpen={modalOpen} product={selectedProduct!} onClose={closeModal} onAddToCart={addToCart} />
        </div>
       
      </div>
    </ErrorBoundary>
  );
};

export default ShopPage;
