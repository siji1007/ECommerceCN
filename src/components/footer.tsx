const footer: React.FC=()=>{
    return(
        <>
        <div className="relative p-10 z-10 bg-gray-900 h-auto text-white"> 
            <div className="flex flex-row  justify-center items-stretch gap-[5vw]">
                <div className="relative font-bold text-2xl lg:text-4xl sm:text-3xl">
                Pages
                <div className="flex flex-col">
                    <a href="/" target="_blank" className="font-normal text-lg hover:text-gray-400">Home</a>
                    <a href="/Shop" target="_blank" className="font-normal text-lg hover:text-gray-400">Shop</a>
                    <a href="/About" target="_blank" className="font-normal text-lg hover:text-gray-400">About</a>
                    
                </div>
                </div>
                <div className="relative font-bold text-2xl lg:text-4xl sm:text-3xl">
                    Contact
                    <div className="flex flex-col">
                        <a href="https://www.instagram.com/kunoupeko/" target="_blank" className="font-normal text-lg hover:text-gray-400"><i className="fab fa-facebook mr-2"></i>Facebook</a>
                        <a href="https://www.instagram.com/kunoupeko/" target="_blank" className="font-normal text-lg hover:text-gray-400"><i className="fab fa-youtube mr-2"></i>Youtube</a>
                        <a href="https://www.instagram.com/kunoupeko/" target="_blank" className="font-normal text-lg hover:text-gray-400"><i className="fab fa-instagram mr-2"></i>Instagram</a>
                    </div>
                </div>
                <div className="relative font-bold text-2xl lg:text-4xl sm:text-3xl">
                    Address
                    <div className="absolute text-sm">
                        <p className="font-normal " >Main Campus: F. Pimentel Ave, Camarines Norte, Daet, 4600, Philippines</p>
                    </div>
                    
                </div>
                <div className="relative font-bold text-2xl lg:text-4xl sm:text-3xl">
                    About Us
                    <div className="absolute text-sm">
                        <p className="font-normal " >ewan ko lalagay ko dito xd</p>
                    </div>
                </div>
            </div>
            
            <div className="justify-center text-center mt-16">
            Cardinal Coders ©
            </div>   
        </div>
             
        </>
    )
}


export default footer;