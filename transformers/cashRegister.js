'use strict'

/**
 * Transforma la cashRegister dada como parámetro al objeto cashRegister usado en el front end.
 * Ver modelo en front end
 * @param {CashRegister} cashRegisterEntity 
 */
async function transformToBusinessObject(cashRegisterEntity) {
  if(cashRegisterEntity !== null && cashRegisterEntity !== undefined) {    
    let cashRegisterToReturn = JSON.parse(JSON.stringify(cashRegisterEntity));
    
    if (cashRegisterToReturn.available) {
      cashRegisterToReturn.availableDescription = "Si";
    } else {
      cashRegisterToReturn.availableDescription = "No";
    }

    return cashRegisterToReturn;
  }  
}

module.exports = {
  transformToBusinessObject
}