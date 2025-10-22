# 📦 Guia de Deploy em Produção

## 🚀 Deploy Automático com PM2

### Pré-requisitos

Certifique-se de ter instalado no servidor:

```bash
# Node.js (v18 ou superior)
node --version

# PM2 (gerenciador de processos)
npm install -g pm2

# Git (para atualizar código)
git --version
```

---

## 📝 Configuração Inicial

### 1. Arquivo `.env` 

Crie um arquivo `.env` na raiz do projeto com:

```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://usuario:senha@host:5432/database?sslmode=require
SESSION_SECRET=sua-chave-secreta-aqui-use-openssl-rand-base64-32
```

**Gerar SESSION_SECRET seguro:**
```bash
openssl rand -base64 32
```

### 2. Configuração do Nginx (se usar proxy reverso)

Crie `/etc/nginx/sites-available/persiana-facil`:

```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;
    
    # Redirecionar para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seu-dominio.com www.seu-dominio.com;
    
    # Certificados SSL (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;
    
    # Configurações SSL recomendadas
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        
        # Headers importantes para sessão funcionar com HTTPS
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_cache_bypass $http_upgrade;
    }
}
```

Ative o site:
```bash
sudo ln -s /etc/nginx/sites-available/persiana-facil /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🎯 Deploy

### Método 1: Script Automático (Recomendado)

```bash
# Tornar executável (só precisa uma vez)
chmod +x deploy-production.sh

# Executar deploy
./deploy-production.sh
```

O script irá:
- ✅ Verificar Node.js e PM2
- ✅ Verificar arquivo `.env`
- ✅ Fazer backup do build anterior
- ✅ Atualizar código do Git (`git pull`)
- ✅ Instalar dependências (`npm ci`)
- ✅ Build da aplicação (`npm run build`)
- ✅ Reiniciar no PM2
- ✅ Verificar se está rodando
- ✅ Limpar backups antigos

### Método 2: Script Simplificado

```bash
# Deploy rápido (pull + install + build + restart)
./pm2-commands.sh deploy
```

### Método 3: Manual

```bash
# 1. Atualizar código
git pull

# 2. Instalar dependências
npm ci --production=false

# 3. Build
npm run build

# 4. Reiniciar PM2
pm2 restart rest-express
```

---

## 🔧 Comandos Úteis PM2

```bash
# Ver status
pm2 status

# Ver logs em tempo real
pm2 logs rest-express

# Ver logs das últimas 100 linhas
pm2 logs rest-express --lines 100

# Reiniciar aplicação
pm2 restart rest-express

# Parar aplicação
pm2 stop rest-express

# Remover do PM2
pm2 delete rest-express

# Salvar configuração atual
pm2 save

# Monitoramento em tempo real
pm2 monit

# Informações detalhadas
pm2 describe rest-express
```

---

## 🔄 Configurar PM2 para Iniciar no Boot

```bash
# Gerar script de startup
pm2 startup

# Execute o comando sugerido (geralmente precisa de sudo)
# Exemplo: sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u seuusuario --hp /home/seuusuario

# Salvar lista de processos atual
pm2 save

# Verificar
sudo systemctl status pm2-seuusuario
```

---

## 🐛 Troubleshooting

### Problema: Login não funciona (volta para tela de login)

**Solução:**
1. Verifique se `NODE_ENV=production` no `.env`
2. Verifique se nginx está passando `X-Forwarded-Proto`
3. Execute o deploy novamente: `./deploy-production.sh`
4. Verifique logs: `pm2 logs rest-express`

### Problema: Aplicação não inicia

```bash
# Ver logs de erro
pm2 logs rest-express --err

# Verificar porta em uso
sudo lsof -i :5000

# Reiniciar completamente
pm2 delete rest-express
./deploy-production.sh
```

### Problema: Sessão expira muito rápido

Edite `server/index.ts` e aumente `maxAge`:
```typescript
cookie: {
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
  // ...
}
```

### Problema: Erro ao conectar no banco de dados

```bash
# Verificar se DATABASE_URL está correto
cat .env | grep DATABASE_URL

# Testar conexão
npm run db:push
```

---

## 📊 Monitoramento

### PM2 Plus (Opcional - Gratuito)

Monitoramento profissional com dashboard web:

```bash
# Registrar em pm2.io
pm2 plus

# Seguir instruções no site
```

### Logs do Sistema

```bash
# Logs do PM2
tail -f ~/.pm2/logs/rest-express-out.log
tail -f ~/.pm2/logs/rest-express-error.log

# Logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 🔐 Segurança

### Checklist de Segurança:

- ✅ `.env` não está no Git (está no `.gitignore`)
- ✅ `SESSION_SECRET` é uma string aleatória forte
- ✅ `DATABASE_URL` usa SSL (`sslmode=require`)
- ✅ Nginx configurado com HTTPS
- ✅ Certificado SSL válido (Let's Encrypt)
- ✅ Firewall configurado (portas 80, 443 abertas)
- ✅ PM2 rodando como usuário não-root

### Renovar Certificado SSL (Let's Encrypt)

```bash
# Certificados Let's Encrypt expiram a cada 90 dias
# Renovar manualmente:
sudo certbot renew

# Ou configurar auto-renovação:
sudo certbot renew --dry-run
```

---

## 🎯 Resumo - Deploy Rápido

```bash
# Preparação (só uma vez)
chmod +x deploy-production.sh
nano .env  # Configurar variáveis

# Deploy
./deploy-production.sh

# Verificar
pm2 status
pm2 logs rest-express
```

✅ **Pronto!** Sua aplicação está rodando em produção!

---

## 📞 Suporte

Se tiver problemas:
1. Verifique logs: `pm2 logs rest-express`
2. Verifique status: `pm2 status`
3. Reinicie: `pm2 restart rest-express`
4. Deploy completo: `./deploy-production.sh`
