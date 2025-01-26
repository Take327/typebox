import { getPool } from "./db";

export const getUserInfoByEmail = async (email: string) => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("Email", email)
    .query("SELECT id, name, email, auto_approval FROM Users WHERE email = @Email");

  if (result.recordset.length === 0) {
    throw new Error("User not found");
  }

  return result.recordset[0];
};
