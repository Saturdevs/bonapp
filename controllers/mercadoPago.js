const mercadopago = require('mercadopago');
const config = require('../config');
const OrderService = require('../services/order');
const HttpStatus = require('http-status-codes');

mercadopago.configurations.setAccessToken(config.mercadopago_access_token); //Seteo el privateKey de MercadoPago para poder conectarnos a sus APIs

/**Realiza un pago con una tarjeta nueva y sin guardarla. Recibe los datos de la tarjeta y del monto a pagar, asi como los de la persona que paga.*/
function makePayment(req, res) {
  /**El objeto a enviar a Mercadopago
   * @property {number} transaction_amount - Monto del pago
   * @property {string} token - Token que representa los datos de la tarjeta de credito de forma segura (obtenido en el FE usando la API de MP)
   * @property {string} description - Detalle de lo que se esta pagando
   * @property {number} installments - Cantidad de cuotas
   * @property {string} payment_method_id - Id del metodo de pago (VISA, AMERICAN, MASTER, ETC) -Obtenido con los primeros 6 numeros de la tarjeta desde el FE usando la API de MP
   * @property {string} issuer_id - Emisor de la tarjeta de credito. Recuperado en el FE usando la API de MP.
   * @property {object} payer - La persona que paga. Tiene una propiedad email que funciona como clave para obtener los datos.   
   */
  var payment_data = {
    transaction_amount: req.body.paymentAmount,
    token: req.body.payment.token,
    description: 'Pago realizado desde Bonapp!',
    installments: 1,
    payment_method_id: req.body.payment.paymentMethodId,
    payer: {
      email: req.body.payment.email
    }
  };
  // Save and posting the payment
  mercadopago.payment.save(payment_data)
    .then(async function (payment) {

      let orderDTO = req.body.order;
      let users = req.body.users; 

      try {
        const orderUpdated = await OrderService.updateOrderPayments(orderDTO, req.body.unblockUsers, users);
        if (orderUpdated !== null && orderUpdated !== undefined) {
          res.status(HttpStatus.OK).send({ order: orderUpdated, payment: payment });
        }
        else {
          res.status(HttpStatus.CONFLICT).send({ message: `No pudo guardarse el pago en la base de datos del Bar. Consulte con el mozo.` });
        }
      }
      catch (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer actualizar la orden: ${err}` });
      }

      res.status(payment.status).send({ payment: payment }); //el payment tiene un status. Si se envio correctamente es 200 o 201, pero adentro tiene otros mensajes de respuesta internos, es decir. puede devolver 200 pero no haber hecho el pago

    })
    .catch(function (error) {
      res.status(error.status).send({ error: error });
    });
}
/** Realiza un pago con una tarjeta previamente guardada. Recibe los datos de la tarjeta, del monto a pagar y del costumer (un usuario con tarjetas guardadas previamente)*/
function makePaymentWithSavedCard(req, res) {

  var payment_data = {
    /**El objeto a enviar a Mercadopago
     * @property {number} transaction_amount - Monto del pago
     * @property {string} token - Token que representa los datos de la tarjeta de credito de forma segura (obtenido en el FE usando la API de MP)
     * @property {object} payer - La persona que paga con tarjetas previamente guardadas. Se envia el type costumer y el costumerID.   
     */
    transaction_amount: req.body.paymentAmount,
    token: req.body.payment.token,
    installments: 1,
    description: 'Pago realizado desde Bonapp!',
    payment_method_id: req.body.payment.paymentMethodId,
    payer: {
      type: "customer",
      id: req.body.payment.customerId
    }
  };

  console.log("makePaymentWithSavedCard -> ",payment_data);
  
  // Save and posting the payment
  mercadopago.payment.create(payment_data)
    .then(async function (payment) {
      let orderDTO = req.body.order;
      let users = req.body.users;

      try {
        const orderUpdated = await OrderService.updateOrderPayments(orderDTO, req.body.unblockUsers, users);
        if (orderUpdated !== null && orderUpdated !== undefined) {
          return res.status(HttpStatus.OK).send({ order: orderUpdated, payment: payment });
        }
        else {
          return res.status(HttpStatus.CONFLICT).send({ message: `No pudo guardarse el pago en la base de datos del Bar. Consulte con el mozo.` });
        }
      }
      catch (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer actualizar la orden: ${err}` });
      }
    })
    .catch(function (error) {
      res.status(error.status).send({ error: error });
    });
}

/**Agrega una card a un customer existente. Se envia el costumerID y los datos de la card (a traves del TOKEN generado en el FE con la API de MP) */
function addCardToCustomer(req, res) {
  var filters = {
    id: req.body.customerId
  };
  mercadopago.customers.search({
    qs: filters
  }).then(function (customerResponse) {
    if ((customerResponse.status === 200 || customerResponse.status === 201) && customerResponse.body.results.length > 0) {
      var customer = customerResponse.body.results[0];
    }
    card_data = {
      token: req.body.token,
      customer_id: customer.id
    }

    mercadopago.card.create(card_data).then(function (card) {
      res.status(200).send({ card: card });
    }).catch(function (error) {
      res.status(error.status).send({ error: error });
    });
  }).catch(function (error) {
    res.status(error.status).send({ error: error });
  });
}

/** Crea un nuevo costumer y le guarda su primer tarjeta. Recibe el email para crear el costumer y los datos de la tarjeta mediante el TOKEN generado en el FE utilizando la API de MP. */
function createCustomerAndSaveCard(req, res) {

  customer_data = { email: req.body.email } //Request para crear el customer

  mercadopago.customers.create(customer_data).then(function (customer) { //crea el costumer

    card_data = {             //una vez creado el costumer, crea el request para cargarle la tarjeta
      token: req.body.token,
      customer_id: customer.body.id
    }

    mercadopago.card.create(card_data)
      .then(function (card) {
        res.status(200).send({ card: card });
      })
      .catch(function (error) {
        res.status(error.status).send({ error: error });
      });
  }).catch(function (error) {
    res.status(error.status).send({ error: error });
  });
}

/**Obtiene todas las cards guardadas para un customer. Recibe el customerID y con eso busca con el metodo searchCustomer */
function getCardsByCustomer() {
  var filters = {
    id: req.params.customerId
  };

  mercadopago.customers.search({
    qs: filters
  }).then(function (customer) {
    res.status(200).send({ customer: customer });
  }).catch(function (error) {
    res.status(error.status).send({ error: error });
  });
}

/** Obtiene el customer si es que existe. Recibe un email y con ello busca con el metodo searchCustomer */
function getCustomer(req, res) {
  var filters = {
    email: req.params.email
  };

  mercadopago.customers.search({
    qs: filters
  }).then(function (customer) {
    res.status(200).send({ customer: customer });
  }).catch(function (error) {
    res.status(error.status).send({ error: error });
  });
}

module.exports = {
  makePayment,
  createCustomerAndSaveCard,
  getCardsByCustomer,
  makePaymentWithSavedCard,
  addCardToCustomer,
  getCustomer
}