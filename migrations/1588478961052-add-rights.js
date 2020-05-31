'use strict'
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const config = require('../config');

module.exports.up = async next => {
  let mClient = null;
  try {
    mClient = await MongoClient.connect(config.db, { useUnifiedTopology: true });

    const rights = [
      {
        "_id": "get-arqueos",
        "urlPathColection": "arqueo",
        "routePath": "/",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "delete-arqueos",
        "urlPathColection": "arqueo",
        "routePath": "/:arqueoId",
        "httpMethod": "delete",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "put-logical-delete-cashflows",
        "urlPathColection": "cashFlow",
        "routePath": "/logicalDelete/:cashFlowId",
        "httpMethod": "put",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "post-clients",
        "urlPathColection": "client",
        "routePath": "/",
        "httpMethod": "post",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "put-categories-disable",
        "urlPathColection": "category",
        "routePath": "/disable/:categoryId",
        "httpMethod": "put",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-categories-availables-by-menu",
        "urlPathColection": "category",
        "routePath": "/availables/parent/:menuId",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "delete-cashregisters",
        "urlPathColection": "cashRegister",
        "routePath": "/:cashRegisterId",
        "httpMethod": "delete",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-clients-with-current-account-enabled",
        "urlPathColection": "client",
        "routePath": "/withCurrentAccountEnabled",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "put-menus",
        "urlPathColection": "menu",
        "routePath": "/:menuId",
        "httpMethod": "put",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-categories",
        "urlPathColection": "category",
        "routePath": "/",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-dailyMenus",
        "urlPathColection": "dailyMenu",
        "routePath": "/",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-available-dailyMenus",
        "urlPathColection": "dailyMenu",
        "routePath": "/availables",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-dailyMenu-by-id",
        "urlPathColection": "dailyMenu",
        "routePath": "/:dailyMenuId",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "put-dailyMenu",
        "urlPathColection": "dailyMenu",
        "routePath": "/:dailyMenuId",
        "httpMethod": "put",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "post-dailyMenu",
        "urlPathColection": "dailyMenu",
        "routePath": "/",
        "httpMethod": "post",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-client-by-id",
        "urlPathColection": "client",
        "routePath": "/:clientId",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-arqueo-open-by-cash-register",
        "urlPathColection": "arqueo",
        "routePath": "/:cashRegisterId/cashRegister/open",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-menus",
        "urlPathColection": "menu",
        "routePath": "/",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-category-by-id",
        "urlPathColection": "category",
        "routePath": "/:categoryId",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "delete-categories",
        "urlPathColection": "category",
        "routePath": "/:categoryId",
        "httpMethod": "delete",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-cashregister-by-id",
        "urlPathColection": "cashRegister",
        "routePath": "/:cashRegisterId",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "post-arqueos",
        "urlPathColection": "arqueo",
        "routePath": "/",
        "httpMethod": "post",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-cashflows",
        "urlPathColection": "cashFlow",
        "routePath": "/",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "post-cashregisters",
        "urlPathColection": "cashRegister",
        "routePath": "/",
        "httpMethod": "post",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-categories-by-menu",
        "urlPathColection": "category",
        "routePath": "/parent/:menuId",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "post-categories",
        "urlPathColection": "category",
        "routePath": "/",
        "httpMethod": "post",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "put-clients",
        "urlPathColection": "client",
        "routePath": "/:clientId",
        "httpMethod": "put",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-cashregisters",
        "urlPathColection": "cashRegister",
        "routePath": "/",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-clients",
        "urlPathColection": "client",
        "routePath": "/",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "put-cashregisters",
        "urlPathColection": "cashRegister",
        "routePath": "/:cashRegisterId",
        "httpMethod": "put",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "put-arqueos",
        "urlPathColection": "arqueo",
        "routePath": "/:arqueoId",
        "httpMethod": "put",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-cashregisters-availables",
        "urlPathColection": "cashRegister",
        "routePath": "/availables",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-menus-availables",
        "urlPathColection": "menu",
        "routePath": "/availables",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-cashflow-by-id",
        "urlPathColection": "cashFlow",
        "routePath": "/:cashFlowId",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-menu-by-id",
        "urlPathColection": "menu",
        "routePath": "/:menuId",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "delete-cashflows",
        "urlPathColection": "cashFlow",
        "routePath": "/:cashFlowId",
        "httpMethod": "delete",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "post-menus",
        "urlPathColection": "menu",
        "routePath": "/",
        "httpMethod": "post",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-categories-availables",
        "urlPathColection": "category",
        "routePath": "/availables",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-arqueo-by-id",
        "urlPathColection": "arqueo",
        "routePath": "/:arqueoId",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "put-logical-delete-arqueos",
        "urlPathColection": "arqueo",
        "routePath": "/logicalDelete/:arqueoId",
        "httpMethod": "put",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "post-cashflows",
        "urlPathColection": "cashFlow",
        "routePath": "/",
        "httpMethod": "post",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "put-categories",
        "urlPathColection": "category",
        "routePath": "/:categoryId",
        "httpMethod": "put",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "delete-clients",
        "urlPathColection": "client",
        "routePath": "/:clientId",
        "httpMethod": "delete",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-customer-cards-mercadopago",
        "urlPathColection": "mercadoPago",
        "routePath": "/getCustomerCards/:customerId",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "put-orders-update-products",
        "urlPathColection": "order",
        "routePath": "/products",
        "httpMethod": "put",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-customers-mercadopago",
        "urlPathColection": "mercadoPago",
        "routePath": "/getCustomer/:email",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "put-orders-close",
        "urlPathColection": "order",
        "routePath": "/close/:orderId",
        "httpMethod": "put",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "delete-orders",
        "urlPathColection": "order",
        "routePath": "/:orderId",
        "httpMethod": "delete",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "post-mercadopago-make-payment",
        "urlPathColection": "mercadoPago",
        "routePath": "/",
        "httpMethod": "post",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-order-by-table-by-status",
        "urlPathColection": "order",
        "routePath": "/status/:table",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "put-menus-disable",
        "urlPathColection": "menu",
        "routePath": "/disable/:menuId",
        "httpMethod": "put",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-order-by-id",
        "urlPathColection": "order",
        "routePath": "/:orderId",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "post-mercadopago-customer-save-card",
        "urlPathColection": "mercadoPago",
        "routePath": "/createCustomer",
        "httpMethod": "post",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "post-mercadopago-make-payment-with-saved-card",
        "urlPathColection": "mercadoPago",
        "routePath": "/customerPayment",
        "httpMethod": "post",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-orders",
        "urlPathColection": "order",
        "routePath": "/",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "post-orders",
        "urlPathColection": "order",
        "routePath": "/",
        "httpMethod": "post",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "put-orders-block-users",
        "urlPathColection": "order",
        "routePath": "/blockUsers",
        "httpMethod": "put",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "put-orders-delete",
        "urlPathColection": "order",
        "routePath": "/:orderId",
        "httpMethod": "put",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "put-orders-update-payments",
        "urlPathColection": "order",
        "routePath": "/",
        "httpMethod": "put",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "put-orders-delete-product",
        "urlPathColection": "order",
        "routePath": "/products/delete",
        "httpMethod": "put",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "delete-menus",
        "urlPathColection": "menu",
        "routePath": "/:menuId",
        "httpMethod": "delete",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-mercadopago-add-card-to-customer",
        "urlPathColection": "mercadoPago",
        "routePath": "/addCard",
        "httpMethod": "post",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "put-products-update-price",
        "urlPathColection": "product",
        "routePath": "/updatePrice",
        "httpMethod": "put",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "post-tables",
        "urlPathColection": "table",
        "routePath": "/",
        "httpMethod": "post",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "delete-paymenttypes",
        "urlPathColection": "paymentType",
        "routePath": "/:paymentTypeId",
        "httpMethod": "delete",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-suppliers",
        "urlPathColection": "supplier",
        "routePath": "/",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-transactions",
        "urlPathColection": "transaction",
        "routePath": "/",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "delete-suppliers",
        "urlPathColection": "supplier",
        "routePath": "/:supplierId",
        "httpMethod": "delete",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "categoryDelete",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "delete-categories"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "productDelete",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "delete-products"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-user",
        "urlPathColection": "user",
        "routePath": "/",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },

      {
        "_id": "get-user-by-id",
        "urlPathColection": "user",
        "routePath": "/:userId",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "cashFlowList",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-cashflows"
          },
          {
            "rightName": "get-cashregisters"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-products-availables-by-category",
        "urlPathColection": "product",
        "routePath": "/availables/category/:categoryId",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "put-sections",
        "urlPathColection": "section",
        "routePath": "/:sectionId",
        "httpMethod": "put",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "cashCountDelete",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "put-logical-delete-arqueos"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-paymenttypes-availables",
        "urlPathColection": "paymentType",
        "routePath": "/availables",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "put-paymenttypes",
        "urlPathColection": "paymentType",
        "routePath": "/:paymentTypeId",
        "httpMethod": "put",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "post-suppliers",
        "urlPathColection": "supplier",
        "routePath": "/",
        "httpMethod": "post",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "put-tables",
        "urlPathColection": "table",
        "routePath": "/:tableId",
        "httpMethod": "put",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "delete-transactions",
        "urlPathColection": "transaction",
        "routePath": "/:transactionId",
        "httpMethod": "delete",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "put-users",
        "urlPathColection": "user",
        "routePath": "/:userId",
        "httpMethod": "put",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },

      {
        "_id": "post-user",
        "urlPathColection": "user",
        "routePath": "/",
        "httpMethod": "post",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },

      {
        "_id": "delete-user",
        "urlPathColection": "user",
        "routePath": "/:userId",
        "httpMethod": "delete",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "deleteProducts",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "put-orders-delete-product"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "menuNew",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "post-menus"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "categoryList",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-categories"
          },
          {
            "rightName": "get-categories-by-menu"
          },
          {
            "rightName": "get-menus"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "dailyMenuList",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-dailyMenus"
          },
          {
            "rightName": "get-available-dailyMenus"
          },
          {
            "rightName": "put-dailyMenu"
          },
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "dailyMenuEdit",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-dailyMenu-by-id",
          },
          {
            "rightName": "put-dailyMenu"
          },
          {
            "rightName": "get-products"
          },
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "dailyMenuNew",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "post-dailyMenu"
          },
          {
            "rightName": "get-products"
          },
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-product-by-id",
        "urlPathColection": "product",
        "routePath": "/:productId",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "delete-sizes",
        "urlPathColection": "size",
        "routePath": "/:sizeId",
        "httpMethod": "delete",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-supplier-by-id",
        "urlPathColection": "supplier",
        "routePath": "/:supplierId",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-tables-by-section",
        "urlPathColection": "table",
        "routePath": "/section/:sectionId",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "put-tables-by-number",
        "urlPathColection": "table",
        "routePath": "/byNumber/:tableNumber",
        "httpMethod": "put",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "orderNew",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-order-by-table-by-status"
          },
          {
            "rightName": "get-cashregisters-availables"
          },
          {
            "rightName": "get-paymenttypes-availables"
          },
          {
            "rightName": "get-menus-availables"
          },
          {
            "rightName": "get-available-dailyMenus"
          },
          {
            "rightName": "get-dailyMenus"
          },
          {
            "rightName": "post-orders"
          },
          {
            "rightName": "put-tables"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "orderDetail",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-order-by-id"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-tables",
        "urlPathColection": "table",
        "routePath": "/",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "post-qr",
        "urlPathColection": "qrGenerator",
        "routePath": "/",
        "httpMethod": "post",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "cashCountList",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-arqueos"
          },
          {
            "rightName": "get-cashregisters"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "menuEdit",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-menu-by-id"
          },
          {
            "rightName": "put-menus"
          },
          {
            "rightName": "put-menus-disable"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "categoryNew",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-menus-availables"
          },
          {
            "rightName": "post-categories"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-sections",
        "urlPathColection": "section",
        "routePath": "/",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "post-products",
        "urlPathColection": "product",
        "routePath": "/",
        "httpMethod": "post",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-paymenttypes",
        "urlPathColection": "paymentType",
        "routePath": "/",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-paymenttype-by-id",
        "urlPathColection": "paymentType",
        "routePath": "/:paymentTypeId",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-table-by-number",
        "urlPathColection": "table",
        "routePath": "/number/:tableNumber",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "delete-tables",
        "urlPathColection": "table",
        "routePath": "/:tableId",
        "httpMethod": "delete",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "delete-sections",
        "urlPathColection": "section",
        "routePath": "/:sectionId",
        "httpMethod": "delete",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "post-sizes",
        "urlPathColection": "size",
        "routePath": "/",
        "httpMethod": "post",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "cashFlowDetail",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-cashflow-by-id"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "menuDelete",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "delete-menus"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-section-by-id",
        "urlPathColection": "section",
        "routePath": "/:sectionId",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "put-products",
        "urlPathColection": "product",
        "routePath": "/:productId",
        "httpMethod": "put",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-size-by-id",
        "urlPathColection": "size",
        "routePath": "/:sizeId",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "delete-products",
        "urlPathColection": "product",
        "routePath": "/:productId",
        "httpMethod": "delete",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-transaction-by-id",
        "urlPathColection": "transaction",
        "routePath": "/:transactionId",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "post-transactions",
        "urlPathColection": "transaction",
        "routePath": "/",
        "httpMethod": "post",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "tablesOrders",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-sections"
          },
          {
            "rightName": "get-tables-by-section"
          },
          {
            "rightName": "get-table-by-number"
          },
          {
            "rightName": "get-order-by-table-by-status"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "orderDelete",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-order-by-id"
          },
          {
            "rightName": "put-orders-delete"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "productList",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-products"
          },
          {
            "rightName": "get-categories"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "ordersList",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-orders"
          },
          {
            "rightName": "get-cashregisters-availables"
          },
          {
            "rightName": "get-paymenttypes-availables"
          },
          {
            "rightName": "get-tables"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "menuList",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-menus"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "categoryEdit",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-category-by-id"
          },
          {
            "rightName": "get-menus"
          },
          {
            "rightName": "put-categories"
          },
          {
            "rightName": "put-categories-disable"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "post-sections",
        "urlPathColection": "section",
        "routePath": "/",
        "httpMethod": "post",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "post-users-signup",
        "urlPathColection": "user",
        "routePath": "/signup",
        "httpMethod": "post",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-sizes",
        "urlPathColection": "size",
        "routePath": "/",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-table-by-id",
        "urlPathColection": "table",
        "routePath": "/:tableId",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "cashFlowDelete",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "put-logical-delete-cashflows"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "productEdit",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-product-by-id"
          },
          {
            "rightName": "get-sizes"
          },
          {
            "rightName": "get-categories"
          },
          {
            "rightName": "put-products"
          },
          {
            "rightName": "put-products-update-price"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "put-sizes",
        "urlPathColection": "size",
        "routePath": "/:sizeId",
        "httpMethod": "put",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "closeOrder",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-arqueo-open-by-cash-register"
          },
          {
            "rightName": "put-orders-close"
          },
          {
            "rightName": "put-tables-by-number"
          },
          {
            "rightName": "put-arqueos"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "post-paymenttypes",
        "urlPathColection": "paymentType",
        "routePath": "/",
        "httpMethod": "post",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "cashFlowNew",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-cashregisters-availables"
          },
          {
            "rightName": "get-paymenttypes-availables"
          },
          {
            "rightName": "post-cashflows"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "get-products",
        "urlPathColection": "product",
        "routePath": "/",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "put-tables-unset-and-delete",
        "urlPathColection": "table",
        "routePath": "/unsetanddeletetable/:tableNumber",
        "httpMethod": "put",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "post-users-signin",
        "urlPathColection": "user",
        "routePath": "/signin",
        "httpMethod": "post",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "addProducts",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-products"
          },
          {
            "rightName": "get-categories-availables-by-menu"
          },
          {
            "rightName": "get-products-availables-by-category"
          },
          {
            "rightName": "put-orders-update-products"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "cashCountEdit",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-arqueo-by-id"
          },
          {
            "rightName": "get-cashregisters-availables"
          },
          {
            "rightName": "get-paymenttypes"
          },
          {
            "rightName": "put-arqueos"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "put-suppliers",
        "urlPathColection": "supplier",
        "routePath": "/:supplierId",
        "httpMethod": "put",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "cashCountNew",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-cashregisters-availables"
          },
          {
            "rightName": "post-arqueos"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "productNew",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-categories-availables"
          },
          {
            "rightName": "get-sizes"
          },
          {
            "rightName": "post-products"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "cashRegisterDelete",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "delete-cashregisters"
          }
        ],
        "aditionalRules": null,
        "group": "cashRegister"
      },
      {
        "_id": "supplierDelete",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "delete-suppliers"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "clientNew",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "post-clients"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "supplierList",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-suppliers"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "paymentTypeList",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-paymenttypes"
          }
        ],
        "aditionalRules": null,
        "group": "paymentType"
      },
      {
        "_id": "transactionNew",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-cashregisters-availables"
          },
          {
            "rightName": "get-paymenttypes-availables"
          },
          {
            "rightName": "get-clients-with-current-account-enabled"
          },
          {
            "rightName": "post-transactions"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "sizeNew",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "post-sizes"
          }
        ],
        "aditionalRules": null,
        "group": "size"
      },
      {
        "_id": "cashRegisterList",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-cashregisters"
          }
        ],
        "aditionalRules": null,
        "group": "cashRegister"
      },
      {
        "_id": "sectionDelete",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "delete-sections"
          }
        ],
        "aditionalRules": null,
        "group": "section"
      },
      {
        "_id": "sectionEdit",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-section-by-id"
          },
          {
            "rightName": "put-sections"
          }
        ],
        "aditionalRules": null,
        "group": "section"
      },
      {
        "_id": "supplierEdit",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-supplier-by-id"
          },
          {
            "rightName": "put-suppliers"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "supplierNew",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "post-suppliers"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "transactionDetail",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-transaction-by-id"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "paymentTypeNew",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "post-paymenttypes"
          }
        ],
        "aditionalRules": null,
        "group": "paymentType"
      },
      {
        "_id": "cashRegisterEdit",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-cashregister-by-id"
          },
          {
            "rightName": "put-cashregisters"
          }
        ],
        "aditionalRules": null,
        "group": "cashRegister"
      },
      {
        "_id": "sectionList",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-sections"
          }
        ],
        "aditionalRules": null,
        "group": "section"
      },
      {
        "_id": "transactionList",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-transactions"
          },
          {
            "rightName": "get-clients-with-current-account-enabled"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "clientEdit",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-client-by-id"
          },
          {
            "rightName": "put-clients"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "sizeList",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-sizes"
          }
        ],
        "aditionalRules": null,
        "group": "size"
      },
      {
        "_id": "clientDelete",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "delete-clients"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "transactionDelete",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "delete-transactions"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "userRolesList",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-userroles-withoutrights"
          }
        ],
        "aditionalRules": null,
        "group": "userRole"
      },
      {
        "_id": "sectionAndTableSettings",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-sections"
          },
          {
            "rightName": "get-tables-by-section"
          },
          {
            "rightName": "get-tables"
          },
          {
            "rightName": "put-tables"
          },
          {
            "rightName": "post-tables"
          },
          {
            "rightName": "delete-tables"
          },
          {
            "rightName": "put-tables-unset-and-delete"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "paymentTypeDelete",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "delete-paymenttypes"
          }
        ],
        "aditionalRules": null,
        "group": "paymentType"
      },
      {
        "_id": "sizeDelete",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "delete-sizes"
          }
        ],
        "aditionalRules": null,
        "group": "size"
      },
      {
        "_id": "paymentTypeEdit",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-paymenttype-by-id"
          },
          {
            "rightName": "put-paymenttypes"
          }
        ],
        "aditionalRules": null,
        "group": "paymentType"
      },
      {
        "_id": "clientList",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-clients"
          }
        ],
        "aditionalRules": null,
        "group": null
      },
      {
        "_id": "sizeEdit",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-size-by-id"
          },
          {
            "rightName": "put-sizes"
          }
        ],
        "aditionalRules": null,
        "group": "size"
      },
      {
        "_id": "cashRegisterNew",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "post-cashregisters"
          }
        ],
        "aditionalRules": null,
        "group": "cashRegister"
      },
      {
        "_id": "sectionNew",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "post-sections"
          }
        ],
        "aditionalRules": null,
        "group": "section"
      },
      {
        "_id": "userRolesNew",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "post-userroles"
          }
        ],
        "aditionalRules": "userRole",
        "group": null
      },
      {
        "_id": "userRolesEdit",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": null,
        "aditionalRules": null,
        "group": "userRole"
      },
      {
        "_id": "userRolesDelete",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "delete-userroles"
          }
        ],
        "aditionalRules": null,
        "group": "userRole"
      },

      {
        "_id": "post-userroles",
        "urlPathColection": "userRole",
        "routePath": "/",
        "httpMethod": "post",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },

      {
        "_id": "delete-userroles",
        "urlPathColection": "userRole",
        "routePath": "/:userRoleId",
        "httpMethod": "delete",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },

      {
        "_id": "get-all-userroles",
        "urlPathColection": "userRole",
        "routePath": "/",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },

      {
        "_id": "get-userrole-with-rights-by-menu",
        "urlPathColection": "userRole",
        "routePath": "/withrightsbymenu/:userRoleId",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },

      {
        "_id": "put-userrole",
        "urlPathColection": "userRole",
        "routePath": "/:userRoleId",
        "httpMethod": "put",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },

      {
        "_id": "get-userroles-withoutrights",
        "urlPathColection": "userRole",
        "routePath": "/withoutrights",
        "httpMethod": "get",
        "childRights": null,
        "aditionalRules": null,
        "group": null
      },

      {
        "_id": "generateQR",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [{
            "rightName": "get-tables"
        }, {
            "rightName": "post-qr"
        }],
        "aditionalRules": null
      },

      {
        "_id": "generateQR",
        "urlPathColection": null,
        "routePath": null,
        "httpMethod": null,
        "childRights": [
          {
            "rightName": "get-tables"
          },
          {
            "rightName": "post-qr"
          }
        ],
        "aditionalRules": null
      },
    ]

    const db = mClient.db();
    await db.createCollection('rights');
    await db.collection('rights').insertMany(rights);    
    return next();
  } catch (err) {
    return next(err);
  } finally {
    mClient.close();
  } 
}

module.exports.down = async next => {
  try {
    const mClient = await MongoClient.connect(config.db, { useUnifiedTopology: true });
    const db = mClient.db();
    await db.dropCollection("rights");
    await mClient.close();
    return next();
  } catch (err) {
    return next(err);
  }
}