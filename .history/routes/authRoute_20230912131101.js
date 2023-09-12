
export default function AuthRoute() {


    function logout(req, res) {

        req.session.destroy((err) => {
            if(err) {
              return console.log(err);
            }
            res.redirect('/');
          });
    }


    return {
        logout
    }


}



  