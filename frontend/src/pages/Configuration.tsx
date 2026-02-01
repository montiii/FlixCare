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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Save } from '@mui/icons-material';
import { useTranslation } from '../i18n/TranslationContext';
import { babyService } from '../services/babyService';
import { Baby } from '../types';

export default function Configuration() {
  const [baby, setBaby] = useState<Baby | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [notes, setNotes] = useState('');
  const t = useTranslation();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const babies = await babyService.getAll();
      let babyData = babies[0];
      if (!babyData) {
        babyData = await babyService.create({
          name: 'Mein Baby',
          birthDate: new Date().toISOString().split('T')[0],
          gender: '',
          notes: '',
        });
      }
      setBaby(babyData);
      setName(babyData.name);
      setBirthDate(babyData.birthDate);
      setGender(babyData.gender || '');
      setNotes(babyData.notes || '');
      setError(null);
    } catch (err) {
      setError(t.common.failedToLoad);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!baby || !name || !birthDate) return;
    try {
      await babyService.update(baby.id!, {
        name,
        birthDate,
        gender,
        notes,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      await loadData();
    } catch (err) {
      setError(t.common.failedToSave);
      console.error(err);
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
        {t.config.title}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{t.config.saved}</Alert>}

      {/* Baby Settings Card */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            {t.config.babySettings}
          </Typography>

          <TextField
            label={t.config.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />

          <TextField
            label={t.config.birthDate}
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />

          {birthDate && (
            <Alert severity="info" sx={{ mb: 2 }}>
              {t.config.age}: {calculateAge(birthDate)}
            </Alert>
          )}

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>{t.config.gender}</InputLabel>
            <Select
              value={gender}
              label={t.config.gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <MenuItem value="">{' '}</MenuItem>
              <MenuItem value="MALE">{t.config.male}</MenuItem>
              <MenuItem value="FEMALE">{t.config.female}</MenuItem>
              <MenuItem value="OTHER">{t.config.other}</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label={t.config.notes}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fullWidth
            multiline
            rows={3}
            sx={{ mb: 3 }}
          />

          <Button
            variant="contained"
            onClick={handleSave}
            fullWidth
            size="large"
            startIcon={<Save />}
            disabled={!name || !birthDate}
            sx={{ py: 2 }}
          >
            {t.config.save}
          </Button>
        </CardContent>
      </Card>

      {/* Password Settings Card */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            {t.config.passwordSettings}
          </Typography>

          <Typography variant="body2" color="text.secondary" paragraph>
            Passwort-Konfiguration über die Passwort-Management-Seite verfügbar:
          </Typography>

          <Button
            variant="outlined"
            fullWidth
            onClick={() => window.open('/password-config.html', '_blank')}
          >
            {t.config.changePassword}
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
