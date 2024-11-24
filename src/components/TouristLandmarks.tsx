import React, { useRef } from 'react';

const TouristLandmarks: React.FC = () => {
    const carouselRef = useRef<HTMLDivElement | null>(null);
  
    const scrollCarousel = (direction: "left" | "right") => {
      if (carouselRef.current) {
        const scrollAmount = direction === "left" ? -300 : 300;
        carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    };
  
    const landmarks = [
      { id: 1, title: "Calaguas Island", img: "src/assets/temp.png", desc: "White Beach" },
      { id: 2, title: "Bagasbas Beach", img: "src/assets/bagasbas.png", desc: "Surf Capital"  },
      { id: 3, title: "Apuao Grande Island", img: "src/assets/temp.png", desc: "It's a beach"  },
      { id: 4, title: "Mercedes Islands", img: "src/assets/temp.png", desc: "Fish Capital"  },
      { id: 5, title: "Paracale Mines", img: "src/assets/temp.png", desc: "Gold"  },
      { id: 6, title: "Paracale Mines", img: "src/assets/temp.png", desc: "Gold"  },
      { id: 7, title: "Paracale Mines", img: "src/assets/temp.png", desc: "Gold"  },
      { id: 8, title: "Paracale Mines", img: "src/assets/temp.png", desc: "Gold"  },

    ];
  
    return (
  
        <div className="relative p-4 sm:p-8 w-full lg:w-11/12 text-center">

  
          {/* Carousel Container */}
          <div className="relative flex z-60 items-center justify-center w-full ">
            {/* Left Arrow */}
            <button
              onClick={() => scrollCarousel("left")}
              className="absolute left-0 z-50 bg-black bg-opacity-80 text-white p-3 rounded-full shadow hover:bg-opacity-100 transition"
            >
              &#8249;
            </button>
  
            {/* Carousel */}
            <div
              ref={carouselRef}
              className="flex overflow-x-scroll scrollbar-hide scroll-smooth w-full px-1"
            >
              {landmarks.map((landmark) => (
                <div
                  key={landmark.id}
                  className="flex-none w-[300px] h-[40vh] scale-90 bg-black shadow-lg rounded-lg overflow-hidden transition-all duration-150 ease-in-out transform hover:cursor-pointer hover:scale-100 hover:mx-5"
                >
                  <img
                    src={landmark.img}
                    alt={landmark.title}
                    className="w-full h-full object-cover"
                  />
                   <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent text-white">
                        <h2 className="text-lg font-bold">{landmark.title}</h2>
                        <p className="text-sm">{landmark.desc}</p>
                    </div>
                </div>
              ))}
            </div>
  
            {/* Right Arrow */}
            <button
              onClick={() => scrollCarousel("right")}
              className="absolute right-4 z-70 bg-black bg-opacity-80 text-white p-3 rounded-full shadow hover:bg-opacity-100 transition"
            >
              &#8250;
            </button>
          </div>
        </div>
    );
  };
  
  export default TouristLandmarks;
  