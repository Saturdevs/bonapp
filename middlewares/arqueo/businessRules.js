'use strict'

const OrderService = require('../../services/order');
const CashFlowService = require('../../services/cashFlow');
const TransactionService = require('../../services/transaction');
const OrderStatus = require('../../shared/enums/orderStatus');
const HttpStatus = require('http-status-codes');
const CashInTypes = require('../../shared/enums/cashInTypes');
const CashOutTypes = require('../../shared/enums/cashOutTypes');
const CashFlowTypes = require('../../shared/enums/cashFlowTypes');

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
      let cashFlows = await CashFlowService.getCashFlowByCashRegisterAndDate(cashRegisterId, date);
      let transactions = await TransactionService.getTransactionsByDate(date);

      if (orders !== null && orders !== undefined) {
        orders.forEach(order => {
          order.users.forEach(orderUser => {
            orderUser.payments.forEach(payment => {
              if (payment !== null && payment !== undefined) {
                ingresos.push({
                  paymentType: payment.methodId,
                  desc: CashInTypes.VENTAS,
                  amount: payment.amount,
                  date: order.created_at
                })
              }
            })
          })
        })
      }

      if (cashFlows !== null && cashFlows !== undefined) {
        cashFlows.forEach(cashFlow => {
          if (cashFlow.type === CashFlowTypes.INGRESO) {
            ingresos.push({
              paymentType: cashFlow.paymentType,
              desc: CashInTypes.MOVIMIENTO_DE_CAJA,
              amount: cashFlow.totalAmount,
              date: cashFlow.date
            })
          } else if (cashFlow.type === CashFlowTypes.EGRESO) {
            egresos.push({
              paymentType: cashFlow.paymentType,
              desc: CashOutTypes.MOVIMIENTO_DE_CAJA,
              amount: cashFlow.totalAmount,
              date: cashFlow.date
            })
          }
        })
      }

      if (transactions !== null && transactions !== undefined && transactions.length > 0) {
        for (let i = 0; i < transactions.length; i++) {
          const transaction = transactions[i];
          ingresos.push({
            paymentType: transaction.paymentMethod,
            desc: CashInTypes.COBROS_CLIENTES_CTA_CTE,
            amount: transaction.amount,
            date: transaction.date
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