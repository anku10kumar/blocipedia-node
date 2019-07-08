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
          } else{
            console.log('User added');
            passport.authenticate('local')(req, res, () => {
              req.flash('notice','Sign in successful');
              res.redirect('/');
              sendGridEmail.createEmail(newUser);
            })
          }
        });

      }
}
