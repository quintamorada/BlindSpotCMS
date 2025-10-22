# 🚀 Deploy em Produção - Correção de Sessão HTTPS

## Problema Resolvido
A sessão não estava sendo mantida em produção com HTTPS porque faltava a configuração `trust proxy` no Express.

## O que foi alterado
✅ Adicionado `app.set('trust proxy', 1)` para funcionar com proxy reverso (nginx, etc)  
✅ Configuração `proxy: true` na sessão para produção  
✅ Cookie `secure: true` apenas em produção com HTTPS  
✅ Sessões já estão no PostgreSQL (connect-pg-simple), funcionam com PM2 cluster mode

---

## 🔧 Passos para Deploy

### 1. No seu servidor de produção, execute:

```bash
# Navegue até a pasta do projeto
cd /caminho/para/seu/projeto

# Faça pull das alterações
git pull origin main

# Instale dependências (se necessário)
npm install

# Build da aplicação
npm run build

# Restart do PM2
pm2 restart rest-express
```

### 2. OU use o script auxiliar:

```bash
# Isso faz tudo de uma vez: pull + install + build + restart
./pm2-commands.sh deploy
```

---

## ✅ Verificação

Após o deploy, teste o login:

1. Acesse: `https://seu-dominio.com/login`
2. Faça login com suas credenciais
3. Você deve permanecer logado

---

## 🔍 Troubleshooting

### Se ainda não funcionar:

**1. Verifique as variáveis de ambiente:**
```bash
# Confirme que existe um SESSION_SECRET no .env
cat .env | grep SESSION_SECRET
```

Se não existir, adicione:
```bash
echo "SESSION_SECRET=$(openssl rand -base64 32)" >> .env
```

**2. Verifique se NODE_ENV está como production:**
```bash
pm2 env rest-express | grep NODE_ENV
```

**3. Verifique os logs:**
```bash
pm2 logs rest-express
```

**4. Se estiver usando nginx como proxy reverso, confirme que está passando os headers corretos:**

Seu nginx deve ter algo assim:
```nginx
location / {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

O mais importante é `X-Forwarded-Proto $scheme` para que o Express saiba que está atrás de HTTPS.

---

## 📝 Notas Técnicas

- **Sessões**: Salvas no PostgreSQL via `connect-pg-simple`
- **PM2 Cluster Mode**: Funciona porque sessões estão no DB, não em memória
- **HTTPS**: Cookie com `secure: true` em produção
- **Trust Proxy**: Necessário para ler headers X-Forwarded-* do nginx/proxy

---

## 🆘 Precisa de Ajuda?

Se continuar com problema, verifique:
1. Logs do PM2: `pm2 logs rest-express`
2. Logs do nginx: `tail -f /var/log/nginx/error.log`
3. Console do navegador (F12) - veja se o cookie está sendo definido
