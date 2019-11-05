'use strict'

const CashFlow = require('../models/cashFlow');
const CashRegisterService = require('../services/cashRegister');
const CashCountService = require('../services/arqueoCaja');
const PaymentTypeService = require('../services/paymentType');
const CashFlowTypes = require('../shared/enums/cashFlowTypes');
const CashInTypes = require('../shared/enums/cashInTypes');
const CashOutTypes = require('../shared/enums/cashOutTypes');

/**
 * @description Devuelve el cash flow con id igual al dado como parametro
 * @param {ObjectId} cashFlowId id del cash flow que se quiere recuperar.
 * @returns {*} cashFlow transformado al modelo usado en el frontend
 */
async function getCashFlow(cashFlowId) {
  try {
    let cashFlow = await getCashFlowById(cashFlowId);

    return transformToBusinessObject(cashFlow);
  }
  catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Devuelve todos los cashFlows transformados al modelo que se usa en el
 * front end.
 * @returns {*} cashFlowsReturned cashFlows transformados.
 */
async function getAll() {
  try {
    let cashFlowsReturned = [];
    let cashFlows = await getCashFlowByQuery({});

    for (let i = 0; i < cashFlows.length; i++) {
      const cashFlowTransformed = await transformToBusinessObject(cashFlows[i]);
      cashFlowsReturned.push(cashFlowTransformed);
    }

    return cashFlowsReturned;
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Recupera de la base de datos los movimientos de caja para la caja registradora dada como parámetro 
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
    throw new Error(err.message);
  }
}

/**
 * @description Actualiza el cashFlow con id igual al dado como parametro en la base de datos.
 * @param {ObjectId} cashFlowId 
 * @param {JSON} bodyUpdate 
 */
async function update(cashFlowId, bodyUpdate) {
  try {
    let cashFlowUpdated = await updateCashFlowById(cashFlowId, bodyUpdate);

    if (cashFlowUpdated.deleted === true) {
      await removeCashFlowFromCashCount(cashFlowUpdated);
    }

    return transformToBusinessObject(cashFlowUpdated);
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Devuelve el nuevo cashFlow guardado en la base de datos transformado al modelo que se usa en el
 * frontend.
 * @param {*} cashFlowReq cashFlow recibido en el objeto req en el controller
 * @returns cashFlow transformado
 */
async function saveCashFlow(cashFlowReq) {
  try {
    let cashFlow = createCashFlow(cashFlowReq);

    let cashFlowSaved = await save(cashFlow);
    await saveCashFlowIntoCashCount(cashFlow);

    return transformToBusinessObject(cashFlowSaved);
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Guarda el nuevo cashFlow en el arqueo abierto en la caja en la que se realizó el moviemiendo si existe.
 * @param {CashFlow} cashFlow 
 */
async function saveCashFlowIntoCashCount(cashFlow) {
  try {
    let cashCount = null;

    try {
      if (cashFlow.cashRegisterId !== null && cashFlow.cashRegisterId !== undefined) {
        cashCount = await CashCountService.getArqueoOpenByCashRegister(cashFlow.cashRegisterId);
      } else {
        throw new Error("La caja registradora del movimiento no puede ser nula");
      }
    } catch (err) {
      throw new Error(err.message);
    }

    //Si se encontro un arqueo abierto para la caja registradora del movimiento se agrega el mismo al array
    //de ingresos o egresos del arqueo según corresponda
    if (cashCount !== null && cashCount !== undefined) {
      if (cashFlow.type === CashFlowTypes.INGRESO) {
        if (cashCount.ingresos === null || cashCount.ingresos === undefined) {
          cashCount.ingresos = new Array();
        }

        cashCount.ingresos.push({
          paymentType: cashFlow.paymentType,
          desc: CashInTypes.MOVIMIENTO_DE_CAJA,
          amount: cashFlow.totalAmount,
          date: cashFlow.date
        })
      }
      else if (cashFlow.type === CashFlowTypes.EGRESO) {
        if (cashCount.egresos === null || cashCount.egresos === undefined) {
          cashCount.egresos = new Array();
        }

        cashCount.egresos.push({
          paymentType: cashFlow.paymentType,
          desc: CashOutTypes.MOVIMIENTO_DE_CAJA,
          amount: cashFlow.totalAmount,
          date: cashFlow.date
        })
      }

      await CashCountService.update(cashCount.id, cashCount);
    }

  } catch (err) {
    await deleteCashFlow(cashFlow.id);
    throw new Error(err.message);
  }
}

async function removeCashFlowFromCashCount(cashFlow) {
  try {
    let cashCount = null;

    try {
      if (cashFlow.cashRegisterId !== null && cashFlow.cashRegisterId !== undefined) {
        cashCount = await CashCountService.getArqueoOpenByCashRegister(cashFlow.cashRegisterId);
      } else {
        throw new Error("La caja registradora del movimiento no puede ser nula");
      }
    } catch (err) {
      throw new Error(err.message);
    }

    if (cashCount !== null && cashCount !== undefined) {
      if (cashFlow.type === CashFlowTypes.INGRESO) {
        if (cashCount.ingresos !== null && cashCount.ingresos !== undefined) {
          let index = findMovementIndexInCashCount(cashCount.ingresos, cashFlow);

          if (index !== -1) {
            cashCount.ingresos.splice(index, 1);
          }
        }
      }
      else if (cashFlow.type === CashFlowTypes.EGRESO) {
        if (cashCount.egresos !== null && cashCount.egresos !== undefined) {
          let index = findMovementIndexInCashCount(cashCount.egresos, cashFlow);

          if (index !== -1) {
            cashCount.egresos.splice(index, 1);
          }
        }
      }

      await CashCountService.update(cashCount.id, cashCount);
    }

  } catch (err) {
    let cashFlowToRestore = { deleted: false };
    await updateCashFlowById(cashFlow.id, cashFlowToRestore);
    throw new Error(`El movimiento de caja no pudo ser eliminado (${err.message})`);
  }
}

/**
 * @description Devuelve el indice del elemento dado dentro del array de ingresos o egresos 
 * del cashCount dado como parametro.
 * @param {Array} array Ingresos/egresos del que se quiere obtener el indice del elemento.
 * @param {*} element Ingreso/Egreso del cual se quiere obtener el indice.
 */
function findMovementIndexInCashCount(array, element) {
  for (let i = 0; i < array.length; i++) {
    const movement = array[i];

    if (movement.paymentType.toString() === element.paymentType.toString() &&
      movement.amount === element.totalAmount &&
      movement.desc === CashInTypes.MOVIMIENTO_DE_CAJA &&
      movement.date.toString() === element.date.toString()) {

      return i;
    }
  }

  return -1;
}

/**
 * @description Crea un nuevo cashFlow.
 * @param {*} cashFlowObject 
 * @returns cashFlow nuevo cashFlow.
 */
function createCashFlow(cashFlowObject) {
  let cashFlow = new CashFlow();
  cashFlow.cashRegisterId = cashFlowObject.cashRegisterId;
  cashFlow.date = new Date();
  cashFlow.createdBy = cashFlowObject.createdBy;
  cashFlow.totalAmount = cashFlowObject.totalAmount;
  cashFlow.type = cashFlowObject.type;
  cashFlow.paymentType = cashFlowObject.paymentType;
  cashFlow.comment = cashFlowObject.comment;
  cashFlow.deleted = false;

  return cashFlow;
}

/**
 * @description Elimina el cashFlow con id igual al dado como parametro de la base de datos.
 * @param {ObjectID} cashFlowId id del cashFlow que se quiere eliminar
 */
async function deleteCashFlow(cashFlowId) {
  try {
    let cashFlow = await getCashFlowById(cashFlowId);
    await remove(cashFlow);
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Transforma el cash flow recuperado de la base de datos en el objeto cash flow usado en el front end.
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

//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////DATA ACCESS METHODS///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description Recupera de la base de datos el cash flow con id igual al dado como parametro
 * @param {ObjectId} cashFlowId id del cash flow que se quiere recuperar de la base de datos
 */
async function getCashFlowById(cashFlowId) {
  try {
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
async function getCashFlowByQuery(query) {
  try {
    let cashFlows = await CashFlow.find(query);
    return cashFlows;
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
    await cashFlow.remove();
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  getCashFlow,
  getAll,
  getCashFlowByCashRegisterAndDate,
  saveCashFlow,
  update,
  deleteCashFlow
}