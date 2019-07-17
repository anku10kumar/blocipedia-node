'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {msg: "must be a valid email"}
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Wiki, {
      foreignKey: "userId",
      as: "wikis"
    });
  };

  User.prototype.isPremium = function() {
    return this.role === 1;
  };

  User.prototype.isAdmin = function() {
    return this.role === 2;
  };

  User.prototype.isOwner = function(userId){
    return this.id === userId;
  };

  User.prototype.isPremiumOwner = function(userId){
    return this.role === 1 && this.id === userId;
  };


  return User;
};
