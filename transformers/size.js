'use strict'

/**
 * Transforma el size dado como parámetro al objeto size usado en el front end.
 * Ver modelo en front end
 * @param {Size} sizeEntity 
 */
async function transformToBusinessObject(sizeEntity) {
  if(sizeEntity !== null && sizeEntity !== undefined) {    
    let sizeToReturn = JSON.parse(JSON.stringify(sizeEntity));
    
    if (sizeToReturn.available) {
      sizeToReturn.availableDescription = "Si";
    } else {
      sizeToReturn.availableDescription = "No";
    }

    return sizeToReturn;
  }  
}

module.exports = {
  transformToBusinessObject
}