const express = require('express');
const router = express.Router();



const {
    renderRegisterPage,
    registerUser,
    renderLoginPage,
    logoutUser,
    loginUser
} = require('../controllers/userControllers'); // Adjust the path as necessary


// Registration routes
router.get('/register', renderRegisterPage);
router.post('/register', registerUser);

// Login routes
router.post('/login', loginUser);

// router.post('/login', loginUser);

// Logout route
router.get('/logout', logoutUser);



module.exports = router;
