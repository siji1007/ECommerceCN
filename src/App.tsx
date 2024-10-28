import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from '../src/pages/Home';
import ShopPage from '../src/pages/Shop';
import AboutPage from '../src/pages/About';

import './App.css'

function App() {
  return (
   
    <Router>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/Shop' element={<ShopPage/>}/>
        <Route path='/About' element={<AboutPage/>}/>
      </Routes>
    </Router>
  )
}

export default App
