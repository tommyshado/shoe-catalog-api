
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


    async function validateUser({ username, password }) {
        try {
            // Fetch user by username
            const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);

            // If user not found, return null
            if (!user) {
                return null;
            }

            // Compare the hashed password with the plaintext password
            const isValidPassword = await bcrypt.compare(password, user.password);

            if (isValidPassword) {
                return user;  // Return the user object if valid
            } else {
                return null;  // Return null if password is invalid
            }

        } catch (error) {
            console.error(`DB Error: ${error}`);
            throw new Error("Database error");
        }
    }


    return {
        createUser,
        validateUser
    };
}
