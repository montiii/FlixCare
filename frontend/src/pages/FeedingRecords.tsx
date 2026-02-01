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
  ButtonGroup,
  TextField,
  List,
  ListItem,
  ListItemText,
  Fab,
  IconButton,
} from '@mui/material';
import { Add, Check, Delete } from '@mui/icons-material';
import { useTranslation } from '../i18n/TranslationContext';
import { babyService } from '../services/babyService';
import { feedingRecordService } from '../services/feedingRecordService';
import { FeedingRecord, FeedingType } from '../types';

export default function FeedingRecords() {
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

  const [records, setRecords] = useState<FeedingRecord[]>([]);
  const [babyId, setBabyId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState<FeedingType>(FeedingType.BREAST_LEFT);
  const [amount, setAmount] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [dateTime, setDateTime] = useState<string>(getLocalDateTimeString());
  const t = useTranslation();

  // Links: Brust-bezogene Optionen
  const breastFeedingTypes = [
    { type: FeedingType.BREAST_LEFT, label: t.feeding.types.BREAST_LEFT, color: '#e91e63' },
    { type: FeedingType.BREAST_RIGHT, label: t.feeding.types.BREAST_RIGHT, color: '#9c27b0' },
    { type: FeedingType.BREAST_BOTH, label: t.feeding.types.BREAST_BOTH, color: '#673ab7' },
  ];

  // Rechts: Flasche/Brei Optionen
  const bottleFeedingTypes = [
    { type: FeedingType.BOTTLE_FORMULA, label: t.feeding.types.BOTTLE_FORMULA, color: '#3f51b5' },
    { type: FeedingType.BOTTLE_BREAST_MILK, label: t.feeding.types.BOTTLE_BREAST_MILK, color: '#2196f3' },
    { type: FeedingType.SOLID_FOOD, label: t.feeding.types.SOLID_FOOD, color: '#ff9800' },
  ];

  const feedingTypes = [...breastFeedingTypes, ...bottleFeedingTypes];

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
      const feedingData = await feedingRecordService.getByBabyId(baby.id!);
      setRecords(feedingData);
      setError(null);
    } catch (err) {
      setError(t.common.failedToLoad);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = async (type: FeedingType) => {
    if (!babyId) return;
    try {
      // dateTime ist lokale Zeit im Format "YYYY-MM-DDTHH:mm"
      // new Date(dateTime) interpretiert es korrekt als lokale Zeit
      // toISOString() konvertiert dann automatisch zu UTC
      const isoString = new Date(dateTime).toISOString();
      console.log('🕐 handleQuickAdd - Input dateTime:', dateTime);
      console.log('🕐 handleQuickAdd - ISO String (UTC):', isoString);

      await feedingRecordService.create({
        babyId,
        feedingTime: isoString,
        feedingType: type,
        notes: '',
      });
      await loadData();
      setShowForm(false);
      setDateTime(getLocalDateTimeString()); // Reset to current time
    } catch (err) {
      setError(t.common.failedToSave);
      console.error(err);
    }
  };

  const handleDetailedAdd = async () => {
    if (!babyId) return;
    try {
      await feedingRecordService.create({
        babyId,
        feedingTime: new Date(dateTime).toISOString(),
        feedingType: selectedType,
        amountMl: amount ? Number(amount) : undefined,
        durationMinutes: duration ? Number(duration) : undefined,
        notes: '',
      });
      await loadData();
      setShowForm(false);
      setAmount('');
      setDuration('');
      setDateTime(getLocalDateTimeString()); // Reset to current time
    } catch (err) {
      setError(t.common.failedToSave);
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(t.feeding.confirmDelete)) {
      try {
        await feedingRecordService.delete(id);
        await loadData();
      } catch (err) {
        setError(t.common.failedToSave);
        console.error(err);
      }
    }
  };

  const getFeedingTypeLabel = (type: FeedingType): string => {
    const typeLabels: Record<FeedingType, string> = {
      [FeedingType.BREAST_LEFT]: t.feeding.types.BREAST_LEFT,
      [FeedingType.BREAST_RIGHT]: t.feeding.types.BREAST_RIGHT,
      [FeedingType.BREAST_BOTH]: t.feeding.types.BREAST_BOTH,
      [FeedingType.BOTTLE_FORMULA]: t.feeding.types.BOTTLE_FORMULA,
      [FeedingType.BOTTLE_BREAST_MILK]: t.feeding.types.BOTTLE_BREAST_MILK,
      [FeedingType.SOLID_FOOD]: t.feeding.types.SOLID_FOOD,
    };
    return typeLabels[type] || type;
  };

  const formatTime = (dateTime: string) => {
    // Backend liefert UTC-Zeit ohne 'Z': "2026-02-01T08:33:00"
    // JavaScript interpretiert das als lokale Zeit!
    // Lösung: 'Z' anhängen wenn es fehlt
    const utcDateTime = dateTime.endsWith('Z') ? dateTime : dateTime + 'Z';

    const date = new Date(utcDateTime);
    console.log('🕐 formatTime - Input:', dateTime);
    console.log('🕐 formatTime - With Z:', utcDateTime);
    console.log('🕐 formatTime - Date object:', date.toString());
    console.log('🕐 formatTime - getHours():', date.getHours());

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
        {t.feeding.title}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {!showForm ? (
        <>
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

          {/* Quick Add Buttons */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                {t.feeding.quickAdd}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
                {/* Linke Spalte: Brust-Optionen */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {breastFeedingTypes.map((feed) => (
                    <Button
                      key={feed.type}
                      variant="contained"
                      onClick={() => handleQuickAdd(feed.type)}
                      sx={{
                        bgcolor: feed.color,
                        minHeight: 80,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        '&:hover': { bgcolor: feed.color, filter: 'brightness(0.9)' },
                      }}
                    >
                      {feed.label}
                    </Button>
                  ))}
                </Box>

                {/* Rechte Spalte: Flasche/Brei */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {bottleFeedingTypes.map((feed) => (
                    <Button
                      key={feed.type}
                      variant="contained"
                      onClick={() => handleQuickAdd(feed.type)}
                      sx={{
                        bgcolor: feed.color,
                        minHeight: 80,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        '&:hover': { bgcolor: feed.color, filter: 'brightness(0.9)' },
                      }}
                    >
                      {feed.label}
                    </Button>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Recent Records */}
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                {t.feeding.recentFeedings}
              </Typography>
              {records.length === 0 ? (
                <Typography color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                  {t.feeding.noRecordsYet}
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
                        primary={getFeedingTypeLabel(record.feedingType)}
                        secondary={
                          <>
                            {formatTime(record.feedingTime)}
                            {record.amountMl && ` • ${record.amountMl}ml`}
                            {record.durationMinutes && ` • ${record.durationMinutes}min`}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              {t.feeding.detailedEntry}
            </Typography>

            <ButtonGroup fullWidth sx={{ mt: 2, mb: 3, flexWrap: 'wrap' }}>
              {feedingTypes.map((feed) => (
                <Button
                  key={feed.type}
                  variant={selectedType === feed.type ? 'contained' : 'outlined'}
                  onClick={() => setSelectedType(feed.type)}
                  sx={{ mb: 1 }}
                >
                  {feed.label}
                </Button>
              ))}
            </ButtonGroup>

            <TextField
              label={t.feeding.amountMl}
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              inputProps={{ min: 0, step: 10 }}
            />

            <TextField
              label={t.feeding.durationMinutes}
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              fullWidth
              sx={{ mb: 3 }}
              inputProps={{ min: 0, step: 1 }}
            />

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => setShowForm(false)}
                fullWidth
                size="large"
              >
                {t.feeding.cancel}
              </Button>
              <Button
                variant="contained"
                onClick={handleDetailedAdd}
                fullWidth
                size="large"
                startIcon={<Check />}
              >
                {t.feeding.save}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* FAB for detailed entry */}
      {!showForm && (
        <Fab
          color="primary"
          aria-label="add detailed"
          sx={{ position: 'fixed', bottom: { xs: 85, md: 20 }, right: 20 }}
          onClick={() => setShowForm(true)}
        >
          <Add />
        </Fab>
      )}
    </Container>
  );
}
