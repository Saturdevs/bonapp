'use strict'

const OrderService = require('../../services/order');
const CashFlow = require('../../services/cashFlow');
const Client = require('../../services/client');
const OrderStatus = require('../../shared/enums/orderStatus');
const HttpStatus = require('http-status-codes');

/**
 * Setea los movimientos de la caja registradora para la cual se creó el nuevo arqueo que se realizaron
 * después de la fecha de apertura del arqueo.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function setCashMovementsByDateToCashCount(req, res, next) {
  try {
    let arqueo = req.arqueo;
    let ingresos = new Array();
    let egresos = new Array();
    let cashRegisterId = arqueo.cashRegisterId;
    let date = arqueo.createdAt;

    try {
      let orders = await OrderService.getOrdersByCashRegisterByStatusAndCompletedDate(cashRegisterId, OrderStatus.CLOSED, date);
      let cashFlows = await CashFlow.getCashFlowByCashRegisterAndDate(cashRegisterId, date);
      let clients = await Client.getClientsWithTransactionsByDate(date);

      if (orders !== null && orders !== undefined) {
        orders.forEach(order => {
          order.users.forEach(orderUser => {
            orderUser.payments.forEach(payment => {
              if (payment !== null && payment !== undefined) {
                ingresos.push({
                  paymentType: payment.methodId,
                  desc: 'Ventas',
                  amount: payment.amount
                })
              }
            })
          })
        })
      }

      if (cashFlows !== null && cashFlows !== undefined) {
        cashFlows.forEach(cashFlow => {
          if (cashFlow.type === 'Ingreso') {
            ingresos.push({
              paymentType: cashFlow.paymentType,
              desc: 'Movimiento de Caja',
              amount: cashFlow.totalAmount
            })
          } else if (cashFlow.type === 'Egreso') {
            egresos.push({
              paymentType: cashFlow.paymentType,
              desc: 'Movimiento de Caja',
              amount: cashFlow.totalAmount
            })
          }
        })
      }

      if (clients !== null && clients !== undefined) {
        if (clients) {
          clients.forEach(client => {
            client.transactions.forEach(transaction => {
                ingresos.push({
                  paymentType: transaction.paymentMethod,
                  desc: 'Cobros clientes cta. cte',
                  amount: transaction.amount
                })
            })

          })
        }
      }

      arqueo.ingresos = ingresos;
      arqueo.egresos = egresos;

      req.arqueo = arqueo;
      next();

    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al realizar la búsqueda de movimientos de caja posteriores al arqueo al servidor ${err}` });
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { 
  setCashMovementsByDateToCashCount 
}