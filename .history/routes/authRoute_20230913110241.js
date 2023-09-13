
export default function AuthRoute() {


  function logout(req, res) {
  
    if (req.session.userType === 'admin') {
      
        console.log("Admin logged out");
    } else {
        // User-specific logout logic here, if needed
        console.log("User logged out");
    }

    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/');
    });
}

    return {
        logout
    }


}



  