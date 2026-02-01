import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import FeedingRecords from './pages/FeedingRecords';
import TemperatureRecords from './pages/TemperatureRecords';
import CleaningRecords from './pages/CleaningRecords';
import WeightRecords from './pages/WeightRecords';
import MedicationRecords from './pages/MedicationRecords';
import Configuration from './pages/Configuration';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const authenticated = localStorage.getItem('flixcare_authenticated') === 'true';
    const authTime = localStorage.getItem('flixcare_auth_time');

    // Session expires after 24 hours
    if (authenticated && authTime) {
      const hoursSinceAuth = (Date.now() - parseInt(authTime)) / (1000 * 60 * 60);
      if (hoursSinceAuth < 24) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('flixcare_authenticated');
        localStorage.removeItem('flixcare_auth_time');
      }
    }
    setIsChecking(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (isChecking) {
    return null; // or a loading spinner
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/feeding" element={<FeedingRecords />} />
          <Route path="/weight" element={<WeightRecords />} />
          <Route path="/temperature" element={<TemperatureRecords />} />
          <Route path="/cleaning" element={<CleaningRecords />} />
          <Route path="/medication" element={<MedicationRecords />} />
          <Route path="/config" element={<Configuration />} />
        </Routes>
      </Layout>
    </Box>
  );
}

export default App;
