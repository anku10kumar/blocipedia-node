const userQueries = require("../db/queries.users.js");
const passport = require('passport');
const sendGridEmail = require ("../assets/sendgrid/email.js")
const secretKey = process.env.SECRET_KEY;
const stripe = require ('stripe')(secretKey);

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
        res.render("users/profile", {...result});
      }
    });
  },

  upgradeForm(req, res, next){
     res.render('users/upgrade');
   },
   stripeForm(req, res, next){
     res.render('users/stripe')
   },
   promoteUser(req, res, next){
     if(req.user.role === 0){
       userQueries.promoteUser(req, (err, user) => {
         if(err){
           req.flash('error', err);
           res.redirect('users/upgrade');
         } else {
           req.flash('notice', "You've successfully upgraded your account to premium");
           res.redirect('/');
         }
       });
     } else {
       req.flash('notice', "You are not able to upgraded to premium");
       res.redirect('/');
     }
   },
   demoteUser(req, res, next){
     if(req.user.role === 1){
       userQueries.demoteUser(req, (err, user) => {
         if(err){
           req.flash('error', err);
           res.redirect('users/upgrade');
         } else {
           req.flash('notice', "You've successfully downgraded your account to standard");
           res.redirect('/');
         }
       });
     } else {
       req.flash('notice', "You are not able to downgrade to standard");
       res.redirect('/');
     }
   },
   chargeUser(req, res, next){

     stripe.customers.create({
       email: req.body.stripeEmail,
       source: req.body.stripeToken
     })
     .then((customer) => {
       stripe.charges.create({
         amount: 1500,
         currency: 'usd',
         customer: customer.id,
         description:'Premium Membership Upgrade'
       });
     })
     .then((charge) => {
       userQueries.promoteUser(req, (err, user) => {
         if(err){
           req.flash('error', err);
           res.redirect('users/upgrade');
         } else {
           req.flash('notice', "You've successfully upgraded your account to premium");
           res.redirect('/');
         }
       });
     })
   }





}
