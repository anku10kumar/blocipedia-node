'use strict';
const faker = require("faker");

 let wikis = [
   {
     title: faker.hacker.noun(),
     body: faker.hacker.phrase(),
     private: false,
     createdAt: new Date(),
     updatedAt: new Date(),
     userId: 2
   },
   {
     title: faker.hacker.noun(),
     body: faker.hacker.phrase(),
     private: false,
     createdAt: new Date(),
     updatedAt: new Date(),
     userId: 3
   },
   {
     title: faker.hacker.noun(),
     body: faker.hacker.phrase(),
     private: false,
     createdAt: new Date(),
     updatedAt: new Date(),
     userId: 3
   },
   {
     title: faker.hacker.noun(),
     body: faker.hacker.phrase(),
     private: false,
     createdAt: new Date(),
     updatedAt: new Date(),
     userId: 1
   },
   {
     title: faker.hacker.noun(),
     body: faker.hacker.phrase(),
     private: false,
     createdAt: new Date(),
     updatedAt: new Date(),
     userId: 2
   },
   {
     title: faker.hacker.noun(),
     body: faker.hacker.phrase(),
     private: false,
     createdAt: new Date(),
     updatedAt: new Date(),
     userId: 3
   },
   {
     title: faker.hacker.noun(),
     body: faker.hacker.phrase(),
     private: false,
     createdAt: new Date(),
     updatedAt: new Date(),
     userId: 1
   },
   {
     title: faker.hacker.noun(),
     body: faker.hacker.phrase(),
     private: false,
     createdAt: new Date(),
     updatedAt: new Date(),
     userId: 2
   },
 ];

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert("Wikis", wikis, {});

  },

  down: (queryInterface, Sequelize) => {
  
    return queryInterface.bulkDelete("Wikis", null, {});

  }
};
