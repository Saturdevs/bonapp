'use strict'

const CategoryService = require('../services/category');
const SizeDAO = require('../dataAccess/size');

/**
 * Transforma el product dado como parámetro al objeto product usado en el front end.
 * Ver modelo en front end
 * @param {Product} productEntity 
 */
async function transformToBusinessObject(productEntity) {
  if(productEntity !== null && productEntity !== undefined) {        
    let productToReturn = JSON.parse(JSON.stringify(productEntity));
    
    if (productToReturn.available) {
      productToReturn.availableDescription = "Si";
    } else {
      productToReturn.availableDescription = "No";
    }

    productToReturn.category = (productEntity.category !== null && productEntity.category !== undefined) ?
      await CategoryService.getCategory(productEntity.category) :
      null;

    if (productToReturn.sizes !== null && productToReturn.sizes !== undefined && productToReturn.sizes.length > 0) {
      let sizes = new Array();
      sizes = [];

      for (let i = 0; i < productToReturn.sizes.length; i++) {
        const s = productToReturn.sizes[i];
        const size = await SizeDAO.getSizeById(s.sizeId);
        const sizeToReturn = {};
        
        sizeToReturn.name = size.name;
        sizeToReturn.sizeId = s.sizeId;
        sizeToReturn.price = s.price;
        sizeToReturn.default = s.default;

        sizes.push(sizeToReturn);
      }

      productToReturn.sizes = sizes;
    }

    return productToReturn;
  }  
}

module.exports = {
  transformToBusinessObject
}