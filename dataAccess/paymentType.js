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
    if (paymentTypeId === null || paymentTypeId === undefined) {
      throw new Error('El id del medio de pago que se quiere recuperar de la base de datos no puede ser nulo');
    }

    let paymentType = await PaymentType.findById(paymentTypeId);
    return paymentType;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Recupera los tipos de pago de la base de datos según la query dada.
 * @param {JSON} query 
 * @param {JSON} sortCondition condiciones para ordenar los resultados
 * @returns tipos de pagos recuperados de la base de datos que cumplen con la query dada
 */
async function getPaymentTypesByQuery(query, sortCondition = { name: 1 }) {
  try {
    let paymentTypes = await PaymentType.find(query).sort(sortCondition);
    return paymentTypes;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Elimina el medio de pago dado como parámetro de la base de datos.
 * @param {PaymentType} paymentType 
 */
async function removePaymentType(paymentType) {
  try {
    if (paymentType === null || paymentType === undefined) {
      throw new Error('El medio de pago que se quiere eliminar de la base de datos no puede ser nulo');
    }

    await paymentType.remove();
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * Actualiza el medio de pago en la base de datos segun el id dado.
 * @param {ObjectID} paymentTypeId id del medio de pago que se quiere actualizar.
 * @param {JSON} bodyUpdate datos del medio de pago que se quieren actualizar.
 * @param {JSON} opts parámetros para realizar el update.
 */
async function updatePaymentTypeById(paymentTypeId, bodyUpdate, opts) {
  try {
    if (paymentTypeId === null || paymentTypeId === undefined) {
      throw new Error('El id del medio de pago que se quiere actualizar no puede ser nulo');
    }
    
    let paymentTypeUpdated = await PaymentType.findByIdAndUpdate(paymentTypeId, bodyUpdate, opts);
    return paymentTypeUpdated;
  } catch (err) {
    if (err['code'] == 11000) {
      throw new Error(`Ya existe un medio de pago con ese nombre. Por favor, ingrese otro nombre.`);
    } else {
      throw new Error(err.message);
    }
  }
}

/**
 * @description Actualiza todas las propiedades dadas como parametro en todos los medios de pago que cumplan con la query dada.
 * @param {JSON} query query que determina que medios de pago actualizar.
 * @param {JSON} propertiesToSet propiedades a actualizar.
 * @param {JSON} opts parámetros para realizar el update.
 * @returns medios de pagos actualizados.
 */
async function updateManyPaymentTypesByQuery(query, propertiesToSet, opts = {}) {
  try {
    await PaymentType.updateMany(query, propertiesToSet, opts);
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Guarda el medio de pago dado como parametro en la base de datos
 * @param {PaymentType} paymentType
 */
async function save(paymentType) {
  try {
    if (paymentType === null || paymentType === undefined) {
      throw new Error('El medio de pago que se quiere guardar en la base de datos no puede ser nulo');
    }

    let paymentTypeSaved = await paymentType.save();
    return paymentTypeSaved;
  } catch (err) {
    if (err.code === 11000) {
      throw new Error(`Ya existe un medio de pago con ese nombre. Ingrese uno distinto por favor.`);
    } else {
      throw new Error(err);
    }
  }
}

module.exports = {
  getPaymentTypeById,
  getPaymentTypesByQuery,
  removePaymentType,
  updatePaymentTypeById,
  updateManyPaymentTypesByQuery,
  save
}