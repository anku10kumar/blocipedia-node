module.exports = {
    validateUsers(req, res, next) {
      if (req.method === "POST") {

        req.checkBody("email", "must be valid").isEmail();
        req.checkBody("password", "must be at least 6 characters in length").isLength({
          min: 6
        })
        req.checkBody("passwordConfirmation", "must match password provided").optional().matches(req.body.password);
      }

      const errors = req.validationErrors();


      if (errors) {
        req.flash("error", errors);
        return res.redirect(req.headers.referer);
      } else {
        return next();
      }
    },

    validateUsersSignIn(req, res, next) {
    if (req.method === "POST") {
      req
        .checkBody("username", "must be at least 6 characters in length")
        .isLength({ min: 6 });
      req
        .checkBody("password", "must be at least 6 characters in length")
        .isLength({ min: 6 });
    }

    const errors = req.validationErrors();

    if (errors) {
      req.flash("error", errors);
      return res.redirect(req.headers.referer);
    } else {
      return next();
    }
  },

  validateWiki(req, res, next) {
    if (req.method === "POST") {
      req
        .checkBody("title", "must be at least 8 characters in length")
        .isLength({ min: 8 });
      req
        .checkBody("body", "must be at least 10 characters in length")
        .isLength({ min: 10 });
    }

    const errors = req.validationErrors();
    if (errors) {
      req.flash("error", errors);
      return res.redirect(303, req.headers.referer);
    } else {
      return next();
    }
  }


};
