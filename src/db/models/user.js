'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username:{
      type:DataTypes.STRING,
      allowNull:false
    },
    email:{
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        isEmail: {msg: 'Must be a valid email'}
      }
    },
    password: {
      allowNull: false,
      unique:true,
      type: DataTypes.STRING
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
