'use strict'

const CashRegisterService = require('../services/cashRegister');

/**
 * Transforma el arqueo dado como parámetro al objeto arqueo usado en el front end.
 * Ver modelo en front end
 * @param {Arqueo} arqueoEntity 
 */
async function transformToBusinessObject(arqueoEntity) {
  if(arqueoEntity !== null && arqueoEntity !== undefined) {
    let totalIngresos = 0;
    let totalEgresos = 0;
    let realAmount = 0;

    let arqueoReturned = JSON.parse(JSON.stringify(arqueoEntity));
    let cashRegister = await CashRegisterService.getCashRegisterById(arqueoEntity.cashRegisterId);    
    
    arqueoEntity.ingresos.map(ingreso => {
      totalIngresos += ingreso.amount;
    })

    arqueoEntity.egresos.map(egreso => {
      totalEgresos += egreso.amount;
    })

    arqueoEntity.realAmount.map(amount => {
      realAmount += amount.amount;
    })

    arqueoReturned.cashRegister = cashRegister.name;
    arqueoReturned.realAmountTotal = realAmount;
    arqueoReturned.estimatedAmount = arqueoEntity.initialAmount + totalIngresos - totalEgresos;

    return arqueoReturned;
  }  
}

module.exports = {
  transformToBusinessObject
}