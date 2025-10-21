import dotenv from "dotenv";

// Load .env file only when running locally (not on Replit)
// Replit uses Secrets which are already available in process.env
if (!process.env.REPL_ID) {
  dotenv.config();
  console.log("[ENV] Loading environment variables from .env file (local environment)");
} else {
  console.log("[ENV] Using Replit Secrets for environment variables");
}
