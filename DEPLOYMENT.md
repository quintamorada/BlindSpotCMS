# Guia de Deployment - Ambiente Local e Produção

Este guia mostra como executar a aplicação localmente e em produção usando PM2.

## 📋 Pré-requisitos

- Node.js (v20+)
- PostgreSQL
- PM2 (para produção): `npm install -g pm2`

## 🔧 Configuração Local

### 1. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database connection string (PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/mydb

# Server port (default: 5000)
PORT=5000

# Node environment
NODE_ENV=development

# Session secret key
SESSION_SECRET=your-secret-key-change-in-production
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar o Banco de Dados

Execute as migrações do banco de dados:

```bash
npm run db:push
```

### 4. Executar em Modo Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5000`

## 🚀 Deployment com PM2

### 1. Build da Aplicação

Antes de fazer o deployment, compile a aplicação:

```bash
npm run build
```

Isso irá:
- Compilar o frontend (Vite)
- Compilar o backend (esbuild)
- Gerar os arquivos na pasta `dist/`

### 2. Configurar Variáveis de Ambiente para Produção

Certifique-se de que o arquivo `.env` existe na raiz do projeto com as configurações de produção:

```env
DATABASE_URL=postgresql://user:password@production-host:5432/production_db
PORT=5000
NODE_ENV=production
SESSION_SECRET=your-strong-secret-key-here
```

### 3. Iniciar com PM2

```bash
pm2 start ecosystem.config.cjs
```

### 4. Comandos PM2 Úteis

**Ver status da aplicação:**
```bash
pm2 status
```

**Ver logs em tempo real:**
```bash
pm2 logs rest-express
```

**Parar a aplicação:**
```bash
pm2 stop rest-express
```

**Reiniciar a aplicação:**
```bash
pm2 restart rest-express
```

**Remover a aplicação do PM2:**
```bash
pm2 delete rest-express
```

**Salvar a configuração do PM2 (para reiniciar automaticamente após reboot):**
```bash
pm2 save
pm2 startup
```

### 5. Atualizar a Aplicação em Produção

Quando houver atualizações no código:

```bash
# 1. Pull das últimas mudanças
git pull

# 2. Instalar dependências (se houver novas)
npm install

# 3. Rebuild da aplicação
npm run build

# 4. Reiniciar com PM2
pm2 restart rest-express
```

## 📊 Monitoramento

### Logs do PM2

Os logs são armazenados em:
- Erros: `./logs/pm2-error.log`
- Output: `./logs/pm2-out.log`

### Ver logs em tempo real:

```bash
pm2 logs rest-express --lines 100
```

### Monitoramento em tempo real:

```bash
pm2 monit
```

## 🔒 Segurança em Produção

1. **Variáveis de Ambiente**: Nunca commite o arquivo `.env` no Git
2. **SESSION_SECRET**: Use uma chave forte e única em produção
3. **DATABASE_URL**: Use credenciais seguras e diferentes para cada ambiente
4. **Firewall**: Configure o firewall para permitir apenas as portas necessárias
5. **HTTPS**: Configure um reverse proxy (Nginx/Apache) com SSL/TLS

## 🌐 Nginx como Reverse Proxy (Opcional)

Exemplo de configuração Nginx:

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🐛 Troubleshooting

### Erro de Conexão com Banco de Dados

1. Verifique se o PostgreSQL está rodando
2. Confirme se as credenciais no `.env` estão corretas
3. Teste a conexão manualmente:
   ```bash
   psql -h localhost -U user -d mydb
   ```

### Porta já em uso

Se a porta 5000 já estiver em uso, altere no arquivo `.env`:
```env
PORT=3000
```

### PM2 não encontra o arquivo

Certifique-se de ter executado `npm run build` antes de iniciar com PM2.

## 📝 Notas

- No Replit, as variáveis de ambiente são gerenciadas automaticamente via Secrets
- Em ambiente local ou outro servidor, use o arquivo `.env`
- O sistema detecta automaticamente se está rodando no Replit (via `REPL_ID`) e ajusta o carregamento de variáveis de ambiente
