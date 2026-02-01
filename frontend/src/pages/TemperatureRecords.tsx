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
  Chip,
  IconButton,
} from '@mui/material';
import { Check, Delete } from '@mui/icons-material';
import { useTranslation } from '../i18n/TranslationContext';
import { babyService } from '../services/babyService';
import { temperatureRecordService } from '../services/temperatureRecordService';
import { TemperatureRecord } from '../types';

export default function TemperatureRecords() {
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

  const [records, setRecords] = useState<TemperatureRecord[]>([]);
  const [babyId, setBabyId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [temp, setTemp] = useState<string>('37.0');
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
      const tempData = await temperatureRecordService.getByBabyId(baby.id!);
      setRecords(tempData);
      setError(null);
    } catch (err) {
      setError(t.common.failedToLoad);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!babyId || !temp) return;
    try {
      await temperatureRecordService.create({
        babyId,
        measurementTime: new Date(dateTime).toISOString(),
        temperatureCelsius: Number(temp),
        notes: '',
      });
      await loadData();
      setTemp('37.0');
      setDateTime(getLocalDateTimeString()); // Reset to current time
    } catch (err) {
      setError(t.common.failedToSave);
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(t.temperature.confirmDelete)) {
      try {
        await temperatureRecordService.delete(id);
        await loadData();
      } catch (err) {
        setError(t.common.failedToSave);
        console.error(err);
      }
    }
  };

  const getTempColor = (t: number) => {
    if (t < 36.5) return 'error';      // Unterkühlung - rot
    if (t === 36.5) return 'warning';  // Grenzwert unten - gelb
    if (t === 37.5) return 'warning';  // Grenzwert oben - gelb
    if (t > 37.5) return 'error';      // Fieber - rot
    return 'success';                  // Normal - grün
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

  return (
    <Container maxWidth="sm" sx={{ pb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        {t.temperature.title}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            {t.temperature.logTemp}
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
              label={t.temperature.temperatureCelsius}
              type="number"
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              fullWidth
              inputProps={{ min: 30, max: 45, step: 0.1 }}
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: '2rem',
                  textAlign: 'center',
                  fontWeight: 600,
                },
              }}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, mb: 2 }}>
            <Button variant="outlined" onClick={() => setTemp('36.5')} size="large">36.5°</Button>
            <Button variant="outlined" onClick={() => setTemp('36.6')} size="large">36.6°</Button>
            <Button variant="outlined" onClick={() => setTemp('36.7')} size="large">36.7°</Button>
            <Button variant="outlined" onClick={() => setTemp('36.8')} size="large">36.8°</Button>
            <Button variant="outlined" onClick={() => setTemp('36.9')} size="large">36.9°</Button>
            <Button variant="outlined" onClick={() => setTemp('37.0')} size="large">37.0°</Button>
            <Button variant="outlined" onClick={() => setTemp('37.1')} size="large">37.1°</Button>
            <Button variant="outlined" onClick={() => setTemp('37.2')} size="large">37.2°</Button>
            <Button variant="outlined" onClick={() => setTemp('37.3')} size="large">37.3°</Button>
            <Button variant="outlined" onClick={() => setTemp('37.4')} size="large">37.4°</Button>
            <Button variant="outlined" onClick={() => setTemp('37.5')} size="large">37.5°</Button>
          </Box>

          <Button
            variant="contained"
            onClick={handleAdd}
            fullWidth
            size="large"
            startIcon={<Check />}
            sx={{ py: 2 }}
          >
            {t.temperature.saveTemperature}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            {t.temperature.recentReadings}
          </Typography>
          {records.length === 0 ? (
            <Typography color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
              {t.temperature.noRecordsYet}
            </Typography>
          ) : (
            <List dense>
              {records.slice(0, 10).map((record) => (
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
                        <Chip
                          label={`${record.temperatureCelsius}°C`}
                          color={getTempColor(record.temperatureCelsius)}
                          size="small"
                        />
                        <Typography variant="body1">
                          {formatTime(record.measurementTime)}
                        </Typography>
                      </Box>
                    }
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
