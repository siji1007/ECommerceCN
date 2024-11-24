import React, { useState, useEffect, useRef } from "react";

interface ImageSliderProps {
  images: string[];
  autoSlideInterval?: number; // Optional auto-slide interval in milliseconds
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, autoSlideInterval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartRef = useRef(0); // To store the initial touch position
  const touchEndRef = useRef(0);   // To store the final touch position

  // Move to the next slide
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Auto slide effect
  useEffect(() => {
    const intervalId = setInterval(goToNext, autoSlideInterval);

    // Cleanup on component unmount
    return () => clearInterval(intervalId);
  }, [autoSlideInterval]);

  // Swipe detection for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndRef.current = e.changedTouches[0].clientX;
    const swipeThreshold = 50; // minimum swipe distance to trigger slide change
    if (touchStartRef.current - touchEndRef.current > swipeThreshold) {
      goToNext(); // Swipe left (next slide)
    } else if (touchEndRef.current - touchStartRef.current > swipeThreshold) {
      goToPrevious(); // Swipe right (previous slide)
    }
  };

  return (
    <div className="relative w-full mx-auto">
      {/* Slider Wrapper */}
      <div
        className="relative w-full overflow-hidden h-[30vh] lg:h-[50vh] rounded-lg"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Slide ${index}`}
              className="w-full flex-shrink-0 object-cover h-[30vh] lg:h-[50vh]"
            />
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 p-2 rounded-full hover:bg-black/70"
      >
        &lt;
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 p-2 rounded-full hover:bg-black/70"
      >
        &gt;
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-white" : "bg-gray-400"
            } cursor-pointer`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
