'use strict'

const UserRole = require('../models/userRole');
const UserRoleDAO = require('../dataAccess/userRole');
const UserRoleTransform = require('../transformers/userRole');
const AppMenuService = require('../services/appMenu');
const RightService = require('../services/right');
const ROLE_USER_APP = "UserApp";

/**
 * @description Devuelve todos los roles de usuario almacenados en la base de datos
 * sin el atributo de permisos (rigths) ordenados por nombre.
 * @returns userRoles recuperados de la bd.
 */
async function getAllUserRolesWithoutRights() {
  try {
    let rolesToReturn = [];
    let projection = { rights: 0 };
    let roles = await UserRoleDAO.getAllUserRolesByQuerySorted({}, projection);

    if (roles !== null && roles !== undefined && roles.length > 0) {
      for (let i = 0; i < roles.length; i++) {
        const role = roles[i];
        if (role.name !== ROLE_USER_APP) {
          rolesToReturn.push(await UserRoleTransform.transformToBusinessObject(role));
        }
      }
    }

    return rolesToReturn;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Devuelve el rol de usuario con id igual al dado como parámetro.
 * @param {string} userRoleId id del rol de usuario que se quiere recuperar.
 * @returns userRole recuperado de la base de datos.
 */
async function getUserRole(userRoleId) {
  try {
    if (userRoleId === null || userRoleId === undefined) {
      throw new Error('Se debe especificar el id del rol de usuario que se quiere obtener de la base de datos');
    }

    return await UserRoleDAO.getUserRoleById(userRoleId);
  }
  catch (err) {
    throw new Error(err);
  }
}

async function getAllUserRoles(){
  try {
    let query = {};
    return await UserRoleDAO.getAllUserRolesByQuerySorted(query);
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Devuelve el rol de usuario con id igual al dado como parámetro con los permisos organizados segun
 * el menu en el que se van a mostrar en el sistema.
 * @param {string} userRoleId id del rol de usuario que se quiere recuperar.
 * @returns userRole recuperado de la base de datos.
 */
async function getUserRoleWithRightsByMenu(userRoleId) {
  try {
    let rightsByMenu = [];
    let userRole = new UserRole();
    userRole = await getUserRole(userRoleId);

    let appRootMenus = await AppMenuService.retrieveRootMenus();
    await getRightsByMenu(appRootMenus, userRole, rightsByMenu);

    let userRoleToReturn = JSON.parse(JSON.stringify(userRole));
    userRoleToReturn.rightsByMenu = rightsByMenu;

    return userRoleToReturn;
  }
  catch (err) {
    throw new Error(err);
  }
}

async function getRightsByMenu(appMenus, userRole, rightsByMenu) {
  for (let i = 0; i < appMenus.length; i++) {
    const appMenu = appMenus[i];
    const childMenus = await AppMenuService.retrieveMenusByParent(appMenu);

    if (appMenu.displayedRights !== null && appMenu.displayedRights !== undefined && appMenu.displayedRights.length > 0) {
      const appMenuWithRights = {};
      appMenuWithRights.menuId = appMenu._id;
      appMenuWithRights.rights = [];

      for (let j = 0; j < appMenu.displayedRights.length; j++) {
        const right = appMenu.displayedRights[j];
        const rigthToReturn = {};
        rigthToReturn._id = right.rightName;
        rigthToReturn.active = false;

        if (right.rightName.startsWith("group-")) {
          const groupName = right.rightName.substring(right.rightName.indexOf("-") + 1);
          const rightsForGroup = await RightService.getRightsByGroup(groupName);

          for (let k = 0; k < rightsForGroup.length; k++) {
            const rightForGroup = { rightName: rightsForGroup[k]._id };
            const rightActive = await isRightActive(rightForGroup, userRole);

            rigthToReturn.active = rigthToReturn.active || rightActive;
          }
        } else {
          rigthToReturn.active = await isRightActive(right, userRole);
        }

        appMenuWithRights.rights.push(rigthToReturn);
      }

      rightsByMenu.push(appMenuWithRights);

      await getRightsByMenu(childMenus, userRole, rightsByMenu);
    } else if (childMenus !== null && childMenus !== undefined && childMenus.length > 0) {
      await getRightsByMenu(childMenus, userRole, rightsByMenu);
    }
  }
}

async function isRightActive(right, userRole) {
  for (let k = 0; k < userRole.rights.length; k++) {
    const roleRight = userRole.rights[k];

    if (right.rightName === roleRight.rightId) {
      userRole.rights.splice(k, 1);
      return roleRight.active;
    }
  }
  
  return false;
}

/**
 * @description Actualiza el rol de usuario con id igual al dado como parámetro.
 * @param {String} userRoleId id del proveedor a actualizar.
 * @param {JSON} bodyUpdate datos a actualizar del rol de usuario.
 * @returns rol de usuario actualizado.
 */
async function update(userRoleId, bodyUpdate) {
  try {
    let userRole = await getUserRole(userRoleId);
    let userRoleRights = Array.from(userRole.rights).map(v => v.toJSON());
    let rights = await RightService.getAll();
    let rightsToDisable = bodyUpdate.rightsToDisable;
    let rightsToEnable = bodyUpdate.rightsToEnable;          

    for (let i = 0; i < rightsToEnable.length; i++) {
      const rightToEnable = rightsToEnable[i];
      let rightToEnableIndex = userRoleRights.findIndex(r => r.rightId === rightToEnable._id);
      userRoleRights[rightToEnableIndex].active = true;
      const rightToEnableDB = rights.find(right => right._id === rightToEnable._id);

      if (rightToEnableDB.childRights && rightToEnableDB.childRights.length > 0) {
        for (let j = 0; j < rightToEnableDB.childRights.length; j++) {
          const childRightToEnable = rightToEnableDB.childRights[j];
          
          let childRightToEnableIndex = userRoleRights.findIndex(r => r.rightId === childRightToEnable.rightName);
          userRoleRights[childRightToEnableIndex].active = true;
        }
      }
    }

    for (let i = 0; i < rightsToDisable.length; i++) {
      const rightToDisable = rightsToDisable[i];
      let rightToDisableIndex = userRoleRights.findIndex(r => r.rightId === rightToDisable._id);
      userRoleRights[rightToDisableIndex].active = false;
      const rightToDisableDB = rights.find(right => right._id === rightToDisable._id);

      //Si el permiso a deshabilitar tiene hijos tengo que deshabilitar tambien los hijos si
      //no son hijos de otro permiso que este habilitado.
      if (rightToDisableDB.childRights && rightToDisableDB.childRights.length > 0) {
        //Busco en todos los permisos registrados en la bd los que tienen como hijo a algun permiso
        //hijo del permiso a deshabilitar.
        for (let j = 0; j < rightToDisableDB.childRights.length; j++) {
          const childRightToDisable = rightToDisableDB.childRights[j];
          let canDisable = true;
        
          //Para todos los permisos registrados en la bd me fijo si alguno de sus hijos es tambien
          //hijo del permiso a deshabilitar.
          for (let k = 0; k < rights.length && canDisable; k++) {
            const right = rights[k];
            
            if (right.childRights && right.childRights.length > 0) {
              let found = false;
              for (let l = 0; l < right.childRights.length && !found; l++) {
                const child = right.childRights[l];
                
                if (child.rightName === childRightToDisable.rightName && right._id !== rightToDisable._id) {
                  found = true;
                  let rightIdx = userRoleRights.findIndex(r => r.rightId === right._id);
                  if (userRoleRights[rightIdx].active) {
                    canDisable = false;
                  }
                }
              }
            }
          }

          let childRightToDisableIndex = userRoleRights.findIndex(r => r.rightId === childRightToDisable.rightName);
          userRoleRights[childRightToDisableIndex].active = !canDisable;
        }
      }
    }

    let userRoleToUpdate = bodyUpdate.userRole;
    userRoleToUpdate.rights = userRoleRights;

    return await UserRoleDAO.updateUserRoleById(userRoleId, userRoleToUpdate);    
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Crea un nuevo rol de usuario con los datos dados como parametros y lo guarda en la base de datos.
 * @param {JSON} reqBody request body.
 * @returns userRole guardado en la base de datos.
 */
async function saveUserRole(reqBody) {
  let userRole = new UserRole();
  userRole.name = reqBody.name;
  userRole.isWaiter = reqBody.isWaiter;
  userRole.rights = [];

  const userRoleRights = await RightService.getAll();
  for (let i = 0; i < userRoleRights.length; i++) {
    const right = userRoleRights[i];
    userRole.rights.push({
      rightId: right._id,
      active: false
    })
  }  
  let userRoleSaved = await UserRoleDAO.save(userRole);

  return userRoleSaved;
}

/**
 * @description Elimina el rol de usuario dado como parametro de la base de datos.
 * @param {UserRole} userRole rol de usuario que se quiere eliminar
 */
async function deleteUserRole(userRole) {
  try {
    await UserRoleDAO.remove(userRole);
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  getAllUserRolesWithoutRights,
  getUserRole,
  getAllUserRoles,
  getUserRoleWithRightsByMenu,
  update,
  saveUserRole,
  deleteUserRole
}