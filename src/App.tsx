import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from '../src/pages/Home';
import About from '../src/pages/About';
import './App.css';
import Header from './components/header';

function App() {
  return (
  
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/About' element={<About/>}/>
      </Routes>
    </Router>
  )
}

export default App
