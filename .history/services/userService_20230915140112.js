
import bcrypt from 'bcrypt';

export default function userService(db) {
     async function createUser({ username, email, password }) {
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const result = await db.one(`
                INSERT INTO users(username, email, password)
                VALUES($1, $2, $3)
                RETURNING id`, [username, email, hashedPassword]
            );
            return result.id;
        } catch (error) {
            console.error(`DB Error: ${error}`);
            throw new Error("Database error");
        }
    }

    async function createAdmin({ username, password }) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
    
        const result = await db.one(`
          INSERT INTO admins(username, password)
          VALUES($1, $2)
          RETURNING id`, [username, hashedPassword]
        );
        return result.id;
      }


      async function validateUserOrAdmin({ username, password }) {
        try {
          const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);
          const admin = await db.oneOrNone('SELECT * FROM admins WHERE username = $1', [username]);
      
          let account = user || admin;
          let accountType = user ? 'user' : 'admin';
      
          if (!account) {
            return null;
          }
      
          const isValidPassword = await bcrypt.compare(password, account.password);
      
          if (isValidPassword) {
            return { 
              accountType, 
              userId: account.id  // Assuming the id field is named 'id' in your database
            };
          } else {
            return null;
          }
        } catch (error) {
          console.error(`DB Error: ${error}`);
          throw new Error("Database error");
        }
      }
    


    return {
        createUser,
        validateUserOrAdmin,
        createAdmin
    };
}
