import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Subject from './components/Subject/subject';
import CustomQuery from './components/Subject/CustomQuery';
import HomePage from './components/Subject/HomePage';
import Compare from './components/Subject/Compare';
import HtmlExtractor from './components/Subject/HtmlExtractor';
import Form1004D from './components/Subject/1004D';
import Login from './components/Subject/Login';
import ProtectedRoute from './components/ProtectedRoute';

import {
  Box,
  Button,
  IconButton,
  Avatar,
  Typography,
  ClickAwayListener,
  Paper,
  Fade,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import DescriptionIcon from '@mui/icons-material/Description';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import SearchIcon from '@mui/icons-material/Search';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

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
            background: 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            '&:hover': { background: 'rgba(255,255,255,0.8)' },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* FLOATING MENU */}
      {!hideHeader && (
        <Fade in={menuOpen}>
          <Box
            sx={{
              position: 'fixed',
              top: 80,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1400,
            }}
          >
            <ClickAwayListener onClickAway={(event) => {
              if (menuButtonRef.current && menuButtonRef.current.contains(event.target)) {
                return;
              }
              setMenuOpen(false);
            }}>
              <Paper
                elevation={8}
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 3,
                  backdropFilter: 'blur(12px)',
                  background: 'rgba(255,255,255,0.75)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                {/* NAV LINKS */}
                {navItems.map(({ label, path, icon }) => (
                  <Button
                    key={path}
                    component={Link}
                    to={path}
                    onClick={() => setMenuOpen(false)}
                    startIcon={icon}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      color: '#333',
                      borderRadius: 2,
                      '&:hover': { background: 'rgba(0,0,0,0.05)' },
                    }}
                  >
                    {label}
                  </Button>
                ))}

                {/* USER */}
                {isAuthenticated && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
                    <Avatar sx={{ width: 30, height: 30 }}>
                      {localStorage.getItem('username')?.[0]?.toUpperCase()}
                    </Avatar>
                    <Typography fontSize="0.85rem" fontWeight={600}>
                      {localStorage.getItem('username')}
                    </Typography>
                    <IconButton size="small" onClick={handleLogout}>
                      <LogoutIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Paper>
            </ClickAwayListener>
          </Box>
        </Fade>
      )}

      {/* ROUTES */}
      <Routes>
        <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/extractor" element={<Subject />} />
          <Route path="/query" element={<CustomQuery />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/html-extractor" element={<HtmlExtractor />} />
          <Route path="/1004D" element={<Form1004D />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
