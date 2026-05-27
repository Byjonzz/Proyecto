#!/bin/bash
# 🚀 INICIO RÁPIDO - ConectaNet Dashboard

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║          🎉 ConectaNet Dashboard - INICIO RÁPIDO 🎉           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar Node.js
echo -e "${BLUE}✓ Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠ Node.js no está instalado. Instálalo desde https://nodejs.org/${NC}"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js $NODE_VERSION${NC}"

echo ""
echo -e "${BLUE}✓ Verificando npm...${NC}"
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm $NPM_VERSION${NC}"

echo ""
echo -e "${BLUE}📦 Instalando dependencias...${NC}"
npm install
echo -e "${GREEN}✓ Dependencias instaladas${NC}"

echo ""
echo -e "${BLUE}🚀 Iniciando servidor de desarrollo...${NC}"
echo -e "${YELLOW}Presiona Ctrl+C para detener${NC}"
echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "✅ El servidor estará disponible en: http://localhost:3000"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

npm run dev
