import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react';
import HomePage from '../src/pages/Home';
import Shop from '../src/pages/Shop';
import Vendors from '../src/pages/Vendor';
import About from '../src/pages/About';
import Error404 from '../src/pages/Error404';
import './App.css';
import Header from './components/header';
import Clientdashboard from '../src/Client/ClientDashboard';
import Business from './Client/BusinessPage/business';
import ProductUpload from './Client/BusinessPage/productsAdd';
import ProductList from './Client/BusinessPage/ProductLIst';
import AdminDashboard from './Admin/AdminDashboard';
import Footer from './components/footer';
import Cookies from 'js-cookie';
import host from "./host/host.txt?raw";


function App() {
  const serverHost = host.trim();
  // useEffect(() => {
  //   // Check if the unauthorized cookie exists
  //   if (!Cookies.get('unauth_cookie')) {
  //     const randomCookieValue = Math.random().toString(36).substr(2) + Date.now().toString(36);
  //     Cookies.set('unauth_cookie', randomCookieValue, { expires: 7 });

  //     // Send the cookie to the Flask server
  //     fetch(serverHost + '/api/store-unauth-cookie', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ unauth_cookie: randomCookieValue }),
  //     })
  //     .then(response => response.json())
  //     .then(data => console.log(data.message))
  //     .catch(error => console.error('Error:', error));
  //   }
  //  }, []);
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
          <Route path='/admin' element={<AdminDashboard/>}/>
          <Route path='/shop' element={<Shop/>}/>
          <Route path='/vendor' element={<Vendors/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path={`/clientprofile/id=${userId}`} element={<Clientdashboard />}>
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
