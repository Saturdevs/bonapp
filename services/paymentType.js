'use strict'

const PaymentTypeDAO = require('../dataAccess/paymentType');
const CashFlowDAO = require('../dataAccess/cashFlow');
const TransactionDAO = require('../dataAccess/transaction');
const OrderDAO = require('../dataAccess/order');
const PaymentTypeTransform = require('../transformers/paymentType');
const mongoose = require('mongoose');

/**
 * @description Recupera todos los tipos de pagos de la base de datos.
 * @returns tipos de pagos recuperados de la base de datos.
 */
async function getAll() {
  try {
    let paymentTypesToReturn = [];    
    let paymentTypes = await PaymentTypeDAO.getPaymentTypesByQuery({});

    for (let i = 0; i < paymentTypes.length; i++) {
      const paymentTypeTransformed = await PaymentTypeTransform.transformToBusinessObject(paymentTypes[i]);
      paymentTypesToReturn.push(paymentTypeTransformed);
    }

    return paymentTypesToReturn;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Recupera todos los medios de pagos habilitados de la base de datos.
 * @returns medios de pagos habilitados.
 */
async function getAvailablePaymentTypes() {
  try {
    let paymentTypesToReturn = [];
    let query = { available: true };
    let paymentTypes = await PaymentTypeDAO.getPaymentTypesByQuery(query);

    for (let i = 0; i < paymentTypes.length; i++) {
      const paymentTypeTransformed = await PaymentTypeTransform.transformToBusinessObject(paymentTypes[i]);
      paymentTypesToReturn.push(paymentTypeTransformed);
    }

    return paymentTypesToReturn;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Devuelve el medio de pago con id igual al dado como parametro.
 * @param {string} paymentTypeId id del medio de pago que se quiere recuperar.
 * @returns medio de pago recuperado de la base de datos.
 */
async function getPaymentType(paymentTypeId) {
  try {
    let paymentType = await PaymentTypeDAO.getPaymentTypeById(paymentTypeId);

    return PaymentTypeTransform.transformToBusinessObject(paymentType);
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Recupera un unico cashFlow con paymentType igual al dado como parametro. Si hay mas de uno
 * devuelve el primero que encuentra.
 * @param {string} paymentTypeId 
 * @returns primer cashFlow encontrado con paymentType igual al dado como parametro.
 */
async function retrieveOneCashFlowByPaymentType(paymentTypeId) {
  try {
    let query = { paymentType: paymentTypeId };
    let cashFlow = await CashFlowDAO.getOneCashFlowByQuery(query);
    
    return cashFlow;
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * Recupera la primer transacción que se encuentre en la bd que tenga como medio de pago el dado como parámetro
 * @param {string} paymentTypeId 
 * @returns {Transaction} trnsaction recuperada de la base de datos
 */
async function getFirstTransactionByPaymentType(paymentTypeId) {
  try {
    let query = { paymentMethod: mongoose.Types.ObjectId(paymentTypeId) };
    let transaccion = await TransactionDAO.getOneTransactionByQuery(query);

    return transaccion;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Recupera un único pedido que tenga el mismo medio de pago que el dado como parametro. 
 * @param {string} paymentTypeId 
 * @returns pedido que tenga medio de pago igual al dado como parametro.
 */
async function retrieveOneOrderByPaymentType(paymentTypeId) {
  try {
    let query = { "users.payments.methodId": mongoose.Types.ObjectId(paymentTypeId) };
    let order = await OrderDAO.getOneOrderByQuery(query);
    
    return order;
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Elimina el medio de pago dado como parametro de la base de datos.
 * @param {ObjectID} paymentType medio de pago que se quiere eliminar
 */
async function deletePaymentType(paymentType) {
  try {    
    if (paymentType.cash === true) {
      throw new Error("El medio de pago 'Efectivo' no puede ser eliminado");
    }
    await PaymentTypeDAO.removePaymentType(paymentType);
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * Actualiza el medio de pago con id igual al dado como parametro en la base de datos.
 * @param {ObjectId} paymentTypeId 
 * @param {JSON} dataToUpdate 
 */
async function update(paymentTypeId, dataToUpdate) {
  let paymentTypeDefault;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {    
    const opts = { session: session, new: true };

    if (paymentTypeId === null || paymentTypeId === undefined ||
      dataToUpdate === null || dataToUpdate === undefined) {
      throw new Error("El medio de pago a actualizar no puede ser nulo");
    }

    //Si la propiedad por default es true busco el valor almacenado en la bd para el medio de pago
    if (dataToUpdate.default !== null && dataToUpdate.default !== undefined && dataToUpdate.default === true) {
      let paymentTypeStored = await PaymentTypeDAO.getPaymentTypeById(paymentTypeId);

      //Si la propiedad del objeto en la base de dato es false quiere decir que se quiere actualizar a true 
      //(cambiar el medio de pago por defecto) por lo que se deben unsetear todos los medios de pagos
      //por defecto hasta el momento (deberia haber solo uno)
      if (paymentTypeStored.default === false) {
        paymentTypeDefault = await PaymentTypeDAO.getPaymentTypesByQuery({ default: true });
        if (paymentTypeDefault !== null && paymentTypeDefault !== undefined) {
          await unSetDefaultPaymentType(opts);
        }
      }
    }

    let paymentTypeUpdated = await PaymentTypeDAO.updatePaymentTypeById(paymentTypeId, dataToUpdate, opts);

    await session.commitTransaction();
    session.endSession();
    
    return PaymentTypeTransform.transformToBusinessObject(paymentTypeUpdated);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(err.message);
  }
}

/**
 * @description Cambia todos los medios de pago por defecto (default = true) a medios de pago con default = false.
 * Debería haber solo un medio de pago por defecto, se actualizan todos por las dudas.
 * @param {JSON} opts parámetros para realizar el update.
 */
async function unSetDefaultPaymentType(opts) {
  let query = { default: true };
  let propertiesToSet = { $set: { default: false } }; 

  await PaymentTypeDAO.updateManyPaymentTypesByQuery(query, propertiesToSet, opts);  
}

/**
 * @description Crea un nuevo medio de pago con los datos dados como parametros y lo guarda en la base de datos.
 * @param {PaymentType} paymentType medio de pago que se quiere guardar en la base de datos.
 * @returns medio de pago guardado en la base de datos.
 */
async function savePaymentType(paymentType) {
  //El unico medio de pago que tiene cash igual true es "Efectivo" y se agrega en una migration.
  paymentType.cash = false;
  let paymentTypeSaved = await PaymentTypeDAO.save(paymentType);

  return PaymentTypeTransform.transformToBusinessObject(paymentTypeSaved);
}

module.exports = {
  getAll,
  getAvailablePaymentTypes,
  getPaymentType,
  getFirstTransactionByPaymentType,
  retrieveOneCashFlowByPaymentType,
  retrieveOneOrderByPaymentType,
  deletePaymentType,
  update,
  savePaymentType
}