'use strict'

const Arqueo = require('../models/arqueoCaja');
const CashRegisterService = require('../services/cashRegister');

/**
 * Devuelve el arqueo con id igual al dado como parametro
 * @param {*} arqueoId id del arqueo que se quiere recuperar.
 */
async function getArqueo(arqueoId) {
  try {
    let arqueo = await getArqueoById(arqueoId);

    return transformToBusinessObject(arqueo);
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * Devuelve todos los arqueos no eliminados. deleted = false.
 */
async function getNotDeletedArqueos() {
  try {
    let arqueosReturned = [];
    let query = { deleted: false };
    let arqueos = await getArqueoByQuery(query);    

    for (let i = 0; i < arqueos.length; i++) {
      const arqueoTransformed = await transformToBusinessObject(arqueos[i]);
      arqueosReturned.push(arqueoTransformed);
    }

    return arqueosReturned;
  } catch (err) {
    throw new Error(err);    
  }
}

/**
 * Obtiene el arqueo abierto para la caja registradora dada como parámetro si lo hay.
 * @param {*} cashRegisterId id de la caja registradora
 */
async function getArqueoOpenByCashRegister(cashRegisterId) {
  try {
    let query = { cashRegisterId: cashRegisterId, closedAt: null, deleted: false };
    let arqueoOpen = await getArqueoByQuery(query);

    return arqueoOpen[0];
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * Obtiene el último arqueo para la caja registradora dada como parámetro si existe.
 * @param {*} cashRegisterId 
 */
async function getLastArqueoByCashRegister(cashRegisterId) {
  try {
    let query = { cashRegisterId: cashRegisterId, deleted: false };
    let sortCondition = { closedAt: -1 };

    let arqueos = await getArqueoSortByQuery(query, sortCondition);

    return arqueos[0];
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * Actualiza el arqueo con id igual al dado como parametro en la base de datos.
 * @param {ObjectId} arqueoId 
 * @param {JSON} bodyUpdate 
 */
async function update(arqueoId, bodyUpdate) {
  try {
    let arqueoUpdated = await updateArqueoById(arqueoId, bodyUpdate);
    return transformToBusinessObject(arqueoUpdated);
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * Elimina el arqueo con id igual al dado como parametro de la base de datos.
 * @param {ObjectID} arqueoId id del arqueo que se quiere eliminar
 */
async function deleteArqueo(arqueoId) {
  try {
    let arqueo = await getArqueoById(arqueoId);
    arqueo.remove();
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * Transforma el arqueo recuperado de la base de datos en el objeto aruqeo usado en el front end.
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

//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////DATA ACCESS METHODS//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Recupera de la base de datos el arqueo con id igual al dado como parametro
 * @param {*} arqueoId id del arqueo que se quiere recuperar de la base de datos
 */
async function getArqueoById(arqueoId) {
  try {
    let arqueo = await Arqueo.findById(arqueoId);
    return arqueo;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * Recupera el arqueo de la base de datos según la query dada.
 * @param {JSON} query 
 */
async function getArqueoByQuery(query) {
  try {
    let arqueos = await Arqueo.find(query);
    return arqueos;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * Recupera el/los arqueo/s de la base de datos segun la query dada y ordenados por la condicion dada
 * @param {JSON} query query para realizar la busqueda
 * @param {JSON} sortCondition condiciones para ordenar los resultados
 */
async function getArqueoSortByQuery(query, sortCondition) {
  try {
    let arqueos = await Arqueo.find(query).sort(sortCondition);
    return arqueos;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * Updetea el arqueo en la base de datos segun el id dado.
 * @param {ObjectID} arqueoId 
 * @param {JSON} bodyUpdate 
 */
async function updateArqueoById(arqueoId, bodyUpdate) {
  try {
    let arqueoUpdated = await Arqueo.findByIdAndUpdate(arqueoId, bodyUpdate);
    return arqueoUpdated;
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * Guarda el arqueo dado como parametro en la base de datos
 * @param {Arqueo} arqueo 
 */
async function save(arqueo) {
  try {
    let arqueoSaved = await arqueo.save(arqueo);
    return arqueoSaved;
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  getArqueo,
  getNotDeletedArqueos,
  getArqueoOpenByCashRegister,
  getLastArqueoByCashRegister,
  deleteArqueo,
  save,
  update
}