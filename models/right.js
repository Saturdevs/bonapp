'use strict'

/**
 * Son los distintos recursos a los que se puede acceder, 
 * ya sea desde el backend o desde el frontend. 
 * Los recursos son las distintas colecciones, por ejemplo, menu, category.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rightSchema = Schema({
  //Nombre del permiso. 
  //Si el permiso es para una acción http (get, post, put, delete) sobre una coleccion de la bd
  //el nombre debe ser acción-colección.
  //Si es para un permiso específico del frontend que no necesita realizar una acción http sobre una
  //colección del backend, por ejemplo no permitir que un usuario realice un pedido, debe ser algo representativo, 
  //en este caso podría ser notOrdered.
  _id: { type: String, required: true, unique: true},
  //Es la parte de la url que hace referencia a la colección de la bd que se quiere acceder. Está en el archivo app.js
  urlPathColection: { type: String },
  //Parte de la url que se encuentra en el router.
  routePath: { type: String, unique: true },
  //Es el metodo http que se va a realizar sobre el recurso.
  httpMethod: { type: String, enum: ['GET', 'POST', 'PUT', 'DELETE'] },
  //Permisos hijos que el permiso padre debe tener activos para estar activo. Son permisos del backend
  childRights: [{
    //Id del permiso hijo.
    rightName: { type: String, required: true }
  }],
  //Grupo al que pertenece un permiso.
  group: { type: String},
  //Chequeos adicionales sobre atributos de la colección que se quieren realizar cuando 
  //se ejecuta la accion http guardada (action) sobre el recurso.
  //Por ejemplo, el rol mozo no puede cerrar un pedido.
  aditionalRules: [{
    //Atributo del recurso que se quiere checkear cuando se realiza la accion (action)
    //Ejemplo para closeOrder: atributo "status" de la coleccion Order
    attribute: { type: String, required: true },
    //Comparador que se quiere utilizar para el atributo.
    //NOT_MODIFIED no permite modificar el campo
    //Ejemplo para closeOrder: DISTINCT
    comparator: { type: String, required: true, enum: ['DISTINCT', 'EQUAL', 'NOT_MODIFIED']},
    //Valor para realizar la comparación
    //Ejemplo closeOrder: Closed
    //Cuando el comparator es NOT_MODIFIED no hace falta poner un valor
    value: { type: String },
    //Tipo del atributo
    valueType: { type: String }
  }]
})

module.exports = mongoose.model('Right', rightSchema);