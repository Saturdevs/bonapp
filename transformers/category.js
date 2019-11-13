'use strict'

const MenuService = require('../services/menu');

/**
 * Transforma la categoría dada como parámetro al objeto category usado en el front end.
 * Ver modelo en front end
 * @param {Category} categoryEntity 
 */
async function transformToBusinessObject(categoryEntity) {
  if (categoryEntity !== null && categoryEntity !== undefined) {
    let categoryToReturn = JSON.parse(JSON.stringify(categoryEntity));

    categoryToReturn.menu = (categoryEntity.menuId !== null && categoryEntity.menuId !== undefined) ?
      await MenuService.getMenuById(categoryEntity.menuId) :
      null;

    return categoryToReturn;
  }
}

module.exports = {
  transformToBusinessObject
}