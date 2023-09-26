


export default function signupRoute(userService) {
    async function getSignupPage(req, res) {
        res.render('signup');
    }

    // POST route for form submission
    async function postSignupPage(req, res) {
        try {
       
            // Get data from form submission
            const { username, email, password, confirmPassword } = req.body;
            console.log('Received Signup Data:', { username, email, password, confirmPassword });
            
            // Validate and sanitize the data (you'd do this more thoroughly in a real app)
            if (!username || !email || !password || !confirmPassword) {
                throw new Error("All fields are required.");
            }

            if (password !== confirmPassword) {
                throw new Error("Passwords do not match.");
            }

            // Insert into database (via service function)
             await userService.createUser({
                username,
                email,
                password
            });

            req.session.username = username;

            // Redirect to the home page
            res.redirect('/home');

        } catch (error) {
            // Handle error (you'd also log this in a real app)
            console.error("Signup error:", error);
            res.status(400).send(error.message);
        }
    }

    return {
        getSignupPage,
        postSignupPage
    };
}
