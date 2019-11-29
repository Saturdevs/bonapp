'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CashRegister = require('../models/cashRegister')
const Product = require('../models/product')
const Table = require('../models/table')
const User = require('../models/user')
const PaymentMethod = require('../models/paymentType')

const orderSchema = Schema({
  /**Nro interno de pedido */
  orderNumber: { type: Number, required: true, unique: true },
  /**Tipo de pedido */
  type: { type: String, required: true, enum: ['Delivery', 'Restaurant', 'Mostrador', 'App'] },
  /**Mesa de la cual fue hecho el pedido. Si no es de tipo "Restaurant" o "App" es nulo */
  table: { type: Number, ref: Table },
  /**Caja registradora donde se realiza el pago del pedido
   * Si el pago se realiza por la app setearle la caja por defecto (Ver tipo de pago)
   * No es requerido porque el pedido se crea antes de pagarlo. La caja se setea al momento del pago
   */
  cashRegister: { type: Schema.Types.ObjectId, ref: CashRegister }, 
  /**Mozo que atiende el pedido. Si el pedido se realiza desde la app, es delivery o se pide por mostrador
   * se usa el usuario admin
   */
  waiter: { type: Schema.Types.ObjectId, ref: User }, 
  /**Estado del pedido.
   * Open: Pedido abierto. Se usar para todos los tipos de pedidos
   * Closed: Pedido cerrado. Se usar para todos los tipos de pedidos
   * Delivered: Pedido enviado. Solo para pedidos de tipo Delivery
   * Not Received: Pedido no recibido. Solo para pedidos de tipo Delivery
   */
  status: { type: String, required: true, enum: ['Open', 'Closed', 'Delivered', 'Not Received', 'Deleted'] },
  /**True si el pedido fue hecho por la app. False si fue hecho por el sistema */
  app: { type: Boolean, required: true },
  /**Usuarios que participan es este pedido. Si el pedido se realiza en el bar/restaurant usar el
   * usuario admin. Sino es un array con los distintos usuarios que ordenen productos dentro de este pedido.
   */
  users: [{
    /**Username. Si el pedido se realiza en el bar/restaurant usar "admin".
     * Si el pedido se realiza por la app usar el username del usuario correspondientes que se encuentran
     * en la coleccion users de la base de datos general.
    */
    username: { type: String, required: true },
    /**Productos pedidos por UN usuario */
    products: [{
      /**Id del producto que se encuentra en la coleccion products */
      product: { type: Schema.Types.ObjectId, ref: Product, required: true },
      /**Opciones seleccionadas para cada producto del pedido */
      options: [{
        name: { type: String, required:true },
        price: { type: Number, required: true }
      }],
      /**Precio del producto seleccionado */
      price: { type: Number, required: true },
      /**Tamaño del producto seleccionado */
      size: {
        name: { type: String, required: true },
        price: { type: Number, required: true }
      },      
      /**Observaciones para el producto */
      observations: { type: String },
      /**Cantidad de producto pedida */
      quantity: { type: Number, required: true },
      /**Si el producto fue eliminado del pedido igual a true. Sino false */
      deleted: { type: Boolean, required: true },
      /**Motivo por el cual fue eliminado el producto del pedido */
      deletedReason: { type: String },
      /**Estado del pago del pedido, para imprimir si se pago completo o parcial
       * cuando se inicia un pedido tiene que estar en Pending.*/
      status: {type: string, enum: ['Pending', 'Partial', 'Payed']} //Todavia no puse que es required = true porque tengo una duda para implementar esto. No se como hacer para darme cuenta de cuales payments son nuevos.
    }],
    /**Atributo para verificar si el usuario esta bloqueado. Se utiliza cuando se realiza un pago,
     * cuando alguien realiza un pago para ese usuario, este se bloquea para menter la integridad de los datos
     * y que nadie mas pueda realizar pagos mientras tanto. Ya que podria generar un problema con los montos
     */
    blocked: {type: Boolean},
    /**Monto total a pagar por usuario. Si el pedido se realizó en el bar/restaurant este monto 
     * coincidirá con el monto total del pedido. Si se realizó por la app la suma de todos los montos
     * individuales por usuario deberá coincidir con el monto total.
     */
    totalPerUser: { type:Number },
    /**Tipos de pago usados para pagar el pedido. */
    payments: [{
      amount: { type: Number, required: true },
      methodId: { type: Schema.Types.ObjectId, ref: PaymentMethod, required: true }
    }],
    /**Si el usuario es el primero que leyo el qr en la mesa se setea en true y es el dueño del pedido.
     * Sino se setea en false. Debe haber un solo dueño por pedido.
     * Cuando el dueño paga y se retira se setea en true otro usuario.
     */
    owner: { type: Boolean, required: true }
  }],
  /**Fecha y hora de creación del pedido */
  created_at: { type: Date, required: true },
  /**Fecha y hora de envío del pedido.
   * Solo cuando se envia el pedido en caso de ser delivery. Para calcular estadisticas de cuanto 
   * se tarda entre que se realiza el pedido y se envia.
   */
  sent_at: { type: Date },
  /**Fecha y hora de cuando se completa el pedido */
  completed_at: { type: Date },  
  /**Descuento para el pedido. Se guarda el porcentaje de descuent, monto de descuento y subtotal
   * para no tener que calcularlo de nuevo cuando se muestre el detalle de la orden
   */
  discount: { 
    discountRate: { type: Number },
    discountAmount: { type: Number },
    subtotal: { type: Number }
  },
  /**Monto total del pedido */
  totalPrice: { type: Number }
});

module.exports = mongoose.model('Order', orderSchema)