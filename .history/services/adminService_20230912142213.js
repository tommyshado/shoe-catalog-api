import bcrypt from 'bcrypt';

export default function adminService(db) {
  async function validateAdmin({ username, password }) {
    try {
      const admin = await db.oneOrNone('SELECT * FROM admins WHERE username = $1', [username]);

      if (!admin) {
        return null;
      }

      const isValidPassword = await bcrypt.compare(password, admin.password);

      return isValidPassword ? admin : null;
    } catch (error) {
      console.error(`DB Error: ${error}`);
      throw new Error("Database error");
    }
  }

  return {
    validateAdmin,
  };
}
