'use strict'

const PaymentTypeService = require('../services/paymentType');
const CashRegisterService = require('../services/cashRegister');
const ClientService = require('../services/client');

/**
 * Transforma la transacción dada como parámetro al objeto transaction usado en el front end.
 * Ver modelo en front end
 * @param {Transaction} transactionEntity 
 */
async function transformToBusinessObject(transactionEntity) {
  if (transactionEntity !== null && transactionEntity !== undefined) {
    let transactionToReturn = JSON.parse(JSON.stringify(transactionEntity));

    if (transactionToReturn.paymentMethod !== null && transactionToReturn.paymentMethod !== undefined) {
      let paymentMethod = await PaymentTypeService.getPaymentTypeById(transactionToReturn.paymentMethod);
      
      transactionToReturn.paymentMethod = { _id: paymentMethod._id, name: paymentMethod.name };
    }

    if (transactionToReturn.cashRegister !== null && transactionToReturn.cashRegister !== undefined) {
      let cashRegister = await CashRegisterService.getCashRegisterById(transactionToReturn.cashRegister);
      
      transactionToReturn.cashRegister = { _id: cashRegister._id, name: cashRegister.name };
    }

    if (transactionToReturn.client !== null && transactionToReturn.client !== undefined) {          
      transactionToReturn.client = await ClientService.getClientById(transactionToReturn.client);
    }

    return transactionToReturn;
  }
}

module.exports = {
  transformToBusinessObject
}