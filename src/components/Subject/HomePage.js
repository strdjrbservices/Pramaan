import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Paper,
  Button,
  Typography,
  Stack,
  Box,
  Divider
} from '@mui/material';

const HomePage = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    setUsername(localStorage.getItem('username') || '');
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(-45deg, #ea6666, #000000, #f200ff, #23d5ab)',
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite',
        '@keyframes gradient': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          width: '100%',
          maxWidth: 900,
          textAlign: 'center',
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Appraisal Tools
        </Typography>

        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
          Welcome{username && `, ${username}`}
        </Typography>

        <Divider sx={{ mb: 4 }} />

        {/* PRIMARY WORKFLOW */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Review Workflows
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
          sx={{ mb: 4 }}
        >
          <Button
            component={Link}
            to="/extractor"
            variant="contained"
            size="large"
          >
            Full File Review 
          </Button>

          <Button
            component={Link}
            to="/response"
            variant="contained"
            color="info"
            size="large"
            target="_blank"
            rel="noopener noreferrer"
          >
            Revised File Review
          </Button>
        </Stack>

        {/* SECONDARY TOOLS */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Utilities
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
        >
          <Button
            component={Link}
            to="/query"
            variant="contained"
            color="secondary"
            size="large"
            target="_blank"
            rel="noopener noreferrer"
          >
            Custom Query
          </Button>

          <Button
            component={Link}
            to="/1004D"
            variant="contained"
            color="success"
            size="large"
            target="_blank"
            rel="noopener noreferrer"
          >
            1004D
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default HomePage;
