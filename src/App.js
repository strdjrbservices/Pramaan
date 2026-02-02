import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThemeContextProvider } from './context/ThemeContext'; // Import the provider

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
import Grow from '@mui/material/Grow';

import {
  Box,
  Button,
  IconButton,
  Avatar,
  Typography,
  ClickAwayListener,
  Paper,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
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
        <Grow in={menuOpen} transformOrigin="top right">
          <Box
            sx={{
              position: 'fixed',
              top: 16,
              right: 88,
              zIndex: 1400,
            }}
          >
            <ClickAwayListener
              onClickAway={(event) => {
                if (
                  menuButtonRef.current &&
                  menuButtonRef.current.contains(event.target)
                ) {
                  return;
                }
                setMenuOpen(false);
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  px: 2,
                  py: 1.5,
                  borderRadius: 4,
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.65))',
                  backdropFilter: 'blur(18px)',
                  boxShadow:
                    '0 20px 40px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                  minWidth: 240,
                }}
              >
                {/* NAV LINKS */}
                {navItems.map(({ label, path, icon }) => {
                  const isActive = location.pathname === path;

                  return (
                    <Button
                      key={path}
                      component="a"
                      href={path}
                      target={path === '/history' ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      onClick={() => setMenuOpen(false)}
                      startIcon={
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'all 0.3s ease',
                            transform: isActive ? 'scale(1.15)' : 'scale(1)',
                          }}
                        >
                          {icon}
                        </Box>
                      }
                      sx={{
                        position: 'relative',
                        justifyContent: 'flex-start',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        borderRadius: 3,
                        px: 2,
                        py: 1,
                        color: isActive ? '#1976d2' : '#222',
                        background: isActive
                          ? 'linear-gradient(90deg, rgba(25,118,210,0.18), transparent)'
                          : 'transparent',
                        transition: 'all 0.25s ease',

                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: 6,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 4,
                          height: isActive ? 22 : 0,
                          borderRadius: 4,
                          background: '#1976d2',
                          transition: 'height 0.25s ease',
                        },

                        '&:hover': {
                          background: 'rgba(25,118,210,0.1)',
                          transform: 'translateX(6px)',
                          '& svg': {
                            transform: 'rotate(-8deg) scale(1.2)',
                          },
                        },
                      }}
                    >
                      {label}
                    </Button>
                  );
                })}

                {/* USER */}
                {isAuthenticated && (
                  <Box
                    sx={{
                      mt: 1.5,
                      pt: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      borderTop: '1px solid rgba(0,0,0,0.08)',
                    }}
                  >
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {localStorage.getItem('username')?.[0]?.toUpperCase()}
                    </Avatar>
                    <Typography fontSize="0.85rem" fontWeight={600} flexGrow={1}>
                      {localStorage.getItem('username')}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={handleLogout}
                      sx={{
                        transition: 'all 0.25s ease',
                        '&:hover': {
                          transform: 'rotate(-20deg) scale(1.15)',
                        },
                      }}
                    >
                      <LogoutIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Paper>
            </ClickAwayListener>
          </Box>
        </Grow>
      )}
      <ThemeContextProvider>
        {/* ROUTES */}
        <Routes>
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
