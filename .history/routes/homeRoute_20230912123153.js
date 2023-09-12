

export default function homeRoute() {

    function get(req, res) {
        const username = req.session.username;  // Assuming username is stored in the session
        res.render('index', { username });

    }
    
      return {
        get
      }


}