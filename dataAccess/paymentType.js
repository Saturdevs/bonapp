'use script'

const PaymentType = require('../models/paymentType');

//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////DATA ACCESS METHODS///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Recupera de la base de datos el cash flow con id igual al dado como parametro
 * @param {ObjectId} cashFlowId id del arqueo que se quiere recuperar de la base de datos
 */
async function getPaymentTypeById(paymentTypeId) {
  try {
    let paymentType = await PaymentType.findById(paymentTypeId);
    return paymentType;
  }
  catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  getPaymentTypeById
}