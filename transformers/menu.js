'use strict'

/**
 * Transforma el menu dado como parámetro al objeto menu usado en el front end.
 * Ver modelo en front end
 * @param {Menu} MenuEntity 
 */
async function transformToBusinessObject(MenuEntity) {
  if (MenuEntity !== null && MenuEntity !== undefined) {
    let menuToReturn = JSON.parse(JSON.stringify(MenuEntity));

    if (menuToReturn.available) {
        menuToReturn.availableDescription = "Si";
    } else {
        menuToReturn.availableDescription = "No";
    }

    return menuToReturn;
  }
}

module.exports = {
  transformToBusinessObject
}