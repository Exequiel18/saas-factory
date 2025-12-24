#!/bin/bash
# Script para hacer push automático

BRANCH="master"
REMOTE_URL="https://github.com/tu-usuario/tu-repo.git"

if [ "$REMOTE_URL" == "https://github.com/tu-usuario/tu-repo.git" ]; then
  echo "⚠️  Necesitás configurar la URL del repo primero"
  echo "Ejecutá: git remote add origin [tu-repo-url]"
  exit 1
fi

echo "📤 Haciendo push a GitHub..."
git push -u origin $BRANCH

if [ $? -eq 0 ]; then
  echo "✅ Push exitoso!"
  echo ""
  echo "🎯 PRÓXIMO PASO: Deploy en Vercel"
  echo "1. Ve a https://vercel.com"
  echo "2. Importá tu repositorio"
  echo "3. Configurá las variables (ver INSTRUCCIONES_VERCEL.md)"
  echo "4. Deploy"
else
  echo "❌ Error en push"
  echo "Verificá que el repo existe y tenés permisos"
fi
