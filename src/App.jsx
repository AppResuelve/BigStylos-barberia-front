import './App.css'
import { Routes, Route } from 'react-router-dom'; // Asumiendo que estás utilizando react-router-dom
import Home from './components/home';

function App() {


  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App

