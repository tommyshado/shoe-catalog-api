


export default function AuthApi() {

    function checkSession() {
        app.get('/api/check-session', (req, res) => {
            if (req.session && req.session.username) {
              res.json({ loggedIn: true });
            } else {
              res.json({ loggedIn: false });
            }
          });
    }


    return {
        checkSession
    }
   
}