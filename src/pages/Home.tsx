import React, { useState } from 'react';

const HomePage: React.FC = () => {
  const [cards, setCards] = useState([
    { id: 1, title: "Bagasbas Beach", img: "src/assets/bagasbas.png" },
    { id: 2, title: "Other Beach", img: "src/assets/image-2.png" },
    { id: 3, title: "Third Beach", img: "src/assets/image-3.png" },
    { id: 4, title: "Fourth Beach", img: "src/assets/image-4.png" },
    { id: 5, title: "Fifth Beach", img: "src/assets/image-5.png" },
  ]);

  // Function to scroll the carousel
  const scrollCarousel = (direction: 'left' | 'right') => {
    const container = document.getElementById('carousel');
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollLeft += scrollAmount;
    }
  };

  return (
    <>
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
      
      <div className="relative flex flex-col lg:flex-row items-center justify-center w-full h-[95vh] bg-center text-left">
        <img
        src='src/assets/temp.png'
        className='absolute inset-0 h-full w-full object-cover'
        >
        </img>
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Content Section */}

        <div className="relative z-10 p-4 sm:p-8 w-full lg:w-3/4 text-left">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-bold text-white mb-4">
            Welcome to Camarines Norte Tour & Shop Hub

          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-300">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
           Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
           Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
           Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>

      </div>
      
      <div className="relative flex flex-col lg:flex-row items-center justify-center w-full h-[95vh] bg-center text-center">
        {/* Overlay */}
        <div className="absolute inset-0 bg-green-950"></div>
        {/* Content Section */}
        <div className="relative z-10 p-4 sm:p-8 w-full lg:w-3/4 text-center">
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-bold text-white mb-4">
            Table of Contents
          </h1>
          
          <ul className="list-none text-base sm:text-lg md:text-3xl text-gray-300 mb-4" >
            <li>Calaguas</li>
            <li>Calaguas</li>
            <li>Calaguas</li>
            <li>Calaguas</li>
          </ul>
        </div>
        

      </div>

      {/* Calaguas Section */}
      <div className="relative flex flex-col lg:flex-row items-center justify-start w-full h-[95vh] bg-center text-left">
        {/* Video Background */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
        >
          <source src="src/assets/calaguas.mp4" type="video/mp4" />
          Your browser does not support the video.
        </video>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Content Section */}
        <div className="relative z-10 p-4 sm:p-8 w-full lg:w-1/2 text-left">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-bold text-white mb-4">
            Calaguas Island
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-4">
            Vinzons, Camarines Norte
          </p>
          <p className="text-sm sm:text-base md:text-lg text-gray-300">
            Calaguas Island in Camarines Norte is a serene tropical destination
            known for its powdery white sand beaches and clear blue waters, offering
            a perfect escape for camping, snorkeling, and swimming. Its unspoiled
            beauty and peaceful atmosphere make it a favorite for nature lovers and
            adventure seekers.
          </p>
        </div>

        
      </div>
      </>
  );
};


export default HomePage;
