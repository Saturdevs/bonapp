'use strict'

/**
 * Menus de la app.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appMenuSchema = Schema({
  //Nombre del menú. 
  _id: { type: String },
  //Orden en que se va a mostrar el menú en la app.
  order: { type: Number },
  //true si el menú esta activo y es accesible por el usuario. falso si no lo esta.
  active: { type: Boolean, required: true },
  //Si el menú es un submenú este sería el id del menú padre.
  parent: { type: String },
  //true si el menu es obligatorio para que se active el menu padre false si no lo es.
  //Si es false, el menu padre si activa si existe al menos un menu hijo activo.
  mandatory: { type: Boolean },
  //Permisos requeridos para que el menu este activo y pueda ser accedido por el usuario.
  //Un permiso puede estar en un solo menu.
  neededRights: [{ 
    rightName: { type: String, required: true, unique: true }
  }],
  //Permisos que se van a mostrar en este menú en la pantalla de roles y permisos de usuarios.
  displayedRights: [{ 
    rightName: { type: String, required: true, unique: true }
  }],
  //RouterLink del menú.
  routerlink: { type: String, required: true },
  //Ruta a la carpeta donde se encuentra en ícono del menú.
  imgsrc: { type: String }
})

module.exports = mongoose.model('AppMenu', appMenuSchema);