import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Planner from './pages/Planner';
import Invest from './pages/Invest';
import Analysis from './pages/Analysis';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import SolarPanelExplanation from './components/SolarPanelExplanation.jsx';

function AppRoutes() {
  const location = useLocation();
  const showNavbar = location.pathname !== '/login';

  return (
    <>
      {showNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/invest" element={<Invest />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/solarExplanation" element={<SolarPanelExplanation />} />
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