const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
  createEmail (newUser){
const msg = {
to: 'anku10kumar@gmail.com',
from: 'test@blocipedia.com',
subject: 'Thanks for signing up with Blocipedia',
text: 'Welcome!',
 html: '<strong>Thank you for signing up with Blocipedia. This is an email confirmation.</strong>',

};
sgMail.send(msg)
}
}
