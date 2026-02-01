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
import { Delete, Check } from '@mui/icons-material';
import { useTranslation } from '../i18n/TranslationContext';
import { babyService } from '../services/babyService';
import { medicationRecordService } from '../services/medicationRecordService';
import { MedicationRecord, MedicationType } from '../types';

export default function MedicationRecords() {
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

  const [records, setRecords] = useState<MedicationRecord[]>([]);
  const [babyId, setBabyId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateTime, setDateTime] = useState<string>(getLocalDateTimeString());
  const [dosage, setDosage] = useState<string>('');
  const t = useTranslation();

  const medicationTypes = [
    { type: MedicationType.VITAMIN_D, label: t.medication.types.VITAMIN_D, color: '#ff9800' },
    { type: MedicationType.EYE_CLEANING, label: t.medication.types.EYE_CLEANING, color: '#00bcd4' },
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
      const medicationData = await medicationRecordService.getByBabyId(baby.id!);
      setRecords(medicationData);
      setError(null);
    } catch (err) {
      setError(t.common.failedToLoad);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (type: MedicationType) => {
    if (!babyId) return;
    try {
      await medicationRecordService.create({
        babyId,
        medicationTime: new Date(dateTime).toISOString(),
        medicationType: type,
        dosage: dosage || undefined,
        notes: '',
      });
      await loadData();
      setDosage('');
      setDateTime(getLocalDateTimeString());
    } catch (err) {
      setError(t.common.failedToSave);
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(t.medication.confirmDelete)) {
      try {
        await medicationRecordService.delete(id);
        await loadData();
      } catch (err) {
        setError(t.common.failedToSave);
        console.error(err);
      }
    }
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

  const getMedicationTypeLabel = (type: MedicationType): string => {
    const typeLabels: Record<MedicationType, string> = {
      [MedicationType.VITAMIN_D]: t.medication.types.VITAMIN_D,
      [MedicationType.EYE_CLEANING]: t.medication.types.EYE_CLEANING,
    };
    return typeLabels[type] || type;
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
        {t.medication.title}
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

      {/* Quick Add Buttons */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            {t.medication.logMedication}
          </Typography>

          <TextField
            label={t.medication.dosage}
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            fullWidth
            placeholder="z.B. 3 Tropfen"
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1.5 }}>
            {medicationTypes.map((med) => (
              <Button
                key={med.type}
                variant="contained"
                onClick={() => handleAdd(med.type)}
                startIcon={<Check />}
                sx={{
                  bgcolor: med.color,
                  minHeight: 60,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': { bgcolor: med.color, filter: 'brightness(0.9)' },
                }}
              >
                {med.label}
              </Button>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Recent Records */}
      <Card>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            {t.medication.recentMedications}
          </Typography>
          {records.length === 0 ? (
            <Typography color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
              {t.medication.noRecordsYet}
            </Typography>
          ) : (
            <List dense>
              {records.slice(0, 20).map((record) => (
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
                    primary={getMedicationTypeLabel(record.medicationType)}
                    secondary={
                      <>
                        {formatTime(record.medicationTime)}
                        {record.dosage && ` • ${record.dosage}`}
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
