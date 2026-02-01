# Railway Deployment - Zusammenfassung der Änderungen

## ✅ Vorgenommene Änderungen

### Backend (backend/)
1. **Dockerfile** - Bereits optimal konfiguriert
   - Multi-stage Build mit Maven
   - Verwendet Eclipse Temurin 17 JRE Alpine
   - Setzt SPRING_PROFILES_ACTIVE=production
   
2. **application-production.properties** - Aktualisiert für Railway
   - Unterstützt Railway PostgreSQL Environment Variables (`DATABASE_URL`, `PGUSER`, `PGPASSWORD`)
   - Fallback auf Spring Standard-Variablen
   
3. **railway.json** - Neu erstellt
   - Konfiguriert Railway um Dockerfile zu verwenden
   - Restart-Policy für automatische Recovery

### Frontend (frontend/)
1. **Dockerfile** - Komplett überarbeitet
   - Multi-stage Build (Node → Nginx)
   - Verwendet `nginx.conf.template` für variable Konfiguration
   - `envsubst` ersetzt `${BACKEND_URL}` zur Laufzeit
   
2. **nginx.conf.template** - Neu erstellt
   - Variable Backend-URL: `${BACKEND_URL}`
   - Proxy-Konfiguration für `/api` Endpunkt
   - Optimierte Proxy-Headers (X-Forwarded-*, X-Real-IP)
   
3. **.env.production** - Neu erstellt
   - `VITE_API_BASE_URL=/api` (relativer Pfad für Production)
   
4. **.env.development** - Neu erstellt
   - `VITE_API_BASE_URL=http://localhost:8080/api` (für lokale Entwicklung)
   
5. **.gitignore** - Aktualisiert
   - Erlaubt .env.production und .env.development im Git
   
6. **railway.json** - Neu erstellt
   - Analog zu Backend-Konfiguration

### Root (/)
1. **RAILWAY_DEPLOYMENT.md** - Komplette Deployment-Anleitung
   - Schritt-für-Schritt Anweisungen
   - Environment Variables
   - Troubleshooting
   - Lokales Testing

## 🚀 Deployment auf Railway

### Schnellstart:

1. **PostgreSQL erstellen**
   - Railway Dashboard → New → Database → PostgreSQL

2. **Backend deployen**
   - New → GitHub Repo → Root Directory: `backend`
   - Environment Variables setzen:
     ```
     SPRING_PROFILES_ACTIVE=production
     FLIXCARE_USERNAME=admin
     FLIXCARE_PASSWORD=<sicheres-passwort>
     ```
   - PostgreSQL Service verbinden (Variables → Add Reference)
   - Domain generieren

3. **Frontend deployen**
   - New → GitHub Repo → Root Directory: `frontend`
   - Environment Variable setzen:
     ```
     BACKEND_URL=https://<backend-domain>.railway.app
     ```
   - Domain generieren

4. **Fertig!** 🎉

## 📋 Wichtige Environment Variables

### Backend (automatisch von Railway PostgreSQL)
- `DATABASE_URL` - Vollständige PostgreSQL Connection URL
- `PGUSER` - Datenbank-Username
- `PGPASSWORD` - Datenbank-Passwort
- `PGHOST` - Datenbank-Host
- `PGPORT` - Datenbank-Port
- `PGDATABASE` - Datenbank-Name

### Backend (manuell setzen)
- `SPRING_PROFILES_ACTIVE=production` - Aktiviert Production-Profil
- `FLIXCARE_USERNAME` - Admin-Username für Basic Auth
- `FLIXCARE_PASSWORD` - Admin-Passwort für Basic Auth

### Frontend (manuell setzen)
- `BACKEND_URL` - URL des Backend-Service (z.B. https://backend.railway.app)

## 🔧 Lokales Testen

```bash
# Backend mit Docker
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

# Frontend mit Docker
cd frontend
docker build -t flixcare-frontend .
docker run -p 3000:80 \
  -e BACKEND_URL=http://localhost:8080 \
  flixcare-frontend
```

## 📝 Hinweise

- **CORS:** Backend erlaubt bereits alle Origins (`allowedOrigins("*")`)
- **HTTPS:** Railway stellt automatisch HTTPS-Zertifikate bereit
- **Auto-Deploy:** Bei GitHub-Verbindung deployt Railway automatisch bei jedem Push
- **Logs:** Alle Logs sind im Railway Dashboard einsehbar
- **Kosten:** Free Tier mit $5 Credit/Monat verfügbar

## 🔗 Weitere Ressourcen

- [Railway Dokumentation](https://docs.railway.app)
- [PostgreSQL auf Railway](https://docs.railway.app/databases/postgresql)
- [Environment Variables](https://docs.railway.app/develop/variables)
