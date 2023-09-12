

export default function homeRoute() {

    function get(req, res) {
        const username = req.session.username;  
        res.render('index', { username });

    }
    
      return {
        get
      }


}