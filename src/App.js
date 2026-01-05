import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Subject from './components/Subject/subject.js';
import CustomQuery from './components/Subject/CustomQuery.js';
import HomePage from './components/Subject/HomePage.js';
import Compare from './components/Subject/Compare.js';
import './App.css';
import HtmlExtractor from './components/Subject/HtmlExtractor.js';
import Form1004D from './components/Subject/1004D.js';
import Login from './components/Subject/Login';
import ProtectedRoute from './components/ProtectedRoute.js';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import LogoutIcon from '@mui/icons-material/Logout';
import DescriptionIcon from '@mui/icons-material/Description';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import SearchIcon from '@mui/icons-material/Search';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <>
      {location.pathname !== '/login' && (
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            maxwidth: '800px !important',
            position: 'fixed',
            width: 800,
            height: 64,
            marginLeft: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backdropFilter: 'blur(0px)',     // ✅ blur only
            background: 'none',               // ✅ NO background
            boxShadow: 'none',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
          }}
        >
          <Toolbar
            disableGutters
            sx={{
              minHeight: 64,
              px: 2,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* Center Navigation */}
            {location.pathname !== '/' && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  mx: 'auto',
                  p: 0.5,
                  borderRadius: 3,
                }}
              >
                {[
                  { label: 'Full Review', path: '/extractor', icon: <DescriptionIcon /> },
                  { label: 'Revised Review', path: '/compare', icon: <CompareArrowsIcon /> },
                  { label: 'Custom Query', path: '/query', icon: <SearchIcon /> },
                  { label: '1004D', path: '/1004D', icon: <AssignmentTurnedInIcon /> },
                ].map(({ label, path, icon }) => {
                  const active = location.pathname === path;

                  return (
                    <Button
                      key={path}
                      component={Link}
                      to={path}
                      target="_blank"
                      rel="noopener noreferrer"
                      startIcon={icon}
                      sx={{
                        height: 40,
                        px: 2,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        background: 'none',      // ✅ NO bg
                        color: active ? 'primary.main' : '#555',
                        transition: 'all 0.25s ease',
                        '&:hover': {
                          background: 'rgba(0,0,0,0.04)',
                        },
                      }}
                    >
                      {label}
                    </Button>
                  );
                })}
              </Box>
            )}

            {/* User Profile */}
            {isAuthenticated && (
              <Box
                sx={{
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.5,
                  borderRadius: 99,
                }}
              >
                <Avatar
                  sx={{
                    width: 30,
                    height: 30,
                    bgcolor: 'primary.main',
                    fontSize: '0.85rem',
                  }}
                >
                  {localStorage.getItem('username')?.charAt(0).toUpperCase()}
                </Avatar>

                <Typography variant="body2" fontWeight={600} color="#000">
                  {localStorage.getItem('username')}
                </Typography>

                <IconButton size="small" onClick={handleLogout}>
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </AppBar>
      )}




      <div className={location.pathname !== '/login' ? "main-container" : ""}> <Routes>
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
      </div>
      {/* <Box
        sx={{
          position: 'fixed',
          bottom: 6,
          right: 12,
          zIndex: 9999,
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(6px)',
          borderRadius: '12px',
          padding: '6px 14px',
          fontSize: '0.75rem',
          color: '#444',
          boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
          pointerEvents: 'none',
          border: '1px solid rgba(255,255,255,0.4)',
          animation: 'fadeInOut 4s ease-in-out infinite',

          '@keyframes fadeInOut': {
            '0%': { opacity: 0, transform: 'translateY(10px)' },
            '20%': { opacity: 1, transform: 'translateY(0)' },
            '80%': { opacity: 1, transform: 'translateY(0)' },
            '100%': { opacity: 0, transform: 'translateY(10px)' }
          }
        }}
      >
        Developed by <strong></strong>
      </Box> */}


    </>
  );
}

export default App;
