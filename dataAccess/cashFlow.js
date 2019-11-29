'use strict'

const CashFlow = require('../models/cashFlow');

//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////DATA ACCESS METHODS///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description Recupera de la base de datos el cash flow con id igual al dado como parametro
 * @param {ObjectId} cashFlowId id del cash flow que se quiere recuperar de la base de datos
 */
async function getCashFlowById(cashFlowId) {
  try {
    if (cashFlowId === null || cashFlowId === undefined) {
      throw new Error('El id del movimiento de caja que se quiere recuperar de la base de datos no puede ser nulo');
    }

    let cashFlow = await CashFlow.findById(cashFlowId);
    return cashFlow;
  }
  catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Recupera los movimientos de cajas que cumplan con la query dada.
 * @param {JSON} query 
 */
async function getCashFlowsByQuery(query) {
  try {
    let cashFlows = await CashFlow.find(query);
    return cashFlows;
  }
  catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Recupera un unico cashFlow que cumpla con la query dada como parametro. Si hay mas de uno devuelve el primero
 * encuentra.
 * @param {JSON} query 
 */
async function getOneCashFlowByQuery(query) {
  try {
    let cashFlow = await CashFlow.findOne(query);
    return cashFlow;
  }
  catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Updetea el cashFlow en la base de datos segun el id dado.
 * @param {ObjectID} cashFlowId 
 * @param {JSON} bodyUpdate 
 */
async function updateCashFlowById(cashFlowId, bodyUpdate) {
  try {
    if (cashFlowId === null || cashFlowId === undefined) {
      throw new Error('El id del movimiento de caja que se quiere actualizar no puede ser nulo');
    }

    let cashFlowUpdated = await CashFlow.findByIdAndUpdate(cashFlowId, bodyUpdate, { new: true });
    return cashFlowUpdated;
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description guarda el cashFlow dado como parametro en la base de datos.
 * @param {CashFlow} cashFlow 
 * @returns cashFlowSaved cashFlow guardado en la base de datos.
 */
async function save(cashFlow) {
  try {
    if (cashFlow === null || cashFlow === undefined) {
      throw new Error('El movimiento de caja que se quiere guardar en la base de datos no puede ser nulo');
    }

    let cashFlowSaved = await cashFlow.save();
    return cashFlowSaved;
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Elmina el cashFlow dado como parametro en la base de datos.
 * @param {CashFlow} cashFlow 
 */
async function remove(cashFlow) {
  try {
    if (cashFlow === null || cashFlow === undefined) {
      throw new Error('El movimiento de caja que se quiere eliminar no puede ser nulo');
    }

    await cashFlow.remove();
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  getCashFlowById,
  getCashFlowsByQuery,
  getOneCashFlowByQuery,
  updateCashFlowById,
  save,
  remove
}