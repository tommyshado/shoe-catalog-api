


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
            const newUser = await userService.createUser({
                username,
                email,
                password
            });
            console.log('New User:', newUser);
            
    
            // Assuming 'createUser' returns an object containing 'userId' and 'accountType'
            req.session.username = username;
            req.session.userType = newUser.accountType; // Store account type in session
            req.session.userId = newUser.userId;
            console.log('Session:', req.session);
                 
    
            // Redirect based on the account type
            if (newUser.accountType === 'admin') {
                res.redirect('/shoeForm');  // Redirecting to ShoeForm.handlebars
            } else {
                res.redirect(`/client.html?user=${req.session.userId}`); // Redirecting to home page for regular users
            }
    
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
