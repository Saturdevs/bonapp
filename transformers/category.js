'use strict'

const MenuDAO = require('../dataAccess/menu');

/**
 * Transforma la categoría dada como parámetro al objeto category usado en el front end.
 * Ver modelo en front end
 * @param {Category} categoryEntity 
 */
async function transformToBusinessObject(categoryEntity) {
  if (categoryEntity !== null && categoryEntity !== undefined) {
    let categoryToReturn = JSON.parse(JSON.stringify(categoryEntity));

    if (categoryToReturn.available) {
      categoryToReturn.availableDescription = "Si";
    } else {
      categoryToReturn.availableDescription = "No";
    }
    
    categoryToReturn.menu = (categoryEntity.menuId !== null && categoryEntity.menuId !== undefined) ?
      await MenuDAO.getMenuById(categoryEntity.menuId) :
      null;

    return categoryToReturn;
  }
}

module.exports = {
  transformToBusinessObject
}