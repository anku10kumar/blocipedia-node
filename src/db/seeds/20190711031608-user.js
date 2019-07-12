'use strict';

const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync();
const hashedPassword = bcrypt.hashSync('123456789', salt);

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      name: 'standard',
      email: 'standard@gmail.com',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 0
    },
    {
      name: 'premium',
      email: 'premium@gmail.com',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 1
    },
    {
      name: 'admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 2
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
