'use strict'

const CashRegisterService = require('../services/cashRegister');
const PaymentTypeService = require('../services/paymentType');

/**
 * Transforma el cashFlow dado como parámetro al objeto cashFlow usado en el front end.
 * Ver modelo en front end
 * @param {CashFlow} cashFlowEntity 
 */
async function transformToBusinessObject(cashFlowEntity) {
  if (cashFlowEntity !== null && cashFlowEntity !== undefined) {
    let cashFlowReturned = JSON.parse(JSON.stringify(cashFlowEntity));
    let cashRegister = await CashRegisterService.getCashRegisterById(cashFlowEntity.cashRegisterId);
    let paymentType = await PaymentTypeService.getPaymentTypeById(cashFlowEntity.paymentType);

    cashFlowReturned.cashRegister = cashRegister.name;
    cashFlowReturned.paymentTypeName = paymentType.name;

    return cashFlowReturned;
  }  
}

module.exports = {
  transformToBusinessObject
}