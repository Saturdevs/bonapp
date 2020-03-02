'use strice'

const UserDAO = require('../dataAccess/user');
const UserRoleService = require('../services/userRole');
const AppMenuService = require('../services/appMenu');
const User = require('../models/user');
const AppMenuTransform = require('../transformers/appMenu');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const moment = require('moment');
const config = require('../config');

async function authenticate({ username, password }) {
  const user = await getUserByUsernameWithEnabledMenus(username);
  if (user && bcrypt.compareSync(password, user.password)) {
    const menus = user.menus;
    const rights = user.rights;
    const { password, ...userWithoutHash } = user.toObject();
    const token = await generateJWT(user);
    return {
      ...userWithoutHash,
      token,
      menus,
      rights
    };
  }
}

/**
 * @description Genera el token para el usuario dado como parametro.
 * @param {User} user 
 */
async function generateJWT(user) {
  const payload = {
    sub: user._id,
    username: user.username,
    roleId: user.roleId,
    iat: moment().unix(),
    exp: moment().add(60, 'days').unix()
  }

  return jwt.sign(payload, config.SECRET_TOKEN)
};

/**
 * @description Devuelve el usuario con username igual al dado como parametro con los menus que se encuentran
 * habilitados para ese usuario segun su rol.
 * @param {String} username 
 * @returns {User} usuario recuperado de la base de datos.
 */
async function getUserByUsernameWithEnabledMenus(username) {
  try {
    let query = { username: username };
    let user = await UserDAO.getUserByQuery(query);

    //Recupero el rol del usuario.
    let role = await UserRoleService.getUserRole(user.roleId);

    //Recupero todos los menus en la tabla appMenus habilitados o deshabilitados según
    //el rol del usuario.
    let menusSystemForUser = await getMenusSystem(role);
    user.menus = menusSystemForUser;

    user.rights = role.rights;

    return user;
  }
  catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Habilita o deshabilita los menus padres dados como parametros segun los permisos del rol
 * de usuario dado como parametro y segun los menus hijos.
 * @param {*} role rol de usuario segun el cual habilitar/deshabilitar menus
 */
async function getMenusSystem(role) {
  try {
    let menus = [];

    //Recupero los que se muestran en la navBar del sistema
    let menusRootSystem = await AppMenuService.retrieveRootMenus();

    menus = getEnabledMenus(menusRootSystem, role);

    return menus;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function getEnabledMenus(parentMenus, userRole) {
  let menus = [];

  for (let k = 0; k < parentMenus.length; k++) {
    let menu = parentMenus[k];
    let childActive = null;
    let rightActive = null;

    //Si el menu esta activo en la bd y tiene permisos requeridos verifico que el usuario tenga todos
    //los permisos.
    if (menu.active) {
      rightActive = true;
      if (menu.neededRights && menu.neededRights.length > 0) {
        //Buscamos cada permiso que el menu necesita para estar activo dentro de los permisos del rol de usuario.
        //Si encontramos al menos un permiso necesario para activar el menu inactivo terminamos el loop.
        for (let i = 0; i < menu.neededRights.length && rightActive; i++) {
          let right = menu.neededRights[i];
          //Sirve para cortar el bucle cuando ya encontramos el permiso
          let rightFound = false;

          for (let j = 0; j < userRole.rights.length && !rightFound; j++) {
            let userRight = userRole.rights[j];

            if (userRight.rightId === right.rightName) {
              rightFound = true;
              if (!userRight.active) {
                rightActive = false;
              }
            }
          }
        }
      }
    }

    //Recupero los menus hijos del menu actual.
    let childMenus = await AppMenuService.retrieveMenusByParent(menu._id);

    //Si tiene menus hijos vuelvo a llamar a la misma funcion para activarlos/desactivarlos.
    if (childMenus && childMenus.length > 0) {
      childMenus = await getEnabledMenus(childMenus, userRole);

      for (let i = 0; i < childMenus.length; i++) {
        let childMenu = childMenus[i];

        if (rightActive === false || rightActive === null) {
          childMenu.show = false;
        }
        menus.push(childMenu);
        //Si hay al menos un menu hijo activo el menu padre va a estar activo tambien
        childActive = childActive && childMenu.active;
      }
    }

    if (menu.active === false) {
      menu.show = false;
    } else {
      if (rightActive === null) {
        menu.show = childActive;
      } else {
        menu.show = rightActive;
      }
    }
    
    menus.push(await AppMenuTransform.transformToBusinessObject(menu));
  }

  return menus;
}

/**
 * @description Devuelve todos los usuarios de la base de datos.
 * @returns {User[]} usuarios recuperados de la base de datos.
 */
async function getAll() {
  try {
    return await UserDAO.getUsersSortedByQuery({});
  }
  catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Crea un nuevo usuario y lo guarda en la base de datos.
 * @param {JSON} userParam datos con los que se va a crear el nuevo usuario.
 */
async function create(userParam) {
  try {
    const user = new User(userParam);
    return await UserDAO.save(user);
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Elimina el usuario dado como parámetro de la base de datos.
 * @param {User} user usuario a eliminar de la base de datos.
 */
async function deleteUser(user) {
  try {
    await UserDAO.remove(user);
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  authenticate,
  getAll,
  create,
  deleteUser
}