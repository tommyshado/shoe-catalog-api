

// signupRoute.js
export default function signupRoute() {
    // Signup GET route
    async function getSignupPage(req, res) {
        res.render('signup');
    }


    async function postSignupPage(req, res) {
        const { username, email, password, confirmPassword } = req.body;
        // Validation and database logic here
    }

    return {
        getSignupPage,
        postSignupPage
    };
}
