

// signupRoute.js
export default function signupRoute() {
    // Signup GET route
    async function getSignupPage(req, res) {
        res.render('signup', {
            // Add any additional variables you want to pass to the Handlebars template here
        });
    }

    return {
        getSignupPage
    };
}
