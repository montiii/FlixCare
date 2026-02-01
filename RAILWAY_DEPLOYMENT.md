# Railway Deployment Guide für FlixCare

## Voraussetzungen
- Railway Account erstellen auf [railway.app](https://railway.app)
- Railway CLI installieren (optional): `npm install -g @railway/cli`

## Deployment Schritte

### 1. PostgreSQL Datenbank erstellen

1. Erstelle ein neues Railway Projekt
2. Füge PostgreSQL hinzu: **New** → **Database** → **PostgreSQL**
3. Railway generiert automatisch die Datenbankverbindung

### 2. Backend deployen

1. **New** → **GitHub Repo** oder **Empty Service**
2. Wenn GitHub: Wähle dein Repository und setze Root Directory auf `backend`
3. Wenn Empty Service: Verbinde mit GitHub und setze Root Directory auf `backend`
4. Railway erkennt automatisch das Dockerfile

**Environment Variables für Backend setzen:**
```
SPRING_PROFILES_ACTIVE=production
FLIXCARE_USERNAME=<dein-username>
FLIXCARE_PASSWORD=<dein-password>
```

Die Datenbank-Variablen werden automatisch von Railway injiziert, wenn du das PostgreSQL Plugin verbindest:
- `PGUSER` → automatisch gesetzt
- `PGPASSWORD` → automatisch gesetzt
- `PGHOST` → automatisch gesetzt
- `PGPORT` → automatisch gesetzt
- `PGDATABASE` → automatisch gesetzt
- `DATABASE_URL` → automatisch gesetzt

**PostgreSQL Service verbinden:**
- Gehe zu Backend Service → **Variables** → **+ New Variable** → **Add Reference**
- Wähle alle PostgreSQL Variablen aus

**Deployment starten:**
- Railway baut automatisch das Backend-Image und deployed es

### 3. Frontend deployen

1. **New** → **GitHub Repo** oder **Empty Service**
2. Setze Root Directory auf `frontend`
3. Railway erkennt automatisch das Dockerfile

**Environment Variables für Frontend setzen:**
```
BACKEND_URL=https://<dein-backend-service>.railway.app
```

Um die Backend-URL zu finden:
- Gehe zum Backend Service
- Klicke auf **Settings** → **Generate Domain**
- Kopiere die generierte URL (z.B. `https://flixcare-backend-production.up.railway.app`)
- Füge die URL als `BACKEND_URL` im Frontend hinzu (mit `/api` am Ende falls nötig)

**Wichtig:** Die Backend-URL muss mit `http://` oder `https://` beginnen!

Beispiel:
```
BACKEND_URL=https://flixcare-backend-production.up.railway.app
```

**Deployment starten:**
- Railway baut automatisch das Frontend-Image und deployed es

### 4. Frontend Domain generieren

1. Gehe zum Frontend Service
2. **Settings** → **Generate Domain**
3. Deine App ist jetzt erreichbar unter `https://<dein-frontend>.railway.app`

## Netzwerk-Konfiguration

Railway Services können sich untereinander über private Netzwerke erreichen:
- Verwende `${{SERVICE_NAME.RAILWAY_PRIVATE_DOMAIN}}` für interne Kommunikation
- Für externe Requests (wie vom Browser): Verwende die öffentliche Domain

## Monitoring & Logs

- **Logs ansehen:** Klicke auf jeden Service um die Logs zu sehen
- **Metrics:** Railway zeigt CPU, Memory und Network Usage
- **Deployments:** Jeder Push triggert automatisch ein neues Deployment (wenn mit GitHub verbunden)

## Lokales Testen mit Railway-ähnlicher Konfiguration

```bash
# Backend
cd backend
docker build -t flixcare-backend .
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=production \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/flixcaredb \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=postgres \
  -e FLIXCARE_USERNAME=admin \
  -e FLIXCARE_PASSWORD=admin123 \
  flixcare-backend

# Frontend
cd frontend
docker build -t flixcare-frontend .
docker run -p 3000:80 \
  -e BACKEND_URL=http://localhost:8080 \
  flixcare-frontend
```

## Troubleshooting

### Backend startet nicht
- Prüfe ob PostgreSQL Service läuft
- Prüfe ob Environment Variables richtig gesetzt sind
- Schaue in die Logs: Railway Dashboard → Backend Service → Logs

### Frontend kann Backend nicht erreichen
- Prüfe `BACKEND_URL` Variable im Frontend
- Stelle sicher, dass Backend Domain generiert wurde
- Prüfe CORS-Einstellungen im Backend

### Datenbank-Verbindungsfehler
- Stelle sicher, dass PostgreSQL Service mit Backend verbunden ist
- Prüfe ob alle `PG*` Variablen verfügbar sind
- Railway zeigt verfügbare Variablen unter Service → Variables

## Kosten

Railway bietet:
- **Free Tier:** $5 Credit pro Monat (ca. 500 Stunden)
- **Hobby Plan:** $5/Monat für mehr Resources

## Weitere Informationen

- [Railway Dokumentation](https://docs.railway.app)
- [Railway Templates](https://railway.app/templates)
