require('dotenv').config();

module.exports = {
  apps: [
    {
      name: "rest-express",
      script: "dist/index.js",
      instances: 1,
      exec_mode: "cluster",
      // Carregar variáveis do arquivo .env
      // O require('dotenv').config() acima carrega o .env antes de passar para o PM2
      env: {
        NODE_ENV: process.env.NODE_ENV || "production",
        PORT: process.env.PORT || "5000",
        DATABASE_URL: process.env.DATABASE_URL,
        SESSION_SECRET: process.env.SESSION_SECRET,
      },
      env_production: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
      // PM2 will restart the app if it crashes
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      // Logs
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
    },
  ],
};
