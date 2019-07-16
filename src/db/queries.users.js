const User = require("./models").User;
const bcrypt = require("bcryptjs");

module.exports = {

  createUser(newUser, callback){


    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);


    return User.create({
      name: newUser.name,
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getUser(id, callback){
    let result = {};
    User.findById(id)
    .then((user) => {
      if(!user) {
        callback(404);
      } else {
        result["user"] = user;

        callback(null, result);
      }
    })
    .catch((err) => {
      callback(err);
    });
  },
  promoteUser(req, callback){
    return User.update(
      {role: 1},
      {where: {id: req.user.id}}
    )
    .then((updatedRows) => {
      callback(null, updatedRows);
    })
    .catch((err) => {
      callback(err);
    })
  },
  demoteUser(req, callback){
    return User.update(
      {role: 0},
      {where: {id: req.user.id}}
    )
    .then((updatedRows) => {
      callback(null, updatedRows);
    })
    .catch((err) => {
      callback(err);
    })
  }

}
