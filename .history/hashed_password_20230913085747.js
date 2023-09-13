import bcrypt from "bcrypt"


const saltRounds = 10;
const hashedPassword = await bcrypt.hash('lyla123', saltRounds);

const result = await db.one(`
  INSERT INTO admins(username, password)
  VALUES($1, $2)
  RETURNING id`, ['lyla', hashedPassword]
);
