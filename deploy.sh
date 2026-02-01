#!/bin/bash

echo "========================================"
echo "Deploying FlixCare to SAP BTP"
echo "========================================"

# Check if logged in to CF
cf target > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "Please login to Cloud Foundry first:"
    echo "cf login -a https://api.cf.sap.hana.ondemand.com"
    exit 1
fi

# Create PostgreSQL service if it doesn't exist
echo ""
echo "Checking PostgreSQL service..."
cf service flixcare-postgres > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "Creating PostgreSQL service..."
    cf create-service postgresql-db trial flixcare-postgres
    echo "Waiting for service to be ready..."
    sleep 10
else
    echo "✅ PostgreSQL service already exists"
fi

# Deploy Backend
echo ""
echo "Deploying Backend..."
cd backend
mvn clean package -DskipTests
cf push
if [ $? -ne 0 ]; then
    echo "Backend deployment failed!"
    exit 1
fi
echo "✅ Backend deployed successfully"

# Deploy Frontend
echo ""
echo "Deploying Frontend..."
cd ../frontend
npm install
npm run build
cf push
if [ $? -ne 0 ]; then
    echo "Frontend deployment failed!"
    exit 1
fi

# Get backend URL
BACKEND_URL=$(cf app flixcare-backend | grep routes: | awk '{print $2}')
echo ""
echo "Setting frontend environment variable..."
cf set-env flixcare-frontend VITE_API_BASE_URL "https://${BACKEND_URL}/api"
cf restage flixcare-frontend

cd ..
echo ""
echo "========================================"
echo "✅ Deployment Complete!"
echo "========================================"
echo ""
echo "Backend URL: https://${BACKEND_URL}"
echo "Frontend URL: https://$(cf app flixcare-frontend | grep routes: | awk '{print $2}')"
echo "API Docs: https://${BACKEND_URL}/swagger-ui.html"
echo ""
