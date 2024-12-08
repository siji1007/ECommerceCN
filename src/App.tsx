import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
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
import CustomerManagement from './Admin/sidebarPages/consumerManagement';
import VendorManagement from './Admin/sidebarPages/vendorManagement';
import AdminSettins from './Admin/sidebarPages/adminSettings';
import Maptest from './pages/Maptest';
import Footer from './components/footer';
import VendorProfile from './pages/vendor_Profile';
import Cartpage from './components/CartSideBar';
import Settings from './Client/Settings';
import Payment from './pages/BuyPayment';
import host from "./host/host.txt?raw";

function App() {
  const serverHost = host.trim();
  const [userId, setUserId] = useState<string | null>(null);
  const [adminID, setAdminID] = useState<string | null>(null); // For admin ID

  useEffect(() => {
    // Fetch session info
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

    // Check if the user is logged in
    const authData = localStorage.getItem('Auth');
    if (authData) {
      setUserId(authData);
    }

    const storedAdminID = localStorage.getItem('adminID');
    setAdminID(storedAdminID);
  }, [adminID]);

  return (
    <Router>
      <Header />
      <div className="pt-10">
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/map' element={<Maptest />} />
          <Route path='/login' element={<LoginPage />} />
          
          {/* Admin Dashboard with admin ID */}
          <Route path={`/admin/id_admin=${adminID}`} element={<AdminDashboard />}>
            <Route path='customer-management' element={<CustomerManagement />} />
            <Route path='vendor-management' element={<VendorManagement />} />
            <Route path='settings' element={<AdminSettins />} />
          </Route>

          <Route path='/shop' element={<Shop />} />
          <Route path={`/shop/cart/id=${userId}`} element={<Cartpage />} />
          <Route path='/shop/buy-payment' element={<Payment />} />

          <Route path='/vendor' element={<Vendors />} />
          <Route path='/vendor/vendor_profile' element={<VendorProfile />} />

          <Route path='/about' element={<About />} />

          {/* Client Routes with userId */}
          <Route path={`/clientprofile/id=${userId}`} element={<Clientdashboard />}>
            <Route path='shop-cart' element={<Cartpage />} />
            <Route path='settings' element={<Settings />} />
            <Route path='business-form' element={<Business />} />
            <Route path='product-list' element={<ProductList />} />
            <Route path='products-add' element={<ProductUpload />} />
          </Route>
          
          <Route path='*' element={<Error404 />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
