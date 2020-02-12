'use strict'

/**
 * Menus de la app.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Right = require('../models/right');

const appMenuSchema = Schema({
  //Nombre del menú. 
  _id: { type: String },
  //Orden en que se va a mostrar el menú en la app.
  order: { type: Number },
  //true si el menú esta activo y es accesible por el usuario. falso si no lo esta.
  active: { type: Boolean, required: true },
  //Si el menú es un submenú este sería el id del menú padre.
  parent: { type: String, required: true },
  //true si el menu es obligatorio para que se active el menu padre
  //false si no lo es.
  mandatory: { type: Boolean, required: true },
  //Permisos requeridos para que el menu este activo y pueda ser accedido por el usuario.
  //Un permiso puede estar en un solo menu.
  right: [{ 
    rightName: { type: Schema.Types.ObjectId, ref: Right, required: true, unique: true }
  }],
  //RouterLink del menú.
  routerlink: { type: String, required: true },
  //Ruta a la carpeta donde se encuentra en ícono del menú.
  imgsrc: { type: String }
})

module.exports = mongoose.model('AppMenu', appMenuSchema);