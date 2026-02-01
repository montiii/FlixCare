#!/bin/bash

echo "========================================"
echo "FlixCare - Project Verification"
echo "========================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 (missing)"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        return 0
    else
        echo -e "${RED}✗${NC} $1/ (missing)"
        return 1
    fi
}

total_checks=0
passed_checks=0

echo "Backend Structure:"
backend_files=(
    "backend/pom.xml"
    "backend/Dockerfile"
    "backend/manifest.yml"
    "backend/README.md"
    "backend/src/main/java/com/flixcare/FlixCareApplication.java"
    "backend/src/main/resources/application.properties"
)

for file in "${backend_files[@]}"; do
    ((total_checks++))
    if check_file "$file"; then
        ((passed_checks++))
    fi
done

echo ""
echo "Frontend Structure:"
frontend_files=(
    "frontend/package.json"
    "frontend/Dockerfile"
    "frontend/manifest.yml"
    "frontend/README.md"
    "frontend/.env"
    "frontend/src/main.tsx"
    "frontend/src/App.tsx"
    "frontend/vite.config.ts"
)

for file in "${frontend_files[@]}"; do
    ((total_checks++))
    if check_file "$file"; then
        ((passed_checks++))
    fi
done

echo ""
echo "Backend Components:"
backend_components=(
    "backend/src/main/java/com/flixcare/controller"
    "backend/src/main/java/com/flixcare/service"
    "backend/src/main/java/com/flixcare/repository"
    "backend/src/main/java/com/flixcare/entity"
    "backend/src/main/java/com/flixcare/dto"
)

for dir in "${backend_components[@]}"; do
    ((total_checks++))
    if check_dir "$dir"; then
        ((passed_checks++))
    fi
done

echo ""
echo "Frontend Components:"
frontend_components=(
    "frontend/src/components"
    "frontend/src/pages"
    "frontend/src/services"
    "frontend/src/types"
)

for dir in "${frontend_components[@]}"; do
    ((total_checks++))
    if check_dir "$dir"; then
        ((passed_checks++))
    fi
done

echo ""
echo "Deployment Files:"
deployment_files=(
    "docker-compose.yml"
    "build.sh"
    "deploy.sh"
)

for file in "${deployment_files[@]}"; do
    ((total_checks++))
    if check_file "$file"; then
        ((passed_checks++))
    fi
done

echo ""
echo "Documentation:"
docs=(
    "README.md"
    "QUICKSTART.md"
    "PROJECT_SUMMARY.md"
)

for file in "${docs[@]}"; do
    ((total_checks++))
    if check_file "$file"; then
        ((passed_checks++))
    fi
done

echo ""
echo "========================================"
echo "Verification Summary"
echo "========================================"
echo "Passed: ${passed_checks}/${total_checks}"

if [ $passed_checks -eq $total_checks ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "Project is ready to use!"
    echo ""
    echo "Next steps:"
    echo "1. cd backend && mvn spring-boot:run"
    echo "2. cd frontend && npm install && npm run dev"
    echo "3. Open http://localhost:3000"
    exit 0
else
    echo -e "${YELLOW}⚠ Some checks failed${NC}"
    exit 1
fi
