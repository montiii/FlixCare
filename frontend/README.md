# FlixCare Frontend

## Overview
FlixCare Frontend is a responsive React + TypeScript web application for tracking baby care activities.

## Technologies
- React 18
- TypeScript
- Material-UI (MUI)
- Vite
- Axios
- React Router

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update the API URL in `.env`:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

### Running Locally

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## Features

- **Dashboard**: Overview of all tracking activities
- **Baby Management**: Create and manage baby profiles
- **Feeding Records**: Track feeding times, types, amounts, and durations
- **Temperature Records**: Monitor baby temperature measurements
- **Cleaning Records**: Track diaper changes and bathing activities
- **Responsive Design**: Optimized for mobile devices

## Deployment to SAP BTP

### Prerequisites
- CF CLI installed
- SAP BTP account

### Steps

1. Build the application:
```bash
npm run build
```

2. Login to SAP BTP:
```bash
cf login -a https://api.cf.sap.hana.ondemand.com
```

3. Deploy to Cloud Foundry:
```bash
cf push
```

4. Update the environment variable with backend URL:
```bash
cf set-env flixcare-frontend VITE_API_BASE_URL https://flixcare-backend.cfapps.sap.hana.ondemand.com/api
cf restage flixcare-frontend
```

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   ├── pages/           # Page components
│   ├── services/        # API service layer
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## License
Apache 2.0
