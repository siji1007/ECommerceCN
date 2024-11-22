import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from '../src/pages/Home';
import Shop from '../src/pages/Shop';
import Vendors from '../src/pages/Vendor';
import About from '../src/pages/About';
import Error404 from '../src/pages/Error404';
import './App.css';
import Header from './components/header';
import Footer from './components/footer';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Check if the unauthorized cookie exists
    if (!Cookies.get('unauth_cookie')) {
      const randomCookieValue = Math.random().toString(36).substr(2) + Date.now().toString(36);
      Cookies.set('unauth_cookie', randomCookieValue, { expires: 7 });

      // Send the cookie to the Flask server
      fetch('http://localhost:5000/api/store-unauth-cookie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ unauth_cookie: randomCookieValue }),
      })
      .then(response => response.json())
      .then(data => console.log(data.message))
      .catch(error => console.error('Error:', error));
    }
  }, []);

  return (
  
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/shop' element={<Shop/>}/>
          <Route path='/vendor' element={<Vendors/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='*' element={<Error404/>}/>
        </Routes>
      </Router>
 
  )
}

export default App
