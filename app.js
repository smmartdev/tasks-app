const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const Task = require('./models/Task');
const User = require('./models/User');
require('./config/passport');
require('dotenv').config();


// Initialize Express app
const app = express();
const DBURL = process.env.DBURL

// Connect to MongoDB
const connectDB = async (mongoURI) => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
connectDB(DBURL);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

// Render the main page with tasks
app.get('/', isAuthenticated, async (req, res) => {
  const today = new Date().setHours(0, 0, 0, 0);

  const tasks = await Task.find({
    $or: [
      { date: today },
      { isPermanent: true }
    ],
    user: req.user.id
  }).sort({ isComplete: 1 });

  res.render('index', { tasks });
});

// Add a new task
app.post('/add', isAuthenticated, async (req, res) => {
  const { description, isPermanent } = req.body;
  const today = new Date().setHours(0, 0, 0, 0);

  await Task.create({
    description,
    isPermanent: isPermanent === 'on',
    date: today,
    user: req.user.id
  });

  res.redirect('/');
});

// Mark a task as complete
app.post('/complete/:id', isAuthenticated, async (req, res) => {
  await Task.findByIdAndUpdate(req.params.id, { isComplete: true });
  res.redirect('/');
});

// Mark all tasks as uncompleted
app.post('/uncomplete-all', isAuthenticated, async (req, res) => {
  const today = new Date().setHours(0, 0, 0, 0);
  await Task.updateMany({ user: req.user.id }, { $set: { isComplete: false } });
  res.redirect('/');
});




// Delete a task
app.post('/delete/:id', isAuthenticated, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

// Register routes
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    res.redirect('/login');
  } catch (err) {
    res.redirect('/register');
  }
});

// Login routes
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));



// Logout route
app.get('/logout', (req, res) => {
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
});


// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
