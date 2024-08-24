// app.use(passport.initialize());
// app.use(passport.session());

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};


// const loginUser = passport.authenticate('local', {
//   successRedirect: '/',
//   failureRedirect: '/login'
// });


module.exports={
  isAuthenticated
}