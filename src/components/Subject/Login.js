import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Avatar,
  Checkbox,
  FormControlLabel,
  Grid,
  Link as MuiLink,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';

import {
  LockOutlined,
  Visibility,
  VisibilityOff,
  PersonOutline,
} from '@mui/icons-material';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        'https://praman-strdjrbservices.pythonanywhere.com/api/token/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.access);
        localStorage.setItem('username', username);
        onLogin();
        navigate('/');
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Invalid username or password');
      }
    } catch {
      setError('Login failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        backgroundSize: '400% 400%',
        animation: 'gradient 18s ease infinite',
        '@keyframes gradient': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 420,
          p: 4,
          borderRadius: 4,
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.65))',
          backdropFilter: 'blur(20px)',
          boxShadow:
            '0 30px 60px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.4)',
        }}
      >
        <Box textAlign="center">
          <Avatar
            sx={{
              mx: 'auto',
              mb: 1,
              width: 64,
              height: 64,
              background:
                'linear-gradient(135deg, #1976d2, #42a5f5)',
              boxShadow: '0 10px 25px rgba(25,118,210,0.45)',
            }}
          >
            <LockOutlined fontSize="large" />
          </Avatar>

          <Typography variant="h5" fontWeight={700}>
            DJRB Review
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Sign in to continue
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleLogin}>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Username"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  marginBottom: 2,
                },
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((p) => !p)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
            />

            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Remember me"
                />
              </Grid>
              <Grid item>
                <MuiLink href="#" underline="hover">
                  Forgot password?
                </MuiLink>
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                mt: 1,
                py: 1.4,
                fontWeight: 700,
                borderRadius: 3,
                background:
                  'linear-gradient(135deg, #1976d2, #42a5f5)',
                boxShadow: '0 10px 25px rgba(25,118,210,0.45)',
                color: '#000',
                fontStyle: 'normal',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow:
                    '0 15px 35px rgba(25,118,210,0.6)',
                },
              }}
            >
              {loading ? (
                <CircularProgress size={26} color="#000000" />
              ) : (
                'Log In'
              )}
            </Button>

            <Box mt={2} textAlign="center">
              <MuiLink component={Link} to="/contact" underline="hover" color="text.secondary" variant="body2">
                Need help? Contact Us
              </MuiLink>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
