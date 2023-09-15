
export default function loginRoute(userService) {
    async function getLoginPage(req, res) {
      res.render('login');
    }
    async function postLoginPage(req, res) {
      try {
        const { username, password } = req.body;
    
        const validatedAccount = await userService.validateUserOrAdmin({ username, password });
    
        if (validatedAccount) {
          req.session.username = username;
          req.session.userType = validatedAccount.accountType;
          req.session.userId = validatedAccount.userId;  // Store user ID in session
    
          if (validatedAccount.accountType === 'admin') {
            res.redirect('/shoeForm');  // Redirecting to ShoeForm.handlebars
          } else {
            res.redirect('/'); // Redirecting to home page for regular users
          }
        } else {
          throw new Error("Invalid credentials");
        }
      } catch (error) {
        console.error("Login error:", error);
        res.status(400).send(error.message);
      }
    }
    
    
    
  
    return {
      getLoginPage,
      postLoginPage
    };
  }
  
