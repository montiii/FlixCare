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
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useTranslation } from '../i18n/TranslationContext';
import { babyService } from '../services/babyService';
import { cleaningRecordService } from '../services/cleaningRecordService';
import { CleaningRecord, CleaningType, DiaperContent } from '../types';

export default function CleaningRecords() {
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

  const [records, setRecords] = useState<CleaningRecord[]>([]);
  const [babyId, setBabyId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDiaperOptions, setShowDiaperOptions] = useState(false);
  const [dateTime, setDateTime] = useState<string>(getLocalDateTimeString());
  const t = useTranslation();

  const cleaningTypes = [
    { type: CleaningType.DIAPER_CHANGE, label: t.cleaning.types.DIAPER_CHANGE, color: '#2196f3', diaper: true },
    { type: CleaningType.BATH, label: t.cleaning.types.BATH, color: '#00bcd4', diaper: false },
    { type: CleaningType.SPONGE_BATH, label: t.cleaning.types.SPONGE_BATH, color: '#009688', diaper: false },
  ];

  const diaperTypes = [
    { type: DiaperContent.WET, label: t.cleaning.diaperContent.WET, color: '#03a9f4' },
    { type: DiaperContent.DIRTY, label: t.cleaning.diaperContent.DIRTY, color: '#795548' },
    { type: DiaperContent.BOTH, label: t.cleaning.diaperContent.BOTH, color: '#ff9800' },
    { type: DiaperContent.CLEAN, label: t.cleaning.diaperContent.CLEAN, color: '#8bc34a' },
  ];

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
      const cleaningData = await cleaningRecordService.getByBabyId(baby.id!);
      setRecords(cleaningData);
      setError(null);
    } catch (err) {
      setError(t.common.failedToLoad);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (type: CleaningType, diaperContent?: DiaperContent) => {
    if (!babyId) return;
    try {
      await cleaningRecordService.create({
        babyId,
        cleaningTime: new Date(dateTime).toISOString(),
        cleaningType: type,
        diaperContent,
        notes: '',
      });
      await loadData();
      setShowDiaperOptions(false);
      setDateTime(getLocalDateTimeString()); // Reset to current time
    } catch (err) {
      setError(t.common.failedToSave);
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(t.cleaning.confirmDelete)) {
      try {
        await cleaningRecordService.delete(id);
        await loadData();
      } catch (err) {
        setError(t.common.failedToSave);
        console.error(err);
      }
    }
  };

  const getCleaningTypeLabel = (type: CleaningType): string => {
    const typeLabels: Partial<Record<CleaningType, string>> = {
      [CleaningType.DIAPER_CHANGE]: t.cleaning.types.DIAPER_CHANGE,
      [CleaningType.BATH]: t.cleaning.types.BATH,
      [CleaningType.SPONGE_BATH]: t.cleaning.types.SPONGE_BATH,
      [CleaningType.HAIR_WASH]: '💇 Haare', // Fallback für alte Einträge
    };
    return typeLabels[type] || type;
  };

  const getDiaperContentLabel = (content?: DiaperContent): string => {
    if (!content) return '';
    const contentLabels: Record<DiaperContent, string> = {
      [DiaperContent.WET]: t.cleaning.diaperContent.WET,
      [DiaperContent.DIRTY]: t.cleaning.diaperContent.DIRTY,
      [DiaperContent.BOTH]: t.cleaning.diaperContent.BOTH,
      [DiaperContent.CLEAN]: t.cleaning.diaperContent.CLEAN,
    };
    return contentLabels[content] || content;
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
        {t.cleaning.title}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* DateTime Picker */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <TextField
            label="Datum und Uhrzeit"
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 0 }}
          />
        </CardContent>
      </Card>

      {!showDiaperOptions ? (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              {t.cleaning.quickLog}
            </Typography>
            <Box sx={{ display: 'grid', gap: 1.5 }}>
              {cleaningTypes.map((clean) => (
                <Button
                  key={clean.type}
                  variant="contained"
                  onClick={() =>
                    clean.diaper ? setShowDiaperOptions(true) : handleAdd(clean.type)
                  }
                  sx={{
                    bgcolor: clean.color,
                    minHeight: 80,
                    fontSize: '1.3rem',
                    fontWeight: 600,
                    '&:hover': { bgcolor: clean.color, filter: 'brightness(0.9)' },
                  }}
                >
                  {clean.label}
                </Button>
              ))}
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              {t.cleaning.diaperType}
            </Typography>
            <Box sx={{ display: 'grid', gap: 1.5, mb: 2 }}>
              {diaperTypes.map((diaper) => (
                <Button
                  key={diaper.type}
                  variant="contained"
                  onClick={() => handleAdd(CleaningType.DIAPER_CHANGE, diaper.type)}
                  sx={{
                    bgcolor: diaper.color,
                    minHeight: 80,
                    fontSize: '1.3rem',
                    fontWeight: 600,
                    '&:hover': { bgcolor: diaper.color, filter: 'brightness(0.9)' },
                  }}
                >
                  {diaper.label}
                </Button>
              ))}
            </Box>
            <Button
              variant="outlined"
              onClick={() => setShowDiaperOptions(false)}
              fullWidth
              size="large"
            >
              {t.cleaning.back}
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            {t.cleaning.recentActivities}
          </Typography>
          {records.length === 0 ? (
            <Typography color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
              {t.cleaning.noRecordsYet}
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
                    primary={getCleaningTypeLabel(record.cleaningType)}
                    secondary={
                      <>
                        {formatTime(record.cleaningTime)}
                        {record.diaperContent && ` • ${getDiaperContentLabel(record.diaperContent)}`}
                      </>
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
