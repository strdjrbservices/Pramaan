import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThemeContextProvider } from './context/ThemeContext';
import Subject from './components/Subject/subject';
import CustomQuery from './components/Subject/CustomQuery';
import HomePage from './components/Subject/HomePage';
import Compare from './components/Subject/Compare';
import HtmlExtractor from './components/Subject/HtmlExtractor';
import Form1004D from './components/Subject/1004D';
import Login from './components/Subject/Login';
import ProtectedRoute from './components/ProtectedRoute';
import DJRBLogo from './components/Subject/logo';
import Scenario2 from './components/updatedformtype/Scenario2';
import Guide from './components/Subject/Guide';
import TermsOfService from './components/Subject/TermsOfService';
import PrivacyPolicy from './components/Subject/PrivacyPolicy';
import ContactUs from './components/Subject/ContactUs';
import History from './components/Subject/History';
import FloatingMenu from './components/Subject/FloatingMenu';
import Register from './components/Subject/Register';

import {
  //Box,
  //Button,
  IconButton,
  // Avatar,
  // Typography,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import DescriptionIcon from '@mui/icons-material/Description';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import SearchIcon from '@mui/icons-material/Search';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import HistoryIcon from '@mui/icons-material/History';
import AssignmentIcon from '@mui/icons-material/Assignment';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('isAuthenticated', String(isAuthenticated));
  }, [isAuthenticated]);

  // useEffect(() => {
  //   if (!isAuthenticated) return;

  //   let idleTimer;

  //   const resetTimer = () => {
  //     clearTimeout(idleTimer);
  //     if (location.pathname !== '/logo') {
  //       idleTimer = setTimeout(() => {
  //         localStorage.setItem('lastPath', location.pathname);
  //         navigate('/logo');
  //       }, 1 * 30 * 1000);
  //     }
  //   };

  //   const handleActivity = () => {
  //     if (location.pathname === '/logo') {
  //       const lastPath = localStorage.getItem('lastPath') || '/';
  //       navigate(lastPath);
  //     } else {
  //       resetTimer();
  //     }
  //   };

  //   window.addEventListener('mousemove', handleActivity);
  //   window.addEventListener('keydown', handleActivity);
  //   resetTimer();

  //   return () => {
  //     clearTimeout(idleTimer);
  //     window.removeEventListener('mousemove', handleActivity);
  //     window.removeEventListener('keydown', handleActivity);
  //   };
  // }, [isAuthenticated, location.pathname, navigate]);

  const handleLogout = () => {
    setMenuOpen(false);
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    navigate('/login', { replace: true });
  };

  const hideHeader = location.pathname === '/login';

  const navItems = [
    { label: 'Full Review', path: '/extractor', icon: <DescriptionIcon /> },
    { label: 'Revised Review', path: '/compare', icon: <CompareArrowsIcon /> },
    { label: 'Custom Query', path: '/query', icon: <SearchIcon /> },
    { label: '1004D', path: '/1004D', icon: <AssignmentTurnedInIcon /> },
    { label: 'Scenario 2', path: '/scenario2', icon: <AssignmentIcon /> },
    { label: 'History', path: '/history', icon: <HistoryIcon /> },
  ];

  return (
    <>
      {/* MENU BUTTON */}
      {!hideHeader && (
        <IconButton
          ref={menuButtonRef}
          onClick={() => setMenuOpen((p) => !p)}
          sx={{
            position: 'fixed',
            top: 16,
            right: 24,
            zIndex: 1500,
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            transition: 'all 0.35s ease',
            transform: menuOpen ? 'rotate(90deg) scale(1.05)' : 'rotate(0deg)',
            '&:hover': {
              background: 'rgba(255,255,255,0.9)',
              transform: 'rotate(90deg) scale(1.1)',
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* FLOATING MENU */}
      {!hideHeader && (
        <FloatingMenu
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          menuButtonRef={menuButtonRef}
          navItems={navItems}
          location={location}
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
        />
      )}
      <ThemeContextProvider>
        {/* ROUTES */}
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route path='/logo' element={<DJRBLogo />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/extractor" element={<Subject />} />
            <Route path="/query" element={<CustomQuery />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/html-extractor" element={<HtmlExtractor />} />
            <Route path="/1004D" element={<Form1004D />} />
            <Route path="/scenario2" element={<Scenario2 />} />
            <Route path="/history" element={<History />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Route>
        </Routes>
      </ThemeContextProvider>
    </>
  );
}

export default App;
