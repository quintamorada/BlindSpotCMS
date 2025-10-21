#!/bin/bash

# Script auxiliar para gerenciar a aplicação com PM2
# Torne-o executável com: chmod +x pm2-commands.sh

case "$1" in
  start)
    echo "🚀 Iniciando aplicação com PM2..."
    npm run build && pm2 start ecosystem.config.cjs
    ;;
  
  stop)
    echo "🛑 Parando aplicação..."
    pm2 stop rest-express
    ;;
  
  restart)
    echo "🔄 Reiniciando aplicação..."
    pm2 restart rest-express
    ;;
  
  delete)
    echo "🗑️  Removendo aplicação do PM2..."
    pm2 delete rest-express
    ;;
  
  logs)
    echo "📋 Mostrando logs..."
    pm2 logs rest-express
    ;;
  
  status)
    echo "📊 Status da aplicação:"
    pm2 status
    ;;
  
  rebuild)
    echo "🔨 Rebuild e restart..."
    npm run build && pm2 restart rest-express
    ;;
  
  deploy)
    echo "🚀 Deploy completo (pull + install + build + restart)..."
    git pull && npm install && npm run build && pm2 restart rest-express
    ;;
  
  *)
    echo "Uso: ./pm2-commands.sh {start|stop|restart|delete|logs|status|rebuild|deploy}"
    echo ""
    echo "Comandos disponíveis:"
    echo "  start    - Build e inicia a aplicação com PM2"
    echo "  stop     - Para a aplicação"
    echo "  restart  - Reinicia a aplicação"
    echo "  delete   - Remove a aplicação do PM2"
    echo "  logs     - Mostra os logs em tempo real"
    echo "  status   - Mostra o status da aplicação"
    echo "  rebuild  - Rebuild e reinicia"
    echo "  deploy   - Deploy completo (git pull + npm install + build + restart)"
    exit 1
    ;;
esac
