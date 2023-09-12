


export default function userService(db) {


     function createUser({ username, email, password }) {
        // Simulate database insertion and return a new user ID
        // In a real app, you'd use SQL commands to insert the data into a database
        console.log(`Inserting user ${username} into the database.`);
        return 1;  // Simulated user ID
    }

    return {
        createUser
    }

}