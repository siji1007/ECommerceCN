import React, { useState , useEffect, useRef} from 'react';
import TouristLandmarks from '../components/TouristLandmarks';

const HomePage: React.FC = () => {
  
  /* Video */

  const videoRef = useRef(undefined);
  useEffect(() => {
      videoRef.current.defaultMuted = true;
  })

  /* Scroll */
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newScale = 1 + scrollY * 0.0005; // Adjust scaling factor
      setScale(newScale);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
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
      
      <div className="relative flex flex-col md:flex-row items-center justify-center w-full h-[95vh] bg-center text-left">
        <img
        src='src/assets/Home.jpg'
        style={{
          transform: `scale(${scale})`,
          transition: "transform 0.1s linear",
        }}
        className='fixed inset-0 h-full w-full object-cover'
        alt='homebackground'
        >
        </img>
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Content Section */}

        <div className="relative z-60 p-4 sm:p-8 w-full lg:w-3/4 text-left">
          <h1 className="text-6xl sm:text-8xl md:text-8xl lg:text-7xl font-bold text-white mb-4">
            Welcome to Camarines Norte Tour & Shop Hub

          </h1>
          <p className="text-1xl sm:text-base md:text-lg text-gray-300">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
           Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
           Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
           Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>

      </div>
      
      {/* ToC Section */}

      <div className="relative z-60 flex flex-col lg:flex-row  w-full h-[50vh] bg-center text-center justify-center">
        {/* Overlay */}
        <div className="absolute inset-0 bg-green-950"></div>
          <div className="relative p-4 sm:p-8 w-full lg:w-full text-center">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-5xl font-bold text-white mb-4">
                Tourist Landmarks
            </h1>

          {/* Landmarks */}
          <div className="flex flex-col lg:flex-row lg:justify-center lg:items-center">
            <TouristLandmarks/>
          </div>
        </div>
      </div>

      {/* Calaguas Section */}
      <div className="relative z-60 flex flex-col lg:flex-row items-center justify-start w-full h-[95vh] bg-center text-left">
        {/* Video Background */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline>
          <source src="src/assets/calaguas.mp4" type="video/mp4" />
          Your browser does not support the video.
        </video>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Content Section */}
        <div className="relative p-4 sm:p-8 w-full lg:w-1/2 text-left">
          <h1 className="text-8xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white mb-4">
            Calaguas Island
          </h1>
          <p className="text-3xl sm:4xl md:text-lg p-4 text-gray-300 mb-4">
            Vinzons, Camarines Norte
          </p>
          <p className="text-3xl sm:4xl md:text-lg p-4 text-gray-300">
            Calaguas Island in Camarines Norte is a serene tropical destination
            known for its powdery white sand beaches and clear blue waters, offering
            a perfect escape for camping, snorkeling, and swimming. Its unspoiled
            beauty and peaceful atmosphere make it a favorite for nature lovers and
            adventure seekers.
          </p>
        </div>

        
      </div>
    </div>
  );
};

export default HomePage;
