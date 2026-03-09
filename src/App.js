import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';

// Context
import { ThemeContextProvider } from './context/ThemeContext';

// UI Components
import { IconButton } from '@mui/material';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import DescriptionIcon from '@mui/icons-material/Description';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import SearchIcon from '@mui/icons-material/Search';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import HistoryIcon from '@mui/icons-material/History';
import AssignmentIcon from '@mui/icons-material/Assignment';

// Auth Components
import Login from './components/Subject/Login';
import Register from './components/Subject/Register';
import ProtectedRoute from './components/ProtectedRoute';

// Layout & Common Components
import FloatingMenu from './components/Subject/FloatingMenu';
import DJRBLogo from './components/Subject/logo';
import ErrorBoundary from './components/ErrorBoundary';
import NotFound from './components/NotFound';

// Feature Components / Pages
import HomePage from './components/Subject/HomePage';
import Subject from './components/Subject/subject';
import CustomQuery from './components/Subject/CustomQuery';
import Compare from './components/Subject/Compare';
import HtmlExtractor from './components/Subject/HtmlExtractor';
import Form1004D from './components/Subject/1004D';
import History from './components/Subject/History';
import Guide from './components/Subject/Guide';
import ContactUs from './components/Subject/ContactUs';
import TermsOfService from './components/Subject/TermsOfService';
import PrivacyPolicy from './components/Subject/PrivacyPolicy';

// Scenarios
import Scenario2 from './components/updatedformtype/Scenario2';
import Scenario3 from './components/updatedformtype/Scenario3';
import Scenario4 from './components/updatedformtype/Scenario4';
// import Scenario5 from './components/updatedformtype/Scenario5';
// import Scenario6 from './components/updatedformtype/Scenario6';

function App() {
  // --- Hooks ---
  const location = useLocation();
  const navigate = useNavigate();
  const menuButtonRef = useRef(null);

  // --- State ---
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [menuOpen, setMenuOpen] = useState(false);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('isAuthenticated', String(isAuthenticated));
  }, [isAuthenticated]);

  // --- Handlers ---
  const handleLogout = () => {
    setMenuOpen(false);
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    navigate('/login', { replace: true });
  };

  // --- Helpers ---
  const hideHeader = location.pathname === '/login';

  const navItems = [
    { label: 'Full Review', path: '/extractor', icon: <DescriptionIcon /> },
    { label: 'Revised Review', path: '/compare', icon: <CompareArrowsIcon /> },
    { label: 'Custom Query', path: '/query', icon: <SearchIcon /> },
    { label: '1004D', path: '/1004D', icon: <AssignmentTurnedInIcon /> },
    { label: 'Scenario', path: '/scenario2', icon: <AssignmentIcon /> },
    { label: 'History', path: '/history', icon: <HistoryIcon /> },
  ];

  return (
    <ErrorBoundary>
      {/* Floating Menu Button */}
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

      {/* Floating Menu Component */}
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
        <Routes>
          {/* Public Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
          <Route path="/contact" element={<ContactUs />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route path='/logo' element={<DJRBLogo />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/extractor" element={<Subject />} />
            <Route path="/query" element={<CustomQuery />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/html-extractor" element={<HtmlExtractor />} />
            <Route path="/1004D" element={<Form1004D />} />
            
            {/* Scenarios */}
            <Route path="/scenario2" element={<Scenario2 />} />
            <Route path="/scenario3" element={<Scenario3 />} />
            <Route path="/scenario4" element={<Scenario4 />} />
            {/* <Route path="/scenario5" element={<Scenario5 />} />
            <Route path="/scenario6" element={<Scenario6 />} /> */}
            
            <Route path="/history" element={<History />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeContextProvider>
    </ErrorBoundary>
  );
}

export default App;
