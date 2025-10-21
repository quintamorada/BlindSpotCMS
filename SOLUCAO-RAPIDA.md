# 🔧 Solução Rápida - Login e Porta

## ⚠️ Problema: Login volta para tela após "conectado com sucesso"

### Causa
O cookie de sessão não está sendo aceito pelo navegador porque:
- `NODE_ENV=production` ativa `secure: true` nos cookies
- Cookies com `secure: true` só funcionam com HTTPS
- Seu ambiente local usa HTTP (não HTTPS)

### ✅ Solução Imediata

**Configure NODE_ENV=development no seu .env:**

```bash
# Edite o arquivo .env
nano .env  # ou use seu editor preferido
```

```env
# Adicione ou altere esta linha:
NODE_ENV=development

# Mantenha as outras:
PORT=5035
DATABASE_URL=postgresql://...
SESSION_SECRET=...
```

**Reinicie a aplicação:**

```bash
# Se estiver usando npm run dev
# Pressione Ctrl+C e execute novamente:
npm run dev

# Se estiver usando PM2
pm2 restart rest-express
```

**Agora o login deve funcionar!** ✅

---

## ⚠️ Problema: Porta não é respeitada do .env com PM2

### Causa
O PM2 não carrega automaticamente o arquivo `.env`.

### ✅ Solução Aplicada

O arquivo `ecosystem.config.cjs` já foi atualizado para carregar o `.env` automaticamente.

**Para testar:**

1. **Configure o .env:**
```env
PORT=5035
NODE_ENV=development
DATABASE_URL=postgresql://...
SESSION_SECRET=...
```

2. **Pare o PM2 se estiver rodando:**
```bash
pm2 delete rest-express
```

3. **Rebuild e inicie:**
```bash
npm run build
pm2 start ecosystem.config.cjs
```

4. **Verifique a porta:**
```bash
pm2 logs rest-express
# Deve mostrar: "serving on port 5035"
```

---

## 📋 Checklist Completo

Para garantir que tudo funcione:

- [ ] Arquivo `.env` existe na raiz do projeto
- [ ] `NODE_ENV=development` está configurado no `.env`
- [ ] `PORT=5035` (ou sua porta desejada) está no `.env`
- [ ] `DATABASE_URL` está configurado corretamente
- [ ] `SESSION_SECRET` está configurado
- [ ] Se usar PM2: parou o PM2 anterior (`pm2 delete rest-express`)
- [ ] Fez rebuild (`npm run build`) antes de iniciar com PM2
- [ ] Iniciou o PM2 novamente (`pm2 start ecosystem.config.cjs`)
- [ ] Verificou os logs para confirmar a porta (`pm2 logs rest-express`)

---

## 🧪 Teste de Login

1. Acesse: `http://localhost:5035/login` (ou sua porta)
2. Use as credenciais padrão:
   - **Usuário:** `admin`
   - **Senha:** `admin123`
3. Após clicar em "Entrar":
   - ✅ Deve mostrar "Login realizado com sucesso!"
   - ✅ Deve redirecionar para `/admin`
   - ✅ Deve permanecer autenticado (não voltar para login)

---

## 🔍 Verificar se Funcionou

### Verificar Cookie no Navegador

1. Abra DevTools (F12)
2. Vá em **Application** > **Cookies**
3. Selecione `http://localhost:5035`
4. Deve ver um cookie de sessão (geralmente `connect.sid`)

Se **NÃO** ver o cookie:
- Verifique se `NODE_ENV=development` no .env
- Reinicie a aplicação
- Limpe os cookies do navegador e tente novamente

### Verificar Porta no PM2

```bash
pm2 logs rest-express | grep "serving on port"
```

Deve mostrar: `serving on port 5035`

Se mostrar porta 5000:
- Verifique o arquivo `.env`
- Execute `pm2 delete rest-express`
- Execute `pm2 start ecosystem.config.cjs` novamente

---

## 💡 Dica Final

**Para desenvolvimento local, sempre use:**
```env
NODE_ENV=development
```

**Para produção com HTTPS, use:**
```env
NODE_ENV=production
```

Isso garante que os cookies funcionem corretamente em cada ambiente!
