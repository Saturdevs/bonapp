const expressJwt = require('express-jwt');
const { secret } = require('../../config');
const UserRoleService = require('../../services/userRole');
const HttpStatus = require('http-status-codes');

function authorize(rights = []) {
  // authenticate JWT token and attach user to request object (req.user)
  expressJwt({ secret }),

  // authorize based on user rights
  async (req, res, next) => {
    let userRole = await UserRoleService.getUserRole(req.user.roleId);
    
    if (!userRole) {
      // user's role is not authorized
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
    }

    // authentication and authorization successful
    next();
  }
}

module.exports = authorize;