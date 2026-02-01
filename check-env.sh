#!/bin/bash

echo "============================================"
echo "FlixCare - Environment Checker"
echo "============================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_command() {
    if command -v $1 &> /dev/null; then
        version=$($2 2>&1)
        echo -e "${GREEN}✓${NC} $1 is installed: $version"
        return 0
    else
        echo -e "${RED}✗${NC} $1 is NOT installed"
        return 1
    fi
}

echo "Checking Prerequisites:"
echo "----------------------"

# Check Java
check_command java "java -version 2>&1 | head -1"

# Check Maven
check_command mvn "mvn -version 2>&1 | head -1"

# Check Node
check_command node "node --version"

# Check npm
check_command npm "npm --version"

# Check Docker
check_command docker "docker --version"

# Check Docker Compose
if docker compose version &> /dev/null; then
    echo -e "${GREEN}✓${NC} docker compose is available (V2)"
elif docker-compose --version &> /dev/null; then
    echo -e "${GREEN}✓${NC} docker-compose is available (V1)"
else
    echo -e "${RED}✗${NC} docker compose is NOT available"
fi

echo ""
echo "Checking Project Files:"
echo "----------------------"

if [ -f "backend/pom.xml" ]; then
    echo -e "${GREEN}✓${NC} backend/pom.xml exists"
else
    echo -e "${RED}✗${NC} backend/pom.xml missing"
fi

if [ -f "frontend/package.json" ]; then
    echo -e "${GREEN}✓${NC} frontend/package.json exists"
else
    echo -e "${RED}✗${NC} frontend/package.json missing"
fi

if [ -f "docker-compose.yml" ]; then
    echo -e "${GREEN}✓${NC} docker-compose.yml exists"
else
    echo -e "${RED}✗${NC} docker-compose.yml missing"
fi

echo ""
echo "Checking Dockerfiles:"
echo "--------------------"

if [ -f "backend/Dockerfile" ]; then
    echo -e "${GREEN}✓${NC} backend/Dockerfile exists"
    if head -1 backend/Dockerfile | grep -q "FROM"; then
        echo -e "${GREEN}  ✓${NC} Dockerfile syntax looks valid"
    else
        echo -e "${RED}  ✗${NC} Dockerfile may have syntax issues"
    fi
else
    echo -e "${RED}✗${NC} backend/Dockerfile missing"
fi

if [ -f "frontend/Dockerfile" ]; then
    echo -e "${GREEN}✓${NC} frontend/Dockerfile exists"
    if head -1 frontend/Dockerfile | grep -q "FROM"; then
        echo -e "${GREEN}  ✓${NC} Dockerfile syntax looks valid"
    else
        echo -e "${RED}  ✗${NC} Dockerfile may have syntax issues"
    fi
else
    echo -e "${RED}✗${NC} frontend/Dockerfile missing"
fi

echo ""
echo "Validating Docker Compose:"
echo "-------------------------"

if [ -f "docker-compose.yml" ]; then
    if docker compose config &> /dev/null || docker-compose config &> /dev/null; then
        echo -e "${GREEN}✓${NC} docker-compose.yml is valid"
    else
        echo -e "${RED}✗${NC} docker-compose.yml has errors"
        echo "Run 'docker compose config' to see details"
    fi
fi

echo ""
echo "============================================"
echo "Recommendations:"
echo "============================================"
echo ""

if ! command -v java &> /dev/null; then
    echo "• Install Java 17: https://adoptium.net/"
fi

if ! command -v mvn &> /dev/null; then
    echo "• Install Maven: https://maven.apache.org/download.cgi"
fi

if ! command -v node &> /dev/null; then
    echo "• Install Node.js: https://nodejs.org/"
fi

if ! command -v docker &> /dev/null; then
    echo "• Install Docker: https://docs.docker.com/get-docker/"
fi

echo ""
echo "Quick Start Options:"
echo "-------------------"
echo ""
echo "1. Development Mode (No Docker):"
echo "   Terminal 1: cd backend && mvn spring-boot:run"
echo "   Terminal 2: cd frontend && npm install && npm run dev"
echo ""
echo "2. Docker PostgreSQL Only:"
echo "   docker compose -f docker-compose-dev.yml up -d"
echo "   Then run backend and frontend manually"
echo ""
echo "3. Full Docker Stack:"
echo "   docker compose up --build"
echo ""
echo "============================================"
