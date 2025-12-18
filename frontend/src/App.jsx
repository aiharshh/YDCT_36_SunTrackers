import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Planner from './pages/Planner';
import Invest from './pages/Invest';
import Analysis from './pages/Analysis';

function AppRoutes() {
  const location = useLocation();
  const showNavbar = location.pathname !== '/';

  return (
    <>
      {showNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/invest" element={<Invest />} />
        <Route path="/analysis" element={<Analysis />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}