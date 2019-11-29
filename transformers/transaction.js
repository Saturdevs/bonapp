'use strict'

const PaymentTypeDAO = require('../dataAccess/paymentType');
const CashRegisterDAO = require('../dataAccess/cashRegister');
const ClientDAO = require('../dataAccess/client');

/**
 * Transforma la transacción dada como parámetro al objeto transaction usado en el front end.
 * Ver modelo en front end
 * @param {Transaction} transactionEntity 
 */
async function transformToBusinessObject(transactionEntity) {
  if (transactionEntity !== null && transactionEntity !== undefined) {
    let transactionToReturn = JSON.parse(JSON.stringify(transactionEntity));

    if (transactionToReturn.paymentMethod !== null && transactionToReturn.paymentMethod !== undefined) {
      let paymentMethod = await PaymentTypeDAO.getPaymentTypeById(transactionToReturn.paymentMethod);
      
      transactionToReturn.paymentMethod = { _id: paymentMethod._id, name: paymentMethod.name };
    }

    if (transactionToReturn.cashRegister !== null && transactionToReturn.cashRegister !== undefined) {
      let cashRegister = await CashRegisterDAO.getCashRegisterById(transactionToReturn.cashRegister);
      
      transactionToReturn.cashRegister = { _id: cashRegister._id, name: cashRegister.name };
    }

    if (transactionToReturn.client !== null && transactionToReturn.client !== undefined) {          
      transactionToReturn.client = await ClientDAO.getClientById(transactionToReturn.client);
    }

    return transactionToReturn;
  }
}

module.exports = {
  transformToBusinessObject
}