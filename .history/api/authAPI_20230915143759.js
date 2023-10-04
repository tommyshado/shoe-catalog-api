


export default function AuthApi(app) {

    function checkSession() {
        app.get('/api/check-session', (req, res) => {
            if (req.session && req.session.username) {
              res.json({ loggedIn: true });
            } else {
              res.json({ loggedIn: false });
            }
          });
    }

    function addLogoutRoute() {
        app.get('/api/logout', (req, res) => {
          if (req.session) {
            req.session.destroy((err) => {
              if (err) {
                res.json({ success: false, message: 'Logout failed' });
                return;
              }
              res.json({ success: true, message: 'Successfully logged out' });
            });
          } else {
            res.json({ success: false, message: 'No session to destroy' });
          }
        });
      }


    return {
        checkSession,
        addLogoutRoute
    }
   
}