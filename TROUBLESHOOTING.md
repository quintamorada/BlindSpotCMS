# Troubleshooting - Problemas Comuns

## 🔌 Porta não está sendo respeitada do arquivo .env

### Problema
Você configurou `PORT=5035` no arquivo `.env`, mas o sistema está subindo na porta 5000.

### Diagnóstico

Execute o seguinte comando para verificar se o .env está sendo carregado:

```bash
node test-env-loading.js
```

Isso mostrará quais variáveis estão sendo carregadas e se há algum problema.

### Possíveis Causas

#### 1. Arquivo .env não existe ou está no lugar errado
**Solução:**
```bash
# Verifique se o arquivo existe na raiz do projeto
ls -la .env

# Se não existir, copie do exemplo
cp .env.example .env

# Edite o arquivo
nano .env  # ou vim .env, ou use seu editor preferido
```

#### 2. Variável PORT está sendo sobrescrita por variável de ambiente do sistema

Em alguns sistemas, pode haver uma variável `PORT` já definida no ambiente do sistema operacional que sobrescreve o .env.

**Verificar:**
```bash
# No Linux/Mac
echo $PORT

# No Windows (PowerShell)
echo $env:PORT

# No Windows (CMD)
echo %PORT%
```

**Solução:**
```bash
# Remover a variável do ambiente (temporário - apenas para o terminal atual)
unset PORT  # Linux/Mac
$env:PORT = $null  # PowerShell
set PORT=  # Windows CMD

# Ou executar diretamente com a porta desejada
PORT=5035 npm run dev  # Linux/Mac
$env:PORT=5035; npm run dev  # PowerShell
```

#### 3. Executando no Replit

Se você está executando no Replit, a porta **sempre** será 5000, independentemente do que você configurar no .env, porque:
- Apenas a porta 5000 não está bloqueada pelo firewall do Replit
- O Replit usa Secrets em vez do arquivo .env

**No Replit:** Não tente mudar a porta - use sempre 5000.

**Localmente:** Configure PORT no arquivo .env normalmente.

### Solução Definitiva

Para garantir que está carregando do .env localmente:

**1. Verifique o conteúdo do seu .env:**
```bash
cat .env
```

Deve ter algo como:
```env
PORT=5035
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
NODE_ENV=development
SESSION_SECRET=your-secret-key
```

**2. Execute com logs de debug:**

Quando você executar `npm run dev` localmente, você verá:
```
[ENV] ✅ Variáveis de ambiente carregadas do arquivo .env
[ENV] 📋 Variáveis carregadas: PORT, DATABASE_URL, NODE_ENV, SESSION_SECRET
[ENV] 🔌 PORT configurada: 5035
[ENV] 🗄️  DATABASE_URL: definida
```

Se você ver isso mas ainda assim subir na porta 5000, significa que há uma variável de ambiente do sistema sobrescrevendo.

**3. Forçar a porta via linha de comando (solução temporária):**

```bash
# Linux/Mac
PORT=5035 npm run dev

# Windows PowerShell
$env:PORT=5035; npm run dev

# Windows CMD
set PORT=5035 && npm run dev
```

## 🔐 Sessão não persiste após login

### Problema
Após fazer login, você é redirecionado de volta para a tela de login.

### Causas Possíveis e Soluções

#### 1. Cookie "secure" em ambiente HTTP

**Problema:** Se `NODE_ENV=production` e você está testando localmente com HTTP (não HTTPS), o navegador não aceita cookies com a flag `secure: true`.

**Solução:**
```bash
# Para desenvolvimento local, use NODE_ENV=development
NODE_ENV=development npm run dev

# OU
# Para PM2 local, configure no .env:
NODE_ENV=development
```

**Verificar no navegador:**
1. Abra DevTools (F12)
2. Vá em "Application" > "Cookies"
3. Veja se o cookie de sessão está sendo criado
4. Se não estiver, provavelmente é problema de `secure: true` com HTTP

#### 2. Sessão não está sendo salva

**Solução:** Já corrigido - a sessão é salva explicitamente com `req.session.save()` antes de retornar a resposta.

#### 3. Tabela de sessão não existe

**Verificar:**
```bash
psql $DATABASE_URL -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"
```

**Criar se necessário:**
A tabela é criada automaticamente pelo `connect-pg-simple` com a opção `createTableIfMissing: true`.

#### 4. Limpar sessões antigas

```bash
psql $DATABASE_URL -c "DELETE FROM session;"
```

#### 5. Reiniciar o servidor

Sempre reinicie após mudanças de configuração:
```bash
# Desenvolvimento
npm run dev

# PM2
pm2 restart rest-express
```

## 🗄️ Erro de conexão com banco de dados

### No Replit
As variáveis são gerenciadas via Secrets. Verifique se o Secret `DATABASE_URL` está configurado.

### Localmente
1. Verifique se o PostgreSQL está rodando:
```bash
# Linux/Mac
sudo systemctl status postgresql
# ou
pg_isready

# Verificar se a porta padrão está ouvindo
netstat -an | grep 5432
```

2. Teste a conexão manualmente:
```bash
psql "$DATABASE_URL"
# ou
psql -h localhost -U seu_usuario -d seu_banco
```

3. Verifique o .env:
```bash
cat .env | grep DATABASE_URL
```

Formato correto:
```
DATABASE_URL=postgresql://usuario:senha@localhost:5432/nome_do_banco
```

## 📦 Problemas com PM2

### PM2 não encontra o arquivo
```bash
# Certifique-se de fazer o build primeiro
npm run build

# Verifique se a pasta dist existe
ls -la dist/

# Inicie novamente
pm2 start ecosystem.config.cjs
```

### PM2 continua reiniciando
```bash
# Veja os logs de erro
pm2 logs rest-express --err

# Verifique o status
pm2 status

# Descreva o processo
pm2 describe rest-express
```

Geralmente é problema de variável de ambiente. Certifique-se de que o arquivo `.env` existe na raiz do projeto.

## 🔍 Como obter ajuda

1. **Verifique os logs:**
```bash
# Em desenvolvimento
npm run dev
# Olhe as mensagens [ENV] no console

# Com PM2
pm2 logs rest-express
```

2. **Execute o teste de ambiente:**
```bash
node test-env-loading.js
```

3. **Verifique as variáveis de ambiente em runtime:**
Adicione temporariamente no `server/index.ts`:
```javascript
console.log("PORT em runtime:", process.env.PORT);
console.log("Todas as variáveis:", Object.keys(process.env).filter(k => !k.includes('SECRET')));
```
