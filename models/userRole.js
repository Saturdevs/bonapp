'use strict'

/**
 * Roles de usuario
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userRoleSchema = Schema({
  //Nombre del rol. 
  name: { type: String, required: true, unique: true },
  //Si es el rol para los mozos va true. Sino false.
  isWaiter: { type: Boolean, required: true },
  //Permisos del rol sobre cada recurso del sistema.
  rights: [{
    //Id del permiso que se quiere agregar al rol
    rightId: { type: String, required: true },
    //Determina si el permiso esta activo o no. Si es true tiene permiso, si es
    //false, undefined o null no tiene permiso.
    active: { type: Boolean, required: true }
  }],
  businessUnits: { type: [Schema.Types.ObjectId], required: true }
})

module.exports = mongoose.model('UserRole', userRoleSchema);