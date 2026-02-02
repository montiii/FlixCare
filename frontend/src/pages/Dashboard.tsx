import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  CircularProgress,
  Alert,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from '@mui/material';
import {
  Restaurant,
  Thermostat,
  CleaningServices,
  AccessTime,
  Medication,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../i18n/TranslationContext';
import { babyService } from '../services/babyService';
import { feedingRecordService } from '../services/feedingRecordService';
import { temperatureRecordService } from '../services/temperatureRecordService';
import { cleaningRecordService } from '../services/cleaningRecordService';
import { medicationRecordService } from '../services/medicationRecordService';
import { weightRecordService } from '../services/weightRecordService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { WeightRecord, CleaningRecord } from '../types';

interface DashboardStats {
  babyName: string;
  babyAge: string;
  lastFeeding: string;
  lastTemp: string;
  lastDiaperChange: string;
  lastBath: string;
  lastSpongeBath: string;
  lastVitaminD: string;
  lastEyeCleaning: string;
  todayFeedings: number;
  todayDiaperChanges: number;
}

interface WeightChartData {
  date: string;
  weight: number;
}

interface DiaperChartData {
  date: string;
  nass: number;
  voll: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    babyName: 'Baby',
    babyAge: '',
    lastFeeding: 'Keine Einträge',
    lastTemp: 'Keine Einträge',
    lastDiaperChange: 'Keine Einträge',
    lastBath: 'Keine Einträge',
    lastSpongeBath: 'Keine Einträge',
    lastVitaminD: 'Keine Einträge',
    lastEyeCleaning: 'Keine Einträge',
    todayFeedings: 0,
    todayDiaperChanges: 0,
  });
  const [weightData, setWeightData] = useState<WeightChartData[]>([]);
  const [weightRange, setWeightRange] = useState<'last10' | 'all'>('last10');
  const [diaperData, setDiaperData] = useState<DiaperChartData[]>([]);
  const [diaperAverage, setDiaperAverage] = useState({ nass: 0, voll: 0 });
  const [diaperRange, setDiaperRange] = useState<'5days' | '2weeks'>('5days');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const t = useTranslation();

  const quickActions = [
    { icon: <Restaurant />, name: t.nav.feed, path: '/feeding', color: '#4caf50' },
    { icon: <Thermostat />, name: t.nav.temp, path: '/temperature', color: '#ff9800' },
    { icon: <CleaningServices />, name: t.nav.clean, path: '/cleaning', color: '#2196f3' },
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    // Reload weight data when range changes
    const reloadWeights = async () => {
      try {
        const weights = await weightRecordService.getAll();
        processWeightData(weights);
      } catch (err) {
        console.error('Failed to reload weights:', err);
      }
    };
    reloadWeights();
  }, [weightRange]);

  useEffect(() => {
    // Reload diaper data when range changes
    const reloadDiapers = async () => {
      try {
        const cleanings = await cleaningRecordService.getAll();
        const sorted = [...cleanings].sort((a, b) =>
          new Date(b.cleaningTime).getTime() - new Date(a.cleaningTime).getTime()
        );
        processDiaperData(sorted);
      } catch (err) {
        console.error('Failed to reload diapers:', err);
      }
    };
    reloadDiapers();
  }, [diaperRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [babies, feedings, temperatures, cleanings, medications, weights] = await Promise.all([
        babyService.getAll(),
        feedingRecordService.getAll(),
        temperatureRecordService.getAll(),
        cleaningRecordService.getAll(),
        medicationRecordService.getAll(),
        weightRecordService.getAll(),
      ]);

      // Get or create single baby
      let baby = babies[0];
      if (!baby) {
        baby = await babyService.create({
          name: 'My Baby',
          birthDate: new Date().toISOString().split('T')[0],
          gender: '',
          notes: '',
        });
      }

      // Sort by date descending (newest first)
      const sortedFeedings = [...feedings].sort((a, b) =>
        new Date(b.feedingTime).getTime() - new Date(a.feedingTime).getTime()
      );
      const sortedTemperatures = [...temperatures].sort((a, b) =>
        new Date(b.measurementTime).getTime() - new Date(a.measurementTime).getTime()
      );
      const sortedCleanings = [...cleanings].sort((a, b) =>
        new Date(b.cleaningTime).getTime() - new Date(a.cleaningTime).getTime()
      );
      const sortedMedications = [...medications].sort((a, b) =>
        new Date(b.medicationTime).getTime() - new Date(a.medicationTime).getTime()
      );

      const age = calculateAge(baby.birthDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayFeedings = sortedFeedings.filter(f => new Date(f.feedingTime) >= today).length;

      // Separate cleaning categories
      const diaperChanges = sortedCleanings.filter(c => c.cleaningType === 'DIAPER_CHANGE');
      const todayDiaperChanges = diaperChanges.filter(c => new Date(c.cleaningTime) >= today).length;

      const baths = sortedCleanings.filter(c => c.cleaningType === 'BATH');
      const spongeBaths = sortedCleanings.filter(c => c.cleaningType === 'SPONGE_BATH');

      const lastFeeding = sortedFeedings.length > 0 ? formatTimeAgo(sortedFeedings[0].feedingTime) : t.dashboard.noRecords;
      const lastTemp = sortedTemperatures.length > 0
        ? `${sortedTemperatures[0].temperatureCelsius}°C ${formatTimeAgo(sortedTemperatures[0].measurementTime)}`
        : t.dashboard.noRecords;

      const lastDiaperChange = diaperChanges.length > 0 ? formatTimeAgo(diaperChanges[0].cleaningTime) : t.dashboard.noRecords;
      const lastBath = baths.length > 0 ? formatTimeAgo(baths[0].cleaningTime) : t.dashboard.noRecords;
      const lastSpongeBath = spongeBaths.length > 0 ? formatTimeAgo(spongeBaths[0].cleaningTime) : t.dashboard.noRecords;

      // Separate medication categories
      const vitaminDMedications = sortedMedications.filter(m => m.medicationType === 'VITAMIN_D');
      const eyeCleaningMedications = sortedMedications.filter(m => m.medicationType === 'EYE_CLEANING');

      const lastVitaminD = vitaminDMedications.length > 0 ? formatTimeAgo(vitaminDMedications[0].medicationTime) : t.dashboard.noRecords;
      const lastEyeCleaning = eyeCleaningMedications.length > 0 ? formatTimeAgo(eyeCleaningMedications[0].medicationTime) : t.dashboard.noRecords;

      setStats({
        babyName: baby.name,
        babyAge: age,
        lastFeeding,
        lastTemp,
        lastDiaperChange,
        lastBath,
        lastSpongeBath,
        lastVitaminD,
        lastEyeCleaning,
        todayFeedings,
        todayDiaperChanges,
      });

      // Process weight data for chart
      processWeightData(weights);

      // Process diaper data for chart
      processDiaperData(sortedCleanings);

      setError(null);
    } catch (err) {
      setError(t.common.failedToLoad);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return '';
    const birth = new Date(birthDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) return `${diffDays} ${t.dashboard.daysOld}`;
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${t.dashboard.monthsOld}`;
    }
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    return `${years}J ${months}M`;
  };

  const formatTimeAgo = (dateTime: string) => {
    // Backend liefert UTC-Zeit ohne 'Z': "2026-02-01T08:33:00"
    // JavaScript interpretiert das als lokale Zeit!
    // Lösung: 'Z' anhängen wenn es fehlt
    const utcDateTime = dateTime.endsWith('Z') ? dateTime : dateTime + 'Z';

    const now = new Date();
    const time = new Date(utcDateTime);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    // Format time as HH:MM (lokale Zeit)
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes} Uhr`;

    // Add relative time
    if (diffMins < 1) return `${timeStr} (${t.dashboard.justNow})`;
    if (diffMins < 60) return `${timeStr} (${diffMins} ${t.dashboard.minutesAgo})`;
    if (diffHours < 24) return `${timeStr} (${diffHours} ${t.dashboard.hoursAgo})`;
    if (diffDays === 1) return `${timeStr} (${t.dashboard.yesterday})`;
    return `${timeStr} (${diffDays} ${t.dashboard.daysAgo})`;
  };

  const processWeightData = (weights: WeightRecord[]) => {
    if (weights.length === 0) {
      setWeightData([]);
      return;
    }

    // Sort by date ascending
    const sorted = [...weights].sort((a, b) =>
      new Date(a.measurementTime).getTime() - new Date(b.measurementTime).getTime()
    );

    // Get measurements based on selected range
    const measurements = weightRange === 'last10' ? sorted.slice(-10) : sorted;

    // Format data for chart
    const chartData: WeightChartData[] = measurements.map(w => {
      const date = new Date(w.measurementTime);
      const dateStr = `${date.getDate()}.${date.getMonth() + 1}.`;
      return {
        date: dateStr,
        weight: w.weightGrams,
      };
    });

    setWeightData(chartData);
  };

  const processDiaperData = (cleanings: CleaningRecord[]) => {
    // Filter nur Windelwechsel
    const diaperChanges = cleanings.filter(c => c.cleaningType === 'DIAPER_CHANGE');

    if (diaperChanges.length === 0) {
      setDiaperData([]);
      setDiaperAverage({ nass: 0, voll: 0 });
      return;
    }

    // Anzahl der Tage basierend auf Auswahl
    const now = new Date();
    const daysToShow = diaperRange === '5days' ? 5 : 14;
    const days: Date[] = [];

    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      days.push(date);
    }

    let totalNass = 0;
    let totalVoll = 0;

    // Zähle pro Tag
    const chartData: DiaperChartData[] = days.map(day => {
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);

      const dayDiapers = diaperChanges.filter(d => {
        const diaperDate = new Date(d.cleaningTime);
        return diaperDate >= day && diaperDate < nextDay;
      });

      let nass = 0;
      let voll = 0;

      dayDiapers.forEach(d => {
        if (d.diaperContent === 'WET') {
          nass++;
        } else if (d.diaperContent === 'DIRTY') {
          voll++;
        } else if (d.diaperContent === 'BOTH') {
          // "Beide" wird in beiden Kategorien gezählt
          nass++;
          voll++;
        }
      });

      totalNass += nass;
      totalVoll += voll;

      const dateStr = `${day.getDate()}.${day.getMonth() + 1}.`;
      return {
        date: dateStr,
        nass,
        voll,
      };
    });

    // Berechne Durchschnittswerte
    const avgNass = daysToShow > 0 ? Math.round((totalNass / daysToShow) * 10) / 10 : 0;
    const avgVoll = daysToShow > 0 ? Math.round((totalVoll / daysToShow) * 10) / 10 : 0;

    setDiaperData(chartData);
    setDiaperAverage({ nass: avgNass, voll: avgVoll });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ pb: 4 }}>
      <Card
        sx={{
          mb: 2,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            {stats.babyName}
          </Typography>
          {stats.babyAge && (
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              {stats.babyAge}
            </Typography>
          )}
        </CardContent>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            {t.dashboard.todaySummary}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary">{stats.todayFeedings}</Typography>
              <Typography variant="body2" color="text.secondary">{t.dashboard.feedings}</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary">{stats.todayDiaperChanges}</Typography>
              <Typography variant="body2" color="text.secondary">Windeln</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            <AccessTime sx={{ verticalAlign: 'middle', mr: 1 }} />
            {t.dashboard.recentActivity}
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
              <Restaurant sx={{ mr: 2, color: '#4caf50', fontSize: 32 }} />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{t.dashboard.feeding}</Typography>
                <Typography variant="body2" color="text.secondary">{stats.lastFeeding}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
              <Thermostat sx={{ mr: 2, color: '#ff9800', fontSize: 32 }} />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{t.dashboard.temperature}</Typography>
                <Typography variant="body2" color="text.secondary">{stats.lastTemp}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
              <CleaningServices sx={{ mr: 2, color: '#2196f3', fontSize: 32 }} />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>🧷 Windel</Typography>
                <Typography variant="body2" color="text.secondary">{stats.lastDiaperChange}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
              <CleaningServices sx={{ mr: 2, color: '#00bcd4', fontSize: 32 }} />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>🛁 Baden</Typography>
                <Typography variant="body2" color="text.secondary">{stats.lastBath}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
              <CleaningServices sx={{ mr: 2, color: '#009688', fontSize: 32 }} />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>🧽 Waschen</Typography>
                <Typography variant="body2" color="text.secondary">{stats.lastSpongeBath}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
              <Medication sx={{ mr: 2, color: '#ff9800', fontSize: 32 }} />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>☀️ Vitamin D</Typography>
                <Typography variant="body2" color="text.secondary">{stats.lastVitaminD}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Medication sx={{ mr: 2, color: '#00bcd4', fontSize: 32 }} />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>👁️ Augenreinigung</Typography>
                <Typography variant="body2" color="text.secondary">{stats.lastEyeCleaning}</Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Weight Chart */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              ⚖️ Gewichtsentwicklung
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Box
                onClick={() => setWeightRange('last10')}
                sx={{
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  cursor: 'pointer',
                  bgcolor: weightRange === 'last10' ? 'primary.main' : 'grey.200',
                  color: weightRange === 'last10' ? 'white' : 'text.primary',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                }}
              >
                Letzte 10
              </Box>
              <Box
                onClick={() => setWeightRange('all')}
                sx={{
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  cursor: 'pointer',
                  bgcolor: weightRange === 'all' ? 'primary.main' : 'grey.200',
                  color: weightRange === 'all' ? 'white' : 'text.primary',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                }}
              >
                Alle
              </Box>
            </Box>
          </Box>
          {weightData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weightData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  style={{ fontSize: '0.75rem' }}
                />
                <YAxis
                  domain={['dataMin - 100', 'dataMax + 100']}
                  style={{ fontSize: '0.75rem' }}
                  label={{ value: 'Gramm', angle: -90, position: 'insideLeft', style: { fontSize: '0.75rem' } }}
                />
                <Tooltip
                  formatter={(value: number) => [`${value} g`, 'Gewicht']}
                  contentStyle={{ fontSize: '0.875rem' }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#1976d2"
                  strokeWidth={2}
                  dot={{ fill: '#1976d2', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Noch keine Gewichtsdaten vorhanden
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Diaper Chart */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              🧷 Windel-Statistik
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Box
                onClick={() => setDiaperRange('5days')}
                sx={{
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  cursor: 'pointer',
                  bgcolor: diaperRange === '5days' ? 'primary.main' : 'grey.200',
                  color: diaperRange === '5days' ? 'white' : 'text.primary',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                }}
              >
                5 Tage
              </Box>
              <Box
                onClick={() => setDiaperRange('2weeks')}
                sx={{
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  cursor: 'pointer',
                  bgcolor: diaperRange === '2weeks' ? 'primary.main' : 'grey.200',
                  color: diaperRange === '2weeks' ? 'white' : 'text.primary',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                }}
              >
                2 Wochen
              </Box>
            </Box>
          </Box>

          {diaperData.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">Ø Nass</Typography>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#2196f3' }}>
                  {diaperAverage.nass}
                </Typography>
                <Typography variant="caption" color="text.secondary">pro Tag</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">Ø Voll</Typography>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#ff9800' }}>
                  {diaperAverage.voll}
                </Typography>
                <Typography variant="caption" color="text.secondary">pro Tag</Typography>
              </Box>
            </Box>
          )}

          {diaperData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={diaperData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  style={{ fontSize: '0.75rem' }}
                />
                <YAxis
                  allowDecimals={false}
                  style={{ fontSize: '0.75rem' }}
                  label={{ value: 'Anzahl', angle: -90, position: 'insideLeft', style: { fontSize: '0.75rem' } }}
                />
                <Tooltip
                  contentStyle={{ fontSize: '0.875rem' }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '0.875rem' }}
                />
                <Bar
                  dataKey="nass"
                  fill="#2196f3"
                  name="Nass"
                />
                <Bar
                  dataKey="voll"
                  fill="#ff9800"
                  name="Voll"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Noch keine Windeldaten vorhanden
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <SpeedDial
        ariaLabel="Quick Actions"
        sx={{
          position: 'fixed',
          bottom: { xs: 85, md: 20 },
          right: 20,
          '& .MuiFab-primary': {
            width: 64,
            height: 64,
          }
        }}
        icon={<SpeedDialIcon />}
      >
        {quickActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => navigate(action.path)}
            sx={{
              '& .MuiSpeedDialAction-fab': {
                bgcolor: action.color,
                '&:hover': { bgcolor: action.color, filter: 'brightness(0.9)' },
              },
            }}
          />
        ))}
      </SpeedDial>
    </Container>
  );
}
 