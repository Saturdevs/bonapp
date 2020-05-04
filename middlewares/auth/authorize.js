const expressJwt = require('express-jwt');
const { SECRET_TOKEN } = require('../../config');
const UserRoleService = require('../../services/userRole');
const RightService = require('../../services/right');
const HttpStatus = require('http-status-codes');

function authorize() {
  return [
    // authenticate JWT token and attach user to request object (req.user)
    expressJwt({ secret: SECRET_TOKEN }),

    // authorize based on user rights
    async (req, res, next) => {
      let userRole = await UserRoleService.getUserRole(req.user.roleId);
      
      if (!userRole) {
        // user's role is not authorized
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
      } else {
        const userRoleRights = Array.from(userRole.rights).map(v => v.toJSON());
        const urlPathColection = req.baseUrl.substring(5);
        const routePath = req.route.path;
        const httpMethod = req.method.toLowerCase();
        const right = await RightService.getRightsByColectionAndMethod(urlPathColection, routePath, httpMethod);
        if (right) {
          const userRight = userRoleRights.find(r => r.rightId === right._id);

          if (userRight && userRight.active) {
            // authentication and authorization successful
            next();
          } else {
            // user's role is not authorized
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
          }
        } else {
          // user's role is not authorized
          return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
        }        
      }
    }
  ];
}

module.exports = authorize;