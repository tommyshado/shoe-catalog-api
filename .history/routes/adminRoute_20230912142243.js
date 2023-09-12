export default function adminRoute(adminService) {
    async function getAdminLoginPage(req, res) {
      res.render('admin_login');
    }
  
    async function postAdminLoginPage(req, res) {
      try {
        const { username, password } = req.body;
        const admin = await adminService.validateAdmin({ username, password });
  
        if (admin) {
          req.session.adminUsername = username;
          res.redirect('/admin/dashboard');
        } else {
          throw new Error("Invalid admin credentials");
        }
      } catch (error) {
        console.error("Admin login error:", error);
        res.status(400).send(error.message);
      }
    }
  
    return {
      getAdminLoginPage,
      postAdminLoginPage
    };
  }
  