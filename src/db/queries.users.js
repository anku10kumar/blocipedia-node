const User = require('./models').User;
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
module.exports = {
    createUser(newUser, callback){
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(newUser.password, salt);

          sgMail.setApiKey(process.env.SENDGRID_API_KEY);
          const msg = {
          to: newUser.email,
          from: 'anku10kumar@gmail.com',
          subject: 'Thanks for signing up with Blocipedia',
          text: 'Hello ' + newUser.username + 'Welcome!',

          };
          sgMail.send(msg);
        return User.create({
            username: newUser.username,
            email: newUser.email,
            password: hashedPassword
        })
        .then((user) => {
            callback(null, user);
        })
        .catch((err) => {
            console.log(err);
            callback(err);
        })
    }
};
