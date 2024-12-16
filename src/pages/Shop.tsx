// TODO: 
//   -sort product alphabetically
//   -add section for top 10 product most buy 
//   -add section for advertisement 
//   -cart button  function

import React, { useEffect, useState } from 'react';
import ImageSlider from "../components/slider";
import host from '../host/host.txt?raw';
import ErrorBoundary from '../components/ErrorBoundary';
import { FaBookmark, FaShoppingCart } from 'react-icons/fa';
import ProductModal from '../components/productModal'; 
import ReactHost from '../host/ReactHost.txt?raw';

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";  
import "slick-carousel/slick/slick-theme.css";
import Settings from '../Client/Settings';


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


  const NextArrow = ({ onClick }) => {
  return (
    <div
      className="absolute right-[-5vh] top-1/2 transform -translate-y-1/2 z-10 cursor-pointer"
      onClick={onClick}
    >
      <button className="bg-green-600 rounded-lg font-bold text-2xl p-1 px-2 text-gray-800">{'>'}</button>
    </div>
  );
};

const PrevArrow = ({ onClick }) => {
  return (
    <div
      className="absolute left-[-5vh] top-1/2 transform -translate-y-1/2 z-10 cursor-pointer"
      onClick={onClick}
    >
      <button className="bg-green-600 rounded-lg font-bold text-2xl p-1 px-2 text-gray-800">{'<'}</button>
    </div>
  );
};
  
  
  const slickSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 4,
    centerMode: true,
    centerPadding: "50 ",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1668, // For tablets
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 680, // For mobile devices
        settings: {
          slidesToShow: 1.75,
        },
      },
    ],
  };

  const dummyCategories = ["Category 1", "Category 2", "Category 3", "Category 4", "Category 5"]; // Temporary dummy buttons
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

  
  // const handleCategoryChange = (category: string) => { setSelectedCategory(category); if (category === "All") { setFilteredProducts(products); } else { const filteredByCategory = products.filter( (product) => product.prod_category === category ); setFilteredProducts(filteredByCategory); } };
  const handleCategoryChange = (category: string) => { 
    setSelectedCategory(category); 
    if (category === "All") { 
      setFilteredProducts(products); 
    } else { 
      const filteredByCategory = products.filter((product) => product.prod_category === category); 
      setFilteredProducts(filteredByCategory); 
    } 
  };

  const openModal = (product: any) => {
    setSelectedProduct(product);
    setModalOpen(true);
     // Force re-render
  };
 const closeModal = () => { setModalOpen(false); setSelectedProduct(null); };

  const addToCart = (product: any) => { setCart([...cart, product]); closeModal(); };
  function onBuyNow(): void {
    throw new Error('Function not implemented.');
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-auto justify-center min-h-screen">
        <div className='flex pt-5 lg:pt-10 justify-center'>
          <ImageSlider images={images} autoSlideInterval={1500} />
        </div>

        {/* Shop Section */}
        <div className="h-[15vh] bg-white relative">
          
          {/* Search Section */}
          <div className="flex flex-row items-center gap-2 justify-center absolute bottom-6 right-6 z-10">
            <input
              type="text"
              placeholder="Search for products..."
              className="border rounded-lg w-[35vh] lg:w-[50vh] p-3 text-black bg-white"
              value={searchTerm}
              onKeyDown={event => {
                if (event.key === 'Enter') {
                  handleSearch()
                }
              }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
              <button onClick={handleSearch} className="px-5 py-3 rounded-lg lg:p-2 bg-green-900 text-white ">
              <i className="fas fa-search"></i> {/* Search Icon */}
            </button>
          </div>
        </div>

        {/* Category Buttons */}

        <h1 className="relative text-4xl font-bold text-center mb-3">Category</h1>
        <div className=' px-[10vw] lg:px-[30vw] pb-16'>
        <Slider {...slickSettings}>
          <div>
            <button
              onClick={() => handleCategoryChange("All")}
              className={`bg-green-600 text-[1.5vh] text-white rounded-lg px-12 py-2 ${
                selectedCategory === "All" ? "bg-green-800" : ""
              }`}
            >
              All
            </button>
            
          </div>
          {dummyCategories.map((category) => (
            <div key={category}>
              <button
                onClick={() => handleCategoryChange(category)}
                className={`bg-green-600 text-white text-[1.5vh] rounded-lg px-6 py-2 ${
                  selectedCategory === category ? "bg-green-800" : ""
                }`}
              >
                {category}
              </button>
            </div>
          ))}
        </Slider>
        </div>
        {/* Product Area */}
        <div className="bg-white px-0 lg:px-6 min-h-screen">
          {loading ? (
           <div className="relative">
           {/* Content here (e.g., filtered products) */}
         
           {/* Loading Modal */}
           <div className="absolute inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
             <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
           </div>
         </div>
         
          
          
          ) : error ? (
            <h2>{error}</h2>
          ) : filteredProducts.length === 0 ? (
            <h2>No available products. Try adding some!</h2>
          ) : (
            <div className="flex flex-wrap gap-2 md:gap-4 justify-center lg:justify-start">
              {filteredProducts.map((product: any) => (
              
                <div
                  key={product.prod_id}
                  className="relative w-[22.5vh] bg-white border rounded-lg shadow-md p-2 cursor-pointer group transform transition-transform duration-500 hover:scale-105"
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
                    <span className="text-green-600 font-bold">{"₱ " + (product.prod_price - product.prod_disc_price)}</span>
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
        {modalOpen && (
        <ProductModal 
          isOpen={modalOpen} 
          product={selectedProduct!} // Ensure selectedProduct is not null when passing it
          onClose={closeModal} 
          onAddToCart={addToCart} 
          onBuyNow={onBuyNow}
        />
      )}
       
      </div>
    </ErrorBoundary>
  );
};

export default ShopPage;