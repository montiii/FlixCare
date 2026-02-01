import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  CircularProgress,
  InputAdornment,
  IconButton,
  Fade,
  Slide,
} from '@mui/material';
import { Lock, Visibility, VisibilityOff, BabyChangingStation } from '@mui/icons-material';
import { useTranslation } from '../i18n/TranslationContext';
import axios from 'axios';

interface LoginProps {
  onLogin: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export default function Login({ onLogin }: LoginProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const t = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create Basic Auth credentials with hardcoded username
      const username = 'flixcare';
      const credentials = btoa(`${username}:${password}`);

      // Try to authenticate with backend
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        {},
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (response.data.status === 'success') {
        // Store credentials and auth state
        localStorage.setItem('flixcare_credentials', credentials);
        localStorage.setItem('flixcare_authenticated', 'true');
        localStorage.setItem('flixcare_auth_time', Date.now().toString());
        onLogin();
      } else {
        setError(t.auth.wrongPassword);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(t.auth.wrongPassword);
    } finally {
      setLoading(false);
      setPassword('');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(60px)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-50%',
          left: '-10%',
          width: '600px',
          height: '600px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%',
          filter: 'blur(80px)',
        },
      }}
    >
      <Container maxWidth="sm">
        <Slide direction="down" in={true} timeout={800}>
          <Card
            sx={{
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              backdropFilter: 'blur(10px)',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 4,
              border: '1px solid rgba(255, 255, 255, 0.18)',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
              <Fade in={true} timeout={1000}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  {/* Baby Icon mit Animation */}
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      margin: '0 auto 20px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                      animation: 'pulse 2s ease-in-out infinite',
                      '@keyframes pulse': {
                        '0%, 100%': {
                          transform: 'scale(1)',
                          boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                        },
                        '50%': {
                          transform: 'scale(1.05)',
                          boxShadow: '0 15px 40px rgba(102, 126, 234, 0.6)',
                        },
                      },
                    }}
                  >
                    <BabyChangingStation sx={{ fontSize: 60, color: 'white' }} />
                  </Box>

                  <Typography
                    variant="h3"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1,
                    }}
                  >
                    FlixCare
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                    Baby Tracking App
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, opacity: 0.7 }}>
                    Melde dich an, um fortzufahren
                  </Typography>
                </Box>
              </Fade>

              {error && (
                <Fade in={true}>
                  <Alert
                    severity="error"
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      '& .MuiAlert-icon': {
                        fontSize: 24,
                      },
                    }}
                  >
                    {error}
                  </Alert>
                </Fade>
              )}

              <form onSubmit={handleSubmit}>

                <TextField
                  label="Passwort"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                  autoFocus
                  disabled={loading}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          disabled={loading}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 2,
                      '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main',
                        },
                      },
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      fontWeight: 500,
                    },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.8,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #6a4291 100%)',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                      transform: 'translateY(-2px)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={26} sx={{ color: 'white' }} />
                  ) : (
                    'Anmelden'
                  )}
                </Button>
              </form>

              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  borderRadius: 2,
                  textAlign: 'center',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                }}
              >
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  Standard-Passwort
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  flixcare123
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5, fontSize: '0.7rem' }}>
                  Änderbar via Umgebungsvariablen
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Slide>
      </Container>
    </Box>
  );
}
