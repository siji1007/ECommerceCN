import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HomePage from '../src/pages/Home';
import Shop from '../src/pages/Shop';
import Vendors from '../src/pages/Vendor';
import About from '../src/pages/About';
import Error404 from '../src/pages/Error404';
import LoginPage from './components/Modal_login';
import './App.css';
import Header from './components/header';
import Clientdashboard from '../src/Client/ClientDashboard';
import Business from './Client/BusinessPage/business';
import ProductUpload from './Client/BusinessPage/productsAdd';
import ProductList from './Client/BusinessPage/ProductLIst';
import AdminDashboard from './Admin/AdminDashboard';
import Footer from './components/footer';
import VendorProfile from './pages/vendor_Profile';
import Cartpage from './components/CartSideBar';
import Settings from './Client/Settings';
import Payment from './pages/BuyPayment';
import host from "./host/host.txt?raw";



function App() {
  const serverHost = host.trim();


  useEffect(() => {
    
    fetch(serverHost + '/api/get-current-session', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    })
    .then(response => response.json())
    .then(data => {
        if (data.session_cookie) {
            console.log('Session cookie:', data.session_cookie);
            console.log('Full name:', data.full_name);  // Display the full name
            localStorage.setItem('userFullName', data.full_name);  // Store the full name in localStorage
        } else {
            localStorage.removeItem('userFullName');  // Remove userFullName if no session
            localStorage.removeItem('Auth');
            const navigate = useNavigate();
            navigate('/login');
        }
    }) 
    .catch(error => console.error('Error:', error));
  }, []);



    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
      const authData = localStorage.getItem('Auth');
      if (authData) {
        setUserId(authData);
      }
  
    }, []);
  return (
  
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/admin' element={<AdminDashboard/>}/>
          
          <Route path='/shop' element={<Shop/>}/>
          <Route path='/shop/cart' element={<Cartpage />} />
          <Route path='/shop/buy-payment' element={<Payment />} />

          <Route path='/vendor' element={<Vendors />}/>
          <Route path='/vendor/vendor_profile' element={<VendorProfile />} />

          <Route path='/about' element={<About/>}/>

          <Route path={`/clientprofile/id=${userId}`} element={<Clientdashboard />}>
            <Route path='shop-cart' element={<Cartpage/>}/>
            <Route path='settings' element={<Settings/>}/>
            <Route path='business-form' element={<Business/>}/>
            <Route path='product-list' element={<ProductList/>}/>
            <Route path='products-add' element={<ProductUpload/>}/>
            
          
          </Route>
          <Route path='/admin' element={<AdminDashboard/> /* Temporary */}/>  
          <Route path='*' element={<Error404/>}/>
        </Routes>
        <Footer />
      </Router>
 
  )
}

export default App;
