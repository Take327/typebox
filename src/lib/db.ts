import { ConnectionPool } from "mssql";

const config = {
  user: process.env.DB_USER || "", // デフォルト値を設定
  password: process.env.DB_PASSWORD || "",
  server: process.env.DB_SERVER || "",
  database: process.env.DB_NAME || "",
  options: {
    encrypt: true, // TLS暗号化を有効化
  },
};

export const pool = new ConnectionPool(config);

pool.connect()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error:", err));
