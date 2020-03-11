'use strict'

/**
 * Transforma el appMenu dado como parámetro al objeto appMenu usado en el front end.
 * Ver modelo en front end
 * @param {AppMenu} AppMenuEntity 
 */
async function transformToBusinessObject(AppMenuEntity) {
  if (AppMenuEntity !== null && AppMenuEntity !== undefined) {
    let appMenuToReturn = JSON.parse(JSON.stringify(AppMenuEntity));

    appMenuToReturn.show = AppMenuEntity.show;

    return appMenuToReturn;
  }
}

module.exports = {
  transformToBusinessObject
}