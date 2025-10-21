module.exports = {
  apps: [
    {
      name: "rest-express",
      script: "dist/index.js",
      instances: 1,
      exec_mode: "cluster",
      // As variáveis de ambiente serão carregadas do arquivo .env
      // Você também pode passar variáveis via linha de comando: pm2 start ecosystem.config.cjs --env production
      env: {
        NODE_ENV: "production",
        // PORT será carregada do .env ou você pode definir aqui se necessário
        // PORT: 5000,
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
