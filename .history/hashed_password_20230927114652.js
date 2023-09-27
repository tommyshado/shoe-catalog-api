// Your route file or some initialization script
import userService from './path/to/your/userService';

async function registerAdmin() {
  try {
    const username = "lyla";
    const password = "lyla123";

    const db = "postgres://yqbcnddb:GH91h_xU4aJ791DWfQZ3bhpVE2ALkHO3@berry.db.elephantsql.com/yqbcnddb"
    const service = userService(db);

    const adminId = await service.createAdmin({ username, password });
    console.log(`Admin created with ID: ${adminId}`);
  } catch (error) {
    console.error("Failed to create admin:", error);
  }
}

// Run the function to actually create the admin
// This is just a one-time setup, so you might want to run it manually
registerAdmin();
