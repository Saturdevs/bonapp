'use strict'

/**
 * Transforma el paymentType dado como parámetro al objeto paymentType usado en el front end.
 * Ver modelo en front end
 * @param {PaymentType} paymentTypeEntity 
 */
async function transformToBusinessObject(paymentTypeEntity) {
  if(paymentTypeEntity !== null && paymentTypeEntity !== undefined) {    
    let paymentTypeToReturn = JSON.parse(JSON.stringify(paymentTypeEntity));
    
    if (paymentTypeToReturn.available) {
      paymentTypeToReturn.availableDescription = "Si";
    } else {
      paymentTypeToReturn.availableDescription = "No";
    }

    return paymentTypeToReturn;
  }  
}

module.exports = {
  transformToBusinessObject
}