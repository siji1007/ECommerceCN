import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from '../src/pages/Home';
import Shop from '../src/pages/Shop';
import Vendors from '../src/pages/Vendor';
import About from '../src/pages/About';
import './App.css';
import Header from './components/header';

function App() {
  return (
  
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/shop' element={<Shop/>}/>
        <Route path='/vendor' element={<Vendors/>}/>
        <Route path='/about' element={<About/>}/>
        
      </Routes>
    </Router>
  )
}

export default App
