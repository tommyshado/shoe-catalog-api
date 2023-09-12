

// signupRoute.js
export default function signupRoute() {
    // Signup GET route
    async function getSignupPage(req, res) {
        res.render('signup');
    }

    return {
        getSignupPage
    };
}
