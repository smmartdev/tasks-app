const User = require('../models/User');

const passport = require('../config/passport'); // Adjust the path as needed


const loginUser = (req, res, next) => {
    console.log('loginUser called');

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err); // Handle error
        }
        if (!user) {
            return res.redirect('/'); // Redirect to login if user not found
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err); // Handle error
            }
            return res.redirect('/tasks'); // Redirect to home page upon successful login
        });
    })(req, res, next);
};






const renderRegisterPage = (req, res) => {
    console.log('renderRegisterPage called');

    res.render('register');
};

const registerUser = async (req, res) => {
    console.log('registerUser called');

    const { username, password } = req.body;
    try {
        const user = new User({ username, password });
        await user.save();
        res.redirect('/login');
    } catch (err) {
        res.redirect('/register');
    }
};

const renderLoginPage = (req, res) => {
    console.log('renderLoginPage called');

    res.render('login');
};

const logoutUser = (req, res) => {
    console.log('logoutUser called');

    req.logout((err) => { // Call with a callback function
        if (err) {
            console.error('Logout error:', err);
            return res.redirect('/'); // Redirect to home if logout fails
        }
        req.session.destroy((err) => { // Destroy the session
            if (err) {
                console.error('Session destroy error:', err);
                return res.redirect('/'); // Redirect to home if session destroy fails
            }
            res.redirect('/login'); // Redirect to login page after successful logout
        });
    });
};



// Export the functions
module.exports = {
    renderRegisterPage,
    registerUser,
    renderLoginPage,
    loginUser,
    logoutUser
};


