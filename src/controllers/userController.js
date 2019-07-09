const userQueries = require("../db/queries.users.js");
const passport = require('passport');
const sendGridEmail = require ("../assets/sendgrid/email.js")

module.exports = {
    signup(req, res, next) {
        res.render('users/signup');
      },
      create(req, res, next){

        let newUser = {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          passwordConfirmation: req.body.passwordConfirmation
        };

        userQueries.createUser(newUser, (err,user) => {
          if(err) {

            req.flash('error',err);
            res.redirect('/users/signup');
          } else {
            passport.authenticate('local')(req, res, () => {
              req.flash("notice","You've successfully signed in!");
              res.redirect('/');
              sendGridEmail.createEmail(newUser);
            })
          }
        });

      },

      signInForm(req, res, next){
  res.render("users/signin");
},
signIn(req, res, next){
  passport.authenticate("local")(req, res, function() {
    if(!req.user){
      req.flash("notice", "Sign in failed. Please try again.")
      res.redirect("/users/signin");
    } else {
      req.flash("notice", "You've successfully signed in!");
      res.redirect("/");
    }
  })
},
signOut(req, res, next){
  req.logout();
  req.flash("notice", "You've successfully signed out!");
  res.redirect("/");
},

show(req, res, next){

   // #1
    userQueries.getUser(req.params.id, (err, result) => {

   // #2
      if(err || result.user === undefined){
        req.flash("notice", "No user found with that ID.");
        res.redirect("/");
      } else {

   // #3
        res.render("users/show", {...result});
      }
    });
  }


}
