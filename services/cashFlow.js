'use strict'

const CashFlow = require('../models/cashFlow');

/**
 * Recupera de la base de datos los movimientos de caja para la caja registradora dada como parámetro 
 * con fecha mayor a la fecha dada.
 * @param {ObjectId} cashRegisterId 
 * @param {Date} date 
 * @returns {CashFlow[]} cashFlows recuperados de la base de datos
 */
async function getCashFlowByCashRegisterAndDate(cashRegisterId, date) {
  try {
    let query = { cashRegisterId: cashRegisterId, deleted: false, date: { "$gte": date } };
    let cashFlows = await getCashFlowByQuery(query);

    return cashFlows;
  }
  catch (err) {
    throw new Error(err);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////DATA ACCESS METHODS///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Recupera los movimientos de cajas que cumplan con la query dada.
 * @param {JSON} query 
 */
async function getCashFlowByQuery(query) {
  try {
    let cashFlows = await CashFlow.find(query);
    return cashFlows;
  }
  catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  getCashFlowByCashRegisterAndDate
}