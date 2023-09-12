
export default function loginRoute(userService) {
    async function getLoginPage(req, res) {
      res.render('login');
    }
  
    async function postLoginPage(req, res) {
      try {
        const { username, password } = req.body;
  
        const user = await userService.validateUser({ username, password });
  
        if (user) {
          req.session.username = username;
          res.redirect('/home');
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
  
