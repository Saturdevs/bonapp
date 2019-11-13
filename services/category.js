'use strict'

const Category = require('../models/category');
const CategoryTransform = require('../transformers/category');
const ProductService = require('../services/product');

async function getAll() {
  try {
    let categoriesToReturn = [];
    let sortCondition = { name: 1 };
    let categories = await getCategoriesSortedByQuery({}, sortCondition);

    if (categories !== null && categories !== undefined) {
      for (let i = 0; i < categories.length; i++) {
        const categoryTransformed = await CategoryTransform.transformToBusinessObject(categories[i]);
        categoriesToReturn.push(categoryTransformed);
      }
    }

    return categoriesToReturn;
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * Devuelve la categoría con id igual al dado como parametro
 * @param {string} categoryId id de la categoría que se quiere recuperar.
 */
async function getCategory(categoryId) {
  try {
    let category = null;
    if (categoryId === null || categoryId === undefined) {
      throw new Error('Se debe especificar el id de la categoría que se quiere obtener de la base de datos');
    }

    category = await getCategoryById(categoryId);

    if (category !== null && category !== undefined) {
      category = CategoryTransform.transformToBusinessObject(category);
    }

    return category;
  }
  catch (err) {
    throw new Error(err);
  }
}

async function getCategoriesByMenu(menuId) {
  try {
    if (menuId === null || menuId === undefined) {
      throw new Error('Se debe especificar el menú para el que se quieren obtener las categorías');
    }
    let categoriesToReturn = [];
    let query = { menuId: menuId };
    let sortCondition = { name: 1 };
    let categories = await getCategoriesSortedByQuery(query, sortCondition);

    if (categories !== null && categories !== undefined) {
      for (let i = 0; i < categories.length; i++) {
        const categoryTransformed = await CategoryTransform.transformToBusinessObject(categories[i]);
        categoriesToReturn.push(categoryTransformed);
      }
    }

    return categoriesToReturn;
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Recupera de la base de datos el primer producto que se encuentre para la categoría dada
 * como parámetro.
 * @param {string} categoryId 
 * @returns true si existe al menos un producto para la categoría. False si no hay ninguno.
 */
async function hasAtLeastOneProduct(categoryId) {
  try {
    let product = await ProductService.getOneProductByCategory(categoryId);

    return product;
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Crea una nueva catgegoría con los datos dados como parametros y la guarda en la base de datos.
 * @param {Category} category
 * @returns categorySaved guardada en la base de datos.
 */
async function saveCategory(category) {
  let categorySaved = await save(category);

  if (categorySaved !== null && categorySaved !== undefined) {
    categorySaved = CategoryTransform.transformToBusinessObject(categorySaved);
  }

  return categorySaved;
}

/**
 * @description Actualiza la categoría con id igual al dado como parametro en la base de datos.
 * @param {String} categoryId id de la categoría a actualizar.
 * @param {JSON} bodyUpdate datos a actualizar en la base de datos.
 * @returns la categoria actualizada y convertida al modelo usado en el frontend.
 */
async function update(categoryId, bodyUpdate) {
  try {
    let categoryUpdated = await updateCategoryById(categoryId, bodyUpdate);

    if (categoryUpdated !== null && categoryUpdated !== undefined) {
      categoryUpdated = CategoryTransform.transformToBusinessObject(categoryUpdated);
    }

    return categoryUpdated;
  } catch (err) {
    throw new Error(err.message);
  }
}

/**
 * @description Elimina la categoría con id igual al dado como parametro de la base de datos.
 * @param {String} categoryId id de la categoría que se quiere eliminar
 */
async function deleteCategory(categoryId) {
  try {
    let category = await getCategoryById(categoryId);
    await remove(category);
  } catch (err) {
    throw new Error(err.message);
  }
}

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
      throw new Error('El id de la categoría no puede ser nulo');
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
 * @description Guarda la categoría dada como parametro en la base de datos
 * @param {Category} category
 */
async function save(category) {
  try {
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
    await category.remove();
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  getAll,
  getCategory,
  getCategoriesByMenu,
  hasAtLeastOneProduct,
  saveCategory,
  update,
  deleteCategory
}