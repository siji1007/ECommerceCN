import React, { useState, useEffect, useRef } from 'react';
import { Parallax , ParallaxBanner} from 'react-scroll-parallax';
import TouristLandmarks from '../components/TouristLandmarks';

const HomePage: React.FC = () => {
  

  /* Video */
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoHeight, setVideoHeight] = useState<string>("auto");

  useEffect(() => {
    const handleResize = () => {
      if (videoRef.current) {
        // Get the video's dimensions
        const videoHeight = videoRef.current.videoHeight;
        const videoWidth = videoRef.current.videoWidth;

        // Maintain aspect ratio
        const aspectRatio = videoHeight / videoWidth;
        const containerWidth = videoRef.current.clientWidth;

        setVideoHeight(`${containerWidth * aspectRatio}px`);
      }
    };

    // Resize on metadata load and window resize
    if (videoRef.current) {
      videoRef.current.addEventListener("loadedmetadata", handleResize);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("loadedmetadata", handleResize);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <style>
        {`
          /* Hides the default scroll bar */
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }

          /* Custom Scrollbar Style */
          .no-scrollbar {
            scrollbar-width: thin; /* Firefox */
            scrollbar-color: transparent transparent; /* Firefox */
          }

          .no-scrollbar::-webkit-scrollbar {
            height: 10px; /* Height of the scrollbar */
          }

          .no-scrollbar::-webkit-scrollbar-thumb {
            background: #6b46c1; /* Thumb color */
            border-radius: 5px; /* Rounded edges */
          }

          .no-scrollbar::-webkit-scrollbar-track {
            background: #f0f0f0; /* Track color */
            border-radius: 5px;
          }
        `}
      </style>

      <div
        className="relative flex flex-col md:flex-row items-center justify-center w-full bg-center text-left "
        style={{ height: videoHeight }}
      >
        {/* Video Background */}
        <video
          className="absolute lg:fixed bottom-0 w-full h-auto object-cover"
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="src/assets/norte.mp4" type="video/mp4" />
          Your browser does not support the video.
        </video>
        <div className="absolute inset-0 bg-black opacity-0"></div>
      </div>

      {/* Why Visit Us? */}
      <div className="relative z-60 flex flex-col lg:flex-row items-center justify-center w-full h-[90vh] bg-center text-left py-[10vh] px-4 sm:px-8">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-80"></div>

        {/* Content Section */}
        <div className="relative w-full lg:w-11/12 text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 text-center py-16">
            Why Shop Here?
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300">
          At Camarines Norte Shop Hub, we offer a unique selection of local products, handcrafted goods, and exclusive deals that you won’t find anywhere else. By shopping with us, you support local artisans and businesses, contributing to the growth of the community. We prioritize quality, ensuring that every product meets high standards, from fashion to home decor and specialty items. With a user-friendly shopping experience, secure checkout, and fast delivery, Camarines Norte Shop Hub makes it easy and enjoyable to shop. Discover something special today and experience the heart of Camarines Norte through our curated offerings.
          </p>
        </div>
      </div>


     {/* Details about Camarines Norte */}
      <div className="relative z-60 flex flex-col lg:flex-row items-center justify-between w-full h-auto bg-center text-left p-[10vh] px-4 sm:px-8">
        {/* Overlay */}
        <div className="absolute inset-0 bg-white opacity-80"></div>

        {/* Content Section */}
        <div className="relative w-full lg:w-7/12 text-left z-60 m-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-left">
            Made with Heart
          </h1>
          <p className="text-lg sm:text-xl md:text-1xl text-black">
          
At Camarines Norte Shop Hub, every product is made with heart. We carefully select high-quality materials and work with skilled artisans to create unique, reliable items. Our commitment to craftsmanship ensures that every piece is not only functional but also a reflection of dedication and passion. When you shop with us, you're not just purchasing a product; you're supporting a labor of love that prioritizes quality and customer satisfaction. From thoughtful designs to exceptional service, every step of our process is driven by a genuine desire to deliver the best for you.
          </p>
        </div>

        {/* Image Section */}
        <div className="relative w-full lg:w-5/12 mt-4 lg:mt-0 m-10">
          <img src="src/assets/bantayog.jpg" alt="Festival" className="w-full h-auto rounded-lg shadow-lg object-cover" />
        </div>
      </div>

      <div className="relative z-60 flex flex-col lg:flex-row items-center justify-between w-full h-auto bg-center text-left p-[10vh] px-4 sm:px-8">
        {/* Overlay */}
        <div className="absolute inset-0 bg-gray-300 opacity-60"></div>
        
        {/* Image Section */}
        <div className="relative w-full lg:w-5/12 mt-4 lg:mt-0 m-10">
          <img src="src/assets/monument.jpg" alt="monument" className="w-full h-auto rounded-lg shadow-lg object-cover" />
        </div>
        
        {/* Content Section */}
        <div className="relative w-full lg:w-7/12 text-left z-60 m-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-left">
            Quality Products
          </h1>
          <p className="text-lg sm:text-xl md:text-1xl text-black">
          At Camarines Norte Shop Hub, we offer products crafted with care and attention to detail. Each item is made with the highest quality materials to ensure durability and exceptional performance. Our products are carefully selected, working with trusted manufacturers and artisans to create designs that stand out. We focus on providing a seamless shopping experience, with excellent customer service to ensure satisfaction with every purchase. Whether you’re looking for everyday essentials or unique gifts, our wide selection caters to all needs. Shop with us for quality, reliability, and products made with heart and precision.
          </p>
        </div>        
      </div>



      {/* ToC Section */}


      {/* Hotel*/}
      <div className="relative z-60 flex flex-col lg:flex-row w-full h-[60vh] bg-center text-center justify-center">
        {/* Overlay */}
        <div className="absolute inset-0 bg-blue-950"></div>
        <div className="relative p-4 sm:p-8 w-full text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Top Selling Foods
          </h1>

          {/* Acommodation */}
          <div className="flex flex-col lg:flex-row lg:justify-center lg:items-center">
            <TouristLandmarks />
          </div>
        </div>
      </div>

      {/* Best Selling Products */}
      <div className="relative z-60 flex flex-col lg:flex-row w-full h-[60vh] bg-center text-center justify-center">
        {/* Overlay */}
        <div className="absolute inset-0 bg-orange-500"></div>
        <div className="relative p-4 sm:p-8 w-full text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Top Selling Furnitures
          </h1>

          {/* Products */}
          <div className="flex flex-col lg:flex-row lg:justify-center lg:items-center">
            <TouristLandmarks />
          </div>
        </div>
      </div>

    </div>
  );
};

export default HomePage;