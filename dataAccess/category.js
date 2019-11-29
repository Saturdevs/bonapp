'use strict'

const Category = require('../models/category');

//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////DATA ACCESS METHODS//////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Recupera de la base de datos la categoria con id igual al dado como parametro
 * @param {*} categoryId id de la categoría que se quiere recuperar de la base de datos
 */
async function getCategoryById(categoryId) {
  try {
    if (categoryId === null || categoryId === undefined) {
      throw new Error('El id de la categoría que se quiere recuperar de la base de datos no puede ser nulo');
    }
    
    let category = await Category.findById(categoryId);
    return category;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * Recupera las categorías de la base de datos según la query dada.
 * @param {JSON} query query para realizar la busqueda
 * @param {JSON} sortCondition condiciones para ordenar los resultados
 */
async function getCategoriesSortedByQuery(query, sortCondition) {
  try {
    let categories = await Category.find(query).sort(sortCondition);
    return categories;
  }
  catch (err) {
    throw new Error(err);
  }
}

/**
 * @description Recupera una única categoría de la base de datos que cumpla con la query dada como parámetro. 
 * Si hay mas de una devuelve la primera que encuentra.
 * @param {JSON} query 
 * @returns primer categoría encontrada en la base de datos que cumple con la query dada.
 */
async function getOneCategoryByQuery(query) {
  try {
    let category = await Category.findOne(query);
    return category;
  }
  catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Guarda la categoría dada como parametro en la base de datos
 * @param {Category} category
 */
async function save(category) {
  try {
    if (category === null || category === undefined) {
      throw new Error('La categoría que se quiere guardar en la base de datos no puede ser nula');
    }

    let categorySaved = await category.save();
    return categorySaved;
  } catch (err) {
    if (err.code === 11000) {
      throw new Error(`Ya existe una categoria con ese nombre. Ingrese uno distinto por favor.`);
    } else {
      throw new Error(err);
    }
  }
}

/**
 * @description Actualiza la categoría en la base de datos segun el id dado.
 * @param {String} categoryId id de la categoría a actualizar en la base de datos.
 * @param {JSON} bodyUpdate propiedades de la categoría que se quieren actualizar.
 * @returns categoría actualizada en la base de datos
 */
async function updateCategoryById(categoryId, bodyUpdate) {
  try {
    if (categoryId === null || categoryId === undefined) {
      throw new Error('El id de la categoría que se quiere actualizar no puede ser nulo');
    }

    let categoryUpdated = await Category.findByIdAndUpdate(categoryId, bodyUpdate, { new: true });
    return categoryUpdated;
  } catch (err) {
    if (err.code === 11000) {
      throw new Error(`Ya existe una categoria con ese nombre. Ingrese uno distinto por favor.`);
    } else {
      throw new Error(err);
    }
  }
}

/**
 * @description Elmina la categoría dada como parametro en la base de datos.
 * @param {Category} category
 */
async function remove(category) {
  try {
    if (category === null || category === undefined) {
      throw new Error('La categoría que se quiere guardar en la base de datos no puede ser nula');
    }

    await category.remove();
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  getCategoryById,
  getCategoriesSortedByQuery,
  getOneCategoryByQuery,
  save,
  updateCategoryById,
  remove
}