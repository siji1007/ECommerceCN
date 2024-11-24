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
            Why Visit Us?
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300">
            Camarines Norte is a captivating destination offering pristine beaches, rich history,
            and natural beauty. Discover Calaguas Island, known for its powdery white sands and turquoise waters,
            perfect for relaxation or adventure. Surfers flock to Bagasbas Beach for its consistent waves. Dive into history at Paracale, the "Gold Town,"
            and visit the First Rizal Monument, a unique tribute to the national hero. Nature lovers can trek to hidden gems like Malatap Falls and Mananap Falls, 
            offering refreshing escapes. Camarines Norte’s blend of adventure, tranquility, and culture makes it a must-visit for travelers seeking an authentic and unforgettable experience.
          </p>
        </div>
      </div>


     {/* Details about Camarines Norte */}
      <div className="relative z-60 flex flex-col lg:flex-row items-center justify-between w-full h-auto bg-center text-left p-[10vh] px-4 sm:px-8">
        {/* Overlay */}
        <div className="absolute inset-0 bg-white"></div>

        {/* Content Section */}
        <div className="relative w-full lg:w-7/12 text-left z-60 m-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-left">
            Batayog Festival
          </h1>
          <p className="text-lg sm:text-xl md:text-1xl text-gray-700">
            Camarines Norte is a captivating destination offering pristine beaches, rich history,
            and natural beauty. Discover Calaguas Island, known for its powdery white sands and turquoise waters,
            perfect for relaxation or adventure. Surfers flock to Bagasbas Beach for its consistent waves. Dive into history at Paracale, the "Gold Town," 
            and visit the First Rizal Monument, a unique tribute to the national hero. Nature lovers can trek to hidden gems like Malatap Falls and Mananap Falls,
            offering refreshing escapes. Camarines Norte’s blend of adventure, tranquility, and culture makes it a must-visit for travelers seeking an authentic and unforgettable experience.
          </p>
        </div>

        {/* Image Section */}
        <div className="relative w-full lg:w-5/12 mt-4 lg:mt-0 m-10">
          <img src="src/assets/temp.png" alt="Festival" className="w-full h-auto rounded-lg shadow-lg object-cover" />
        </div>
      </div>



      {/* ToC Section */}
      <div className="relative z-60 flex flex-col lg:flex-row w-full h-[80vh] bg-center text-center justify-center">
        {/* Overlay */}
        <div className="absolute inset-0 bg-green-900"></div>
        <div className="relative p-4 sm:p-8 w-full text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Top Tourist Landmarks
          </h1>

          {/* Landmarks */}
          <div className="flex flex-col lg:flex-row lg:justify-center lg:items-center">
            
          </div>
        </div>
      </div>

      {/* Hotel*/}
      <div className="relative z-60 flex flex-col lg:flex-row w-full h-[60vh] bg-center text-center justify-center">
        {/* Overlay */}
        <div className="absolute inset-0 bg-blue-950"></div>
        <div className="relative p-4 sm:p-8 w-full text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Accomodations
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
            Best Selling Products
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