export const de = {
  // App Title
  appName: 'FlixCare',
  appTitle: 'Baby Tracking',

  // Navigation
  nav: {
    home: 'Start',
    feed: 'Füttern',
    temp: 'Temp',
    clean: 'Pflege',
    weight: 'Gewicht',
    medication: 'Medikation',
    config: 'Config',
  },

  // Dashboard
  dashboard: {
    todaySummary: '📊 Heute',
    recentActivity: 'Letzte Aktivitäten',
    feedings: 'Mahlzeiten',
    changes: 'Wechsel',
    feeding: 'Mahlzeit',
    temperature: 'Temperatur',
    cleaning: 'Pflege',
    daysOld: 'Tage alt',
    monthsOld: 'Monate alt',
    yearsOld: 'Jahre alt',
    justNow: 'gerade eben',
    minutesAgo: 'Min. her',
    hoursAgo: 'Std. her',
    yesterday: 'gestern',
    daysAgo: 'Tage her',
    noRecords: 'Keine Einträge',
  },

  // Feeding
  feeding: {
    title: '🍼 Füttern',
    quickAdd: 'Schnell hinzufügen',
    recentFeedings: 'Letzte Mahlzeiten',
    noRecordsYet: 'Noch keine Einträge',
    detailedEntry: 'Detaillierter Eintrag',
    amountMl: 'Menge (ml)',
    durationMinutes: 'Dauer (Minuten)',
    cancel: 'Abbrechen',
    save: 'Speichern',
    delete: 'Löschen',
    confirmDelete: 'Möchten Sie diesen Eintrag wirklich löschen?',
    deleted: 'Eintrag gelöscht',
    types: {
      BREAST_LEFT: '🤱 Links',
      BREAST_RIGHT: '🤱 Rechts',
      BREAST_BOTH: '🤱 Beide',
      BOTTLE_FORMULA: '🍼 Formula',
      BOTTLE_BREAST_MILK: '🍼 Muttermilch',
      SOLID_FOOD: '🥄 Brei',
    },
  },

  // Temperature
  temperature: {
    title: '🌡️ Temperatur',
    logTemp: 'Temperatur erfassen',
    temperatureCelsius: 'Temperatur (°C)',
    saveTemperature: 'Temperatur speichern',
    recentReadings: 'Letzte Messungen',
    noRecordsYet: 'Noch keine Einträge',
    delete: 'Löschen',
    confirmDelete: 'Möchten Sie diese Messung wirklich löschen?',
  },

  // Cleaning
  cleaning: {
    title: '🧼 Pflege',
    quickLog: 'Schnell erfassen',
    diaperType: 'Windeltyp',
    recentActivities: 'Letzte Aktivitäten',
    noRecordsYet: 'Noch keine Einträge',
    back: 'Zurück',
    delete: 'Löschen',
    confirmDelete: 'Möchten Sie diesen Eintrag wirklich löschen?',
    types: {
      DIAPER_CHANGE: '🧷 Windel',
      BATH: '🛁 Baden',
      SPONGE_BATH: '🧽 Waschen',
    },
    diaperContent: {
      WET: '💧 Nass',
      DIRTY: '💩 Voll',
      BOTH: '💧💩 Beides',
      CLEAN: '✨ Sauber',
    },
  },

  // Weight
  weight: {
    title: '⚖️ Gewicht',
    logWeight: 'Gewicht erfassen',
    weightGrams: 'Gewicht (g)',
    saveWeight: 'Gewicht speichern',
    recentWeights: 'Letzte Messungen',
    noRecordsYet: 'Noch keine Einträge',
    delete: 'Löschen',
    confirmDelete: 'Möchten Sie diese Messung wirklich löschen?',
    trend: 'Entwicklung',
  },

  // Medication
  medication: {
    title: '💊 Medikation',
    logMedication: 'Medikation erfassen',
    saveMedication: 'Medikation speichern',
    recentMedications: 'Letzte Gaben',
    noRecordsYet: 'Noch keine Einträge',
    delete: 'Löschen',
    confirmDelete: 'Möchten Sie diesen Eintrag wirklich löschen?',
    dosage: 'Dosierung',
    types: {
      VITAMIN_D: '☀️ Vitamin D',
      EYE_CLEANING: '👁️ Augenreinigung',
    },
  },

  // Configuration
  config: {
    title: '⚙️ Konfiguration',
    babySettings: 'Baby-Einstellungen',
    name: 'Name',
    birthDate: 'Geburtsdatum',
    gender: 'Geschlecht',
    male: 'Männlich',
    female: 'Weiblich',
    other: 'Divers',
    notes: 'Notizen',
    save: 'Speichern',
    saved: 'Erfolgreich gespeichert',
    age: 'Alter',
    passwordSettings: 'Passwort-Einstellungen',
    changePassword: 'Passwort ändern',
    currentPassword: 'Aktuelles Passwort',
    newPassword: 'Neues Passwort',
  },

  // Auth
  auth: {
    title: 'FlixCare Anmeldung',
    subtitle: 'Bitte Passwort eingeben',
    password: 'Passwort',
    login: 'Anmelden',
    wrongPassword: 'Falsches Passwort',
    enterPassword: 'Bitte geben Sie Ihr Passwort ein',
  },

  // Common
  common: {
    loading: 'Lädt...',
    error: 'Fehler beim Laden',
    failedToLoad: 'Daten konnten nicht geladen werden',
    failedToSave: 'Speichern fehlgeschlagen',
  },
};

export type Translations = typeof de;
