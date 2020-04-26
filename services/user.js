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
    let appMenus = [];    

    //Recupero los que se muestran en la navBar del sistema
    let menusRootSystem = await AppMenuService.retrieveRootMenus();

    let menus = await getEnabledMenus(menusRootSystem, role, appMenus);

    return appMenus;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function getEnabledMenus(parentMenus, userRole, appMenus) {
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

          if (!rightFound) {
            rightActive = false;
          }
        }
      }
    }

    //Recupero los menus hijos del menu actual.
    let childMenus = await AppMenuService.retrieveMenusByParent(menu._id);

    //Si tiene menus hijos vuelvo a llamar a la misma funcion para activarlos/desactivarlos.
    if (childMenus && childMenus.length > 0) {
      childActive = false;
      childMenus = await getEnabledMenus(childMenus, userRole, appMenus);

      for (let i = 0; i < childMenus.length; i++) {
        let childMenu = childMenus[i];

        if (rightActive === false || rightActive === null) {
          childMenu.show = false;
        }
        menus.push(childMenu);
        //Si hay al menos un menu hijo activo el menu padre va a estar activo tambien
        childActive = childActive || childMenu.show;
      }
    }

    if (menu.neededRights && menu.neededRights.length > 0) {
      menu.show = menu.active && rightActive;
    } else {
      if (childActive !== null) {
        menu.show = menu.active && rightActive && childActive;            
      } else {
        menu.show = menu.active && rightActive;
      }
    }
    
    menus.push(menu);
    appMenus.push(await AppMenuTransform.transformToBusinessObject(menu));
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

/**
 * @description Devuelve el producto con id igual al dado como parámetro
 * @param {string} userId id del producto que se quiere recuperar.
 */
async function getUserById(userId) {
  try {
    let user = null;
    if (userId === null || userId === undefined) {
      throw new Error('Se debe especificar el id del usuario que se quiere obtener de la base de datos');
    }

    user = await UserDAO.getFullUserById(userId);

    return user;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Actualiza las propiedades dadas como parámetro del usuario con id igual al dado como parámetro.
 * @param {String} userId id del usuario a actualizar.
 * @param {JSON} bodyUpdate datos a actualizar en la base de datos.
 * @returns usuario actualizado y convertido al modelo usado en el frontend.
 */
async function update(userId, bodyUpdate) {
  try {
    let userUpdated = await UserDAO.updateUserById(userId, bodyUpdate);
    return userUpdated;
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  authenticate,
  getAll,
  create,
  deleteUser,
  getUserById,
  update
}