import ImageSlider from "../components/slider";

const images = [
    "https://via.placeholder.com/600x400?text=Slide+1",
    "src/assets/slide1.png",
    "src/assets/sound.png",
  ];

const shopPage: React.FC = () => {
    return(
        <>
        <div className="flex flex-col h-auto pt-16">
          <div>
            <ImageSlider images={images} autoSlideInterval={3000} />
          </div>
      
          {/* Shop XD Section */}
          <div className="h-[50vh] bg-slate-500 relative">
            {/* Background Overlay for Contrast */}
            <div className="absolute inset-0 bg-black opacity-30"></div>
      
            <div className="relative z-70 flex flex-col md:flex-row items-start pt-5 justify-between px-6 md:px-16 h-full">
              {/* Title Section */}
              <h1 className="text-white font-bold text-4xl lg:text-6xl md:w-1/2 text-center md:text-left">
                Shop XD
              </h1>
      
              {/* Search Box Section */}
              <div className="flex flex-col md:flex-row items-center gap-4 md:w-1/2 justify-end">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="rounded-lg w-[90vw] md:w-[70%] lg:w-[50vh] p-3 text-black"
                />
                <button className=" bg-blue-600 font-bold text-white rounded-lg px-6 py-3 w-full md:w-auto">
                  Search
                </button>
              </div>
            </div>
      
            {/* Product Area */}
            <div className="bg-white h-[20vh]">
              
            </div>
          </div>
        </div>
      </>
      
    )

}
export default shopPage;
