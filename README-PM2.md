# Guia Rápido - PM2

## 🚀 Início Rápido

### Ambiente Local (Desenvolvimento)

```bash
# 1. Copiar .env.example para .env
cp .env.example .env

# 2. Editar .env com suas configurações de banco de dados
# DATABASE_URL=postgresql://user:password@localhost:5432/mydb

# 3. Instalar dependências
npm install

# 4. Push do schema no banco
npm run db:push

# 5. Executar em desenvolvimento
npm run dev
```

### Produção com PM2

```bash
# 1. Instalar PM2 globalmente (uma vez)
npm install -g pm2

# 2. Configurar .env para produção
cp .env.example .env
# Editar .env com configurações de produção
# PORT=5035  (ou a porta que desejar)
# DATABASE_URL=postgresql://...
# SESSION_SECRET=...

# 3. Build da aplicação
npm run build

# 4. Iniciar com PM2
pm2 start ecosystem.config.cjs

# 5. Salvar configuração PM2 (reiniciar após reboot)
pm2 save
pm2 startup
```

**Importante sobre a Porta:**
- O arquivo `ecosystem.config.cjs` carrega automaticamente as variáveis do `.env`
- Configure a porta desejada no arquivo `.env` (exemplo: `PORT=5035`)
- O PM2 usará essa configuração automaticamente
- Se quiser sobrescrever, edite diretamente a linha `PORT` no `ecosystem.config.cjs`

## 📝 Comandos PM2

```bash
# Iniciar
pm2 start ecosystem.config.cjs

# Status
pm2 status

# Logs em tempo real
pm2 logs rest-express

# Parar
pm2 stop rest-express

# Reiniciar
pm2 restart rest-express

# Remover
pm2 delete rest-express

# Monitoramento
pm2 monit
```

## 🛠️ Script Auxiliar

Você pode usar o script `pm2-commands.sh` para facilitar:

```bash
# Tornar executável (primeira vez)
chmod +x pm2-commands.sh

# Usar os comandos
./pm2-commands.sh start      # Build e start
./pm2-commands.sh restart    # Restart
./pm2-commands.sh logs       # Ver logs
./pm2-commands.sh status     # Status
./pm2-commands.sh deploy     # Deploy completo (git pull + build + restart)
```

## 🔄 Atualização em Produção

```bash
# Opção 1: Usando o script
./pm2-commands.sh deploy

# Opção 2: Manual
git pull
npm install
npm run build
pm2 restart rest-express
```

## 📖 Documentação Completa

Veja `DEPLOYMENT.md` para informações detalhadas sobre:
- Configuração de ambiente
- Segurança
- Nginx como reverse proxy
- Troubleshooting
- E mais...

## ⚡ Diferença: Replit vs Local

**No Replit:**
- Variáveis de ambiente são gerenciadas via Secrets
- Não precisa de arquivo `.env`
- Executa automaticamente

**Local/Outro Servidor:**
- Precisa criar arquivo `.env` na raiz
- Carregar manualmente as variáveis de ambiente
- Usar PM2 para gerenciar processo em produção
