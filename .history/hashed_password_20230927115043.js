import bcrypt from "bcrypt"



const saltRounds = 10;
const password = 'lyla123';

bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) {
    console.error("Error hashing password:", err);
    return;
  }
  
  console.log("Hashed Password:", hash);

  // Manually insert 'lyla' and this hashed password into your database
});