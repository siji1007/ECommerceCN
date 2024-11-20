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
      <div className="relative flex flex-col lg:flex-row items-center justify-center w-full h-[95vh] bg-center text-left">
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

        {/* Cards Section */}
        <div className="relative flex items-center justify-center w-full lg:w-1/2 mt-8 ml-40 mr-40 lg:mt-0 overflow-hidden">
          {/* Left Arrow */}
          <button
            onClick={() => scrollCarousel('left')}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full z-10 hover:bg-opacity-75"
          >
            &#8249;
          </button>

          {/* Carousel Container */}
          <div
            id="carousel"
            className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar w-full px-4 justify-start"
            >
            {cards.map((card) => (
                <div
                key={card.id}
                className="flex-none w-[150px] h-[200px] sm:w-[200px] sm:h-[300px] lg:w-[250px] lg:h-[350px] bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-500 transform scale-95 hover:scale-100"
                >
                <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-2/3 object-cover"
                />
                <div className="p-4">
                    <h2 className="text-sm sm:text-lg font-bold text-gray-800 mb-2">
                    {card.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600">
                    {card.id === 1 ? "Daet, Camarines Norte" : "A serene tropical location"}
                    </p>
                </div>
                </div>
            ))}
            </div>


          {/* Right Arrow */}
          <button
            onClick={() => scrollCarousel('right')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full z-10 hover:bg-opacity-75"
          >
            &#8250;
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
