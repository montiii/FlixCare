import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import { Check, Delete, TrendingUp, TrendingDown } from '@mui/icons-material';
import { useTranslation } from '../i18n/TranslationContext';
import { babyService } from '../services/babyService';
import { weightRecordService } from '../services/weightRecordService';
import { WeightRecord } from '../types';

export default function WeightRecords() {
  // Hilfsfunktion: Lokale Zeit im datetime-local Format
  const getLocalDateTimeString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [records, setRecords] = useState<WeightRecord[]>([]);
  const [babyId, setBabyId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weight, setWeight] = useState<string>('');
  const [dateTime, setDateTime] = useState<string>(getLocalDateTimeString());
  const t = useTranslation();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const babies = await babyService.getAll();
      let baby = babies[0];
      if (!baby) {
        baby = await babyService.create({
          name: 'My Baby',
          birthDate: new Date().toISOString().split('T')[0],
          gender: '',
          notes: '',
        });
      }
      setBabyId(baby.id!);
      const weightData = await weightRecordService.getByBabyId(baby.id!);
      setRecords(weightData);
      setError(null);
    } catch (err) {
      setError(t.common.failedToLoad);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!babyId || !weight) return;
    try {
      await weightRecordService.create({
        babyId,
        measurementTime: new Date(dateTime).toISOString(),
        weightGrams: Number(weight),
        notes: '',
      });
      await loadData();
      setWeight('');
      setDateTime(getLocalDateTimeString()); // Reset to current time
    } catch (err) {
      setError(t.common.failedToSave);
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(t.weight.confirmDelete)) {
      try {
        await weightRecordService.delete(id);
        await loadData();
      } catch (err) {
        setError(t.common.failedToSave);
        console.error(err);
      }
    }
  };

  const getTrend = () => {
    if (records.length < 2) return null;
    const latest = records[0].weightGrams;
    const previous = records[1].weightGrams;
    const diff = latest - previous;
    return { diff, increasing: diff > 0 };
  };

  const formatTime = (dateTime: string) => {
    // Backend liefert UTC-Zeit ohne 'Z': "2026-02-01T08:33:00"
    // Lösung: 'Z' anhängen wenn es fehlt
    const utcDateTime = dateTime.endsWith('Z') ? dateTime : dateTime + 'Z';
    const date = new Date(utcDateTime);

    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    // Explizit lokale Zeit-Komponenten extrahieren
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const dateStr = `${day}.${month}.${year}`;

    if (isToday) return `Heute ${timeStr}`;
    if (isYesterday) return `Gestern ${timeStr}`;
    return `${dateStr} ${timeStr}`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  const trend = getTrend();

  return (
    <Container maxWidth="sm" sx={{ pb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        {t.weight.title}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Trend Card */}
      {trend && (
        <Card sx={{ mb: 2, bgcolor: trend.increasing ? '#e8f5e9' : '#fff3e0' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              {trend.increasing ? (
                <TrendingUp sx={{ color: '#4caf50', fontSize: 32 }} />
              ) : (
                <TrendingDown sx={{ color: '#ff9800', fontSize: 32 }} />
              )}
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {t.weight.trend}: {trend.diff > 0 ? '+' : ''}{trend.diff} g
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Input Card */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            {t.weight.logWeight}
          </Typography>

          <TextField
            label="Datum und Uhrzeit"
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <TextField
              label="Gewicht (g)"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              fullWidth
              inputProps={{ min: 0, max: 50000, step: 10 }}
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: '2rem',
                  textAlign: 'center',
                  fontWeight: 600,
                },
              }}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mb: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setWeight('2500')}
              size="large"
            >
              2500 g
            </Button>
            <Button
              variant="outlined"
              onClick={() => setWeight('3000')}
              size="large"
            >
              3000 g
            </Button>
            <Button
              variant="outlined"
              onClick={() => setWeight('3500')}
              size="large"
            >
              3500 g
            </Button>
            <Button
              variant="outlined"
              onClick={() => setWeight('4000')}
              size="large"
            >
              4000 g
            </Button>
            <Button
              variant="outlined"
              onClick={() => setWeight('4500')}
              size="large"
            >
              4500 g
            </Button>
            <Button
              variant="outlined"
              onClick={() => setWeight('5000')}
              size="large"
            >
              5000 g
            </Button>
          </Box>

          <Button
            variant="contained"
            onClick={handleAdd}
            fullWidth
            size="large"
            startIcon={<Check />}
            sx={{ py: 2 }}
          >
            {t.weight.saveWeight}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Records */}
      <Card>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            {t.weight.recentWeights}
          </Typography>
          {records.length === 0 ? (
            <Typography color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
              {t.weight.noRecordsYet}
            </Typography>
          ) : (
            <List dense>
              {records.slice(0, 10).map((record, index) => (
                <ListItem
                  key={record.id}
                  divider
                  secondaryAction={
                    <IconButton edge="end" onClick={() => record.id && handleDelete(record.id)} color="error">
                      <Delete />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {record.weightGrams} g
                        </Typography>
                        {index > 0 && (
                          <Typography variant="caption" color="text.secondary">
                            ({(record.weightGrams - records[index - 1].weightGrams) > 0 ? '+' : ''}
                            {(record.weightGrams - records[index - 1].weightGrams)} g)
                          </Typography>
                        )}
                      </Box>
                    }
                    secondary={formatTime(record.measurementTime)}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
