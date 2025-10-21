import dotenv from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";

// Load .env file only when running locally (not on Replit)
// Replit uses Secrets which are already available in process.env
if (!process.env.REPL_ID) {
  const envPath = resolve(process.cwd(), '.env');
  const envExists = existsSync(envPath);
  
  if (envExists) {
    const result = dotenv.config();
    
    if (result.error) {
      console.error("[ENV] ❌ Erro ao carregar arquivo .env:", result.error.message);
    } else {
      console.log("[ENV] ✅ Variáveis de ambiente carregadas do arquivo .env");
      console.log("[ENV] 📋 Variáveis carregadas:", Object.keys(result.parsed || {}).join(", "));
      console.log("[ENV] 🔌 PORT configurada:", process.env.PORT || "não definida (usando padrão 5000)");
      console.log("[ENV] 🗄️  DATABASE_URL:", process.env.DATABASE_URL ? "definida" : "não definida");
    }
  } else {
    console.warn("[ENV] ⚠️  Arquivo .env não encontrado em:", envPath);
    console.warn("[ENV] 💡 Copie .env.example para .env e configure suas variáveis");
  }
} else {
  console.log("[ENV] ☁️  Usando Replit Secrets para variáveis de ambiente");
  console.log("[ENV] 🔌 PORT:", process.env.PORT || "5000 (padrão)");
}
