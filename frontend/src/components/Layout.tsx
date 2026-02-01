import {
  AppBar,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Paper,
  IconButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Restaurant as RestaurantIcon,
  Thermostat as ThermostatIcon,
  CleaningServices as CleaningServicesIcon,
  Scale as ScaleIcon,
  Settings as SettingsIcon,
  Medication as MedicationIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../i18n/TranslationContext';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const t = useTranslation();

  const navigationItems = [
    { label: t.nav.home, icon: <DashboardIcon />, path: '/dashboard' },
    { label: t.nav.feed, icon: <RestaurantIcon />, path: '/feeding' },
    { label: t.nav.weight, icon: <ScaleIcon />, path: '/weight' },
    { label: t.nav.temp, icon: <ThermostatIcon />, path: '/temperature' },
    { label: t.nav.clean, icon: <CleaningServicesIcon />, path: '/cleaning' },
    { label: t.nav.medication, icon: <MedicationIcon />, path: '/medication' },
  ];

  // Config als separates Item für Desktop
  const configItem = { label: t.nav.config, icon: <SettingsIcon />, path: '/config' };

  const getCurrentIndex = () => {
    const index = navigationItems.findIndex(item => item.path === location.pathname);
    return index >= 0 ? index : 0;
  };

  const handleNavigationChange = (_event: React.SyntheticEvent, newValue: number) => {
    navigate(navigationItems[newValue].path);
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100%',
      pb: isMobile ? 7 : 0 // padding for bottom nav on mobile
    }}>
      {/* Top App Bar */}
      <AppBar
        position="fixed"
        sx={{
          top: 0,
          bgcolor: 'primary.main',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            👶 {t.appName}
          </Typography>
          {isMobile && (
            <IconButton color="inherit" onClick={() => navigate('/config')}>
              <SettingsIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 9, sm: 10, md: 17 }, // Mobile: 72px, Small: 80px, Desktop: 136px (AppBar + Secondary Nav)
          pb: isMobile ? 2 : 3,
          px: { xs: 1, sm: 2, md: 3 },
          maxWidth: '100%',
          width: '100%',
          overflowX: 'hidden',
        }}
      >
        {children}
      </Box>

      {/* Bottom Navigation - Mobile Only */}
      {isMobile && (
        <Paper
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            boxShadow: '0px -2px 10px rgba(0,0,0,0.1)',
          }}
          elevation={3}
        >
          <BottomNavigation
            value={getCurrentIndex()}
            onChange={handleNavigationChange}
            showLabels
            sx={{
              height: 70,
              '& .MuiBottomNavigationAction-root': {
                minWidth: 'auto',
                padding: '4px 8px',
              },
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.65rem',
                '&.Mui-selected': {
                  fontSize: '0.7rem',
                  fontWeight: 600,
                },
              },
              '& .MuiSvgIcon-root': {
                fontSize: '1.5rem',
              },
            }}
          >
            {navigationItems.map((item, index) => (
              <BottomNavigationAction
                key={index}
                label={item.label}
                icon={item.icon}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}

      {/* Desktop Navigation - Keep simple top nav */}
      {!isMobile && (
        <Paper
          sx={{
            position: 'fixed',
            top: 64,
            left: 0,
            right: 0,
            zIndex: 999,
            boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, py: 1 }}>
            {[...navigationItems, configItem].map((item) => (
              <Box
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: '8px 16px',
                  borderRadius: 2,
                  bgcolor: location.pathname === item.path ? 'primary.light' : 'transparent',
                  color: location.pathname === item.path ? 'primary.contrastText' : 'text.primary',
                  '&:hover': {
                    bgcolor: location.pathname === item.path ? 'primary.light' : 'action.hover',
                  },
                }}
              >
                {item.icon}
                <Typography variant="caption" sx={{ mt: 0.5 }}>
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
}
