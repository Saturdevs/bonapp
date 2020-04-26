'use strict'

const UserDAO = require('../dataAccess/user');

/**
 * Transforma el rol de usuario dado como parámetro al objeto userRole usado en el front end.
 * Ver modelo en front end
 * @param {UserRole} userRoleEntity 
 */
async function transformToBusinessObject(userRoleEntity) {
  if (userRoleEntity !== null && userRoleEntity !== undefined) {
    let userRoleToReturn = JSON.parse(JSON.stringify(userRoleEntity));

    let users = await UserDAO.countUsersByRole(userRoleEntity._id);
    userRoleToReturn.users = users;

    return userRoleToReturn;
  }
}

module.exports = {
  transformToBusinessObject
}