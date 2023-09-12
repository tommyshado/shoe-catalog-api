

export default function userService(db) {
    async function createUser({ username, email, password }) {
       try {
           const result = await db.one(`
               INSERT INTO users(username, email, password)
               VALUES($1, $2, $3)
               RETURNING id`, [username, email, password]
           );
           return result.id;
       } catch (error) {
           console.error(`DB Error: ${error}`);
           throw new Error("Database error");
       }
   }

   return {
       createUser
   };
}
