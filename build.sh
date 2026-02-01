#!/bin/bash

#!/bin/bash

echo "========================================"
echo "Building FlixCare Application"
echo "========================================"

# Build Backend
echo ""
echo "Building Backend..."
cd backend
mvn clean package -DskipTests
if [ $? -ne 0 ]; then
    echo "Backend build failed!"
    exit 1
fi
echo "✅ Backend build successful"

# Build Frontend
echo ""
echo "Building Frontend..."
cd ../frontend
npm install
npm run build
if [ $? -ne 0 ]; then
    echo "Frontend build failed!"
    exit 1
fi
echo "✅ Frontend build successful"

cd ..
echo ""
echo "========================================"
echo "✅ Build Complete!"
echo "========================================"
echo ""
echo "Backend JAR: backend/target/flixcare-backend-1.0.0.jar"
echo "Frontend build: frontend/dist/"
echo ""
