'use strict'
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const config = require('../config');

module.exports.up = async next => {
  try {
    const mClient = await MongoClient.connect(config.db, { useUnifiedTopology: true });

    const userAppRole = {
      "name": "UserApp",
      "isWaiter": false,
      "rights": [
        {
          "rightId": "get-arqueos",
          "active": false
        },
        {
          "rightId": "get-arqueo-by-id",
          "active": false
        },
        {
          "rightId": "get-arqueo-open-by-cash-register",
          "active": false
        },
        {
          "rightId": "post-arqueos",
          "active": false
        },
        {
          "rightId": "put-arqueos",
          "active": false
        },
        {
          "rightId": "put-logical-delete-arqueos",
          "active": false
        },
        {
          "rightId": "delete-arqueos",
          "active": false
        },
        {
          "rightId": "get-cashflows",
          "active": false
        },
        {
          "rightId": "get-cashflow-by-id",
          "active": false
        },
        {
          "rightId": "post-cashflows",
          "active": false
        },
        {
          "rightId": "put-logical-delete-cashflows",
          "active": false
        },
        {
          "rightId": "delete-cashflows",
          "active": false
        },
        {
          "rightId": "get-cashregisters",
          "active": true
        },
        {
          "rightId": "get-cashregisters-availables",
          "active": true
        },
        {
          "rightId": "get-cashregister-by-id",
          "active": true
        },
        {
          "rightId": "post-cashregisters",
          "active": false
        },
        {
          "rightId": "put-cashregisters",
          "active": false
        },
        {
          "rightId": "delete-cashregisters",
          "active": false
        },
        {
          "rightId": "get-categories",
          "active": true
        },
        {
          "rightId": "get-category-by-id",
          "active": true
        },
        {
          "rightId": "get-categories-by-menu",
          "active": true
        },
        {
          "rightId": "get-categories-availables",
          "active": true
        },
        {
          "rightId": "get-categories-availables-by-menu",
          "active": true
        },
        {
          "rightId": "post-categories",
          "active": false
        },
        {
          "rightId": "put-categories",
          "active": false
        },
        {
          "rightId": "put-categories-disable",
          "active": false
        },
        {
          "rightId": "delete-categories",
          "active": false
        },
        {
          "rightId": "get-clients",
          "active": false
        },
        {
          "rightId": "get-client-by-id",
          "active": false
        },
        {
          "rightId": "get-clients-with-current-account-enabled",
          "active": false
        },
        {
          "rightId": "post-clients",
          "active": false
        },
        {
          "rightId": "put-clients",
          "active": false
        },
        {
          "rightId": "delete-clients",
          "active": false
        },
        {
          "rightId": "get-menus",
          "active": true
        },
        {
          "rightId": "get-menus-availables",
          "active": true
        },
        {
          "rightId": "get-menu-by-id",
          "active": true
        },
        {
          "rightId": "post-menus",
          "active": false
        },
        {
          "rightId": "put-menus",
          "active": false
        },
        {
          "rightId": "put-menus-disable",
          "active": false
        },
        {
          "rightId": "delete-menus",
          "active": false
        },
        {
          "rightId": "get-orders",
          "active": false
        },
        {
          "rightId": "get-order-by-id",
          "active": true
        },
        {
          "rightId": "get-order-by-table-by-status",
          "active": true
        },
        {
          "rightId": "post-orders",
          "active": true
        },
        {
          "rightId": "put-orders-update-products",
          "active": true
        },
        {
          "rightId": "put-orders-delete-product",
          "active": true
        },
        {
          "rightId": "put-orders-close",
          "active": false
        },
        {
          "rightId": "put-orders-delete",
          "active": false
        },
        {
          "rightId": "put-orders-update-payments",
          "active": true
        },
        {
          "rightId": "delete-orders",
          "active": false
        },
        {
          "rightId": "get-paymenttypes",
          "active": true
        },
        {
          "rightId": "get-paymenttypes-availables",
          "active": true
        },
        {
          "rightId": "get-paymenttype-by-id",
          "active": true
        },
        {
          "rightId": "post-paymenttypes",
          "active": false
        },
        {
          "rightId": "put-paymenttypes",
          "active": false
        },
        {
          "rightId": "delete-paymenttypes",
          "active": false
        },
        {
          "rightId": "get-products",
          "active": true
        },
        {
          "rightId": "get-product-by-id",
          "active": true
        },
        {
          "rightId": "get-products-availables-by-category",
          "active": true
        },
        {
          "rightId": "post-products",
          "active": false
        },
        {
          "rightId": "put-products",
          "active": false
        },
        {
          "rightId": "put-products-update-price",
          "active": false
        },
        {
          "rightId": "delete-products",
          "active": false
        },
        {
          "rightId": "get-sections",
          "active": false
        },
        {
          "rightId": "get-section-by-id",
          "active": false
        },
        {
          "rightId": "post-sections",
          "active": false
        },
        {
          "rightId": "put-sections",
          "active": false
        },
        {
          "rightId": "delete-sections",
          "active": false
        },
        {
          "rightId": "get-sizes",
          "active": true
        },
        {
          "rightId": "get-size-by-id",
          "active": true
        },
        {
          "rightId": "post-sizes",
          "active": false
        },
        {
          "rightId": "put-sizes",
          "active": false
        },
        {
          "rightId": "delete-sizes",
          "active": false
        },
        {
          "rightId": "get-suppliers",
          "active": false
        },
        {
          "rightId": "get-supplier-by-id",
          "active": false
        },
        {
          "rightId": "post-suppliers",
          "active": false
        },
        {
          "rightId": "put-suppliers",
          "active": false
        },
        {
          "rightId": "delete-suppliers",
          "active": false
        },
        {
          "rightId": "get-tables",
          "active": true
        },
        {
          "rightId": "get-table-by-id",
          "active": true
        },
        {
          "rightId": "get-tables-by-section",
          "active": false
        },
        {
          "rightId": "get-table-by-number",
          "active": true
        },
        {
          "rightId": "post-tables",
          "active": false
        },
        {
          "rightId": "put-tables",
          "active": false
        },
        {
          "rightId": "put-tables-by-number",
          "active": false
        },
        {
          "rightId": "put-tables-unset-and-delete",
          "active": false
        },
        {
          "rightId": "delete-tables",
          "active": false
        },
        {
          "rightId": "get-transactions",
          "active": false
        },
        {
          "rightId": "get-transaction-by-id",
          "active": false
        },
        {
          "rightId": "post-transactions",
          "active": false
        },
        {
          "rightId": "delete-transactions",
          "active": false
        },
        {
          "rightId": "get-user",
          "active": false
        },
        {
          "rightId": "post-users-signup",
          "active": true
        },
        {
          "rightId": "post-users-signin",
          "active": true
        },
        {
          "rightId": "post-user",
          "active": false
        },
        {
          "rightId": "delete-user",
          "active": false
        },
        {
          "rightId": "get-user-by-id",
          "active": false
        },
        {
          "rightId": "put-users",
          "active": false
        },
        {
          "rightId": "get-userroles-withoutrights",
          "active": false
        },
        {
          "rightId": "put-userrole",
          "active": false
        },
        {
          "rightId": "get-userrole-with-rights-by-menu",
          "active": false
        },
        {
          "rightId": "get-all-userroles",
          "active": false
        },
        {
          "rightId": "delete-userroles",
          "active": false
        },
        {
          "rightId": "post-userroles",
          "active": false
        },
        {
          "rightId": "tablesOrders",
          "active": false
        },
        {
          "rightId": "orderNew",
          "active": false
        },
        {
          "rightId": "closeOrder",
          "active": false
        },
        {
          "rightId": "addProducts",
          "active": false
        },
        {
          "rightId": "deleteProducts",
          "active": false
        },
        {
          "rightId": "ordersList",
          "active": false
        },
        {
          "rightId": "orderDelete",
          "active": false
        },
        {
          "rightId": "orderDetail",
          "active": false
        },
        {
          "rightId": "cashFlowList",
          "active": false
        },
        {
          "rightId": "cashFlowDelete",
          "active": false
        },
        {
          "rightId": "cashFlowDetail",
          "active": false
        },
        {
          "rightId": "cashFlowNew",
          "active": false
        },
        {
          "rightId": "cashCountList",
          "active": false
        },
        {
          "rightId": "cashCountDelete",
          "active": false
        },
        {
          "rightId": "cashCountEdit",
          "active": false
        },
        {
          "rightId": "cashCountNew",
          "active": false
        },
        {
          "rightId": "menuList",
          "active": false
        },
        {
          "rightId": "menuDelete",
          "active": false
        },
        {
          "rightId": "menuEdit",
          "active": false
        },
        {
          "rightId": "menuNew",
          "active": false
        },
        {
          "rightId": "categoryList",
          "active": false
        },
        {
          "rightId": "categoryDelete",
          "active": false
        },
        {
          "rightId": "categoryEdit",
          "active": false
        },
        {
          "rightId": "categoryNew",
          "active": false
        },
        {
          "rightId": "productList",
          "active": false
        },
        {
          "rightId": "productDelete",
          "active": false
        },
        {
          "rightId": "productEdit",
          "active": false
        },
        {
          "rightId": "productNew",
          "active": false
        },
        {
          "rightId": "clientList",
          "active": false
        },
        {
          "rightId": "clientDelete",
          "active": false
        },
        {
          "rightId": "clientEdit",
          "active": false
        },
        {
          "rightId": "clientNew",
          "active": false
        },
        {
          "rightId": "transactionList",
          "active": false
        },
        {
          "rightId": "transactionDelete",
          "active": false
        },
        {
          "rightId": "transactionDetail",
          "active": false
        },
        {
          "rightId": "transactionNew",
          "active": false
        },
        {
          "rightId": "supplierList",
          "active": false
        },
        {
          "rightId": "supplierDelete",
          "active": false
        },
        {
          "rightId": "supplierEdit",
          "active": false
        },
        {
          "rightId": "supplierNew",
          "active": false
        },
        {
          "rightId": "sizeList",
          "active": false
        },
        {
          "rightId": "sizeDelete",
          "active": false
        },
        {
          "rightId": "sizeEdit",
          "active": false
        },
        {
          "rightId": "sizeNew",
          "active": false
        },
        {
          "rightId": "paymentTypeList",
          "active": false
        },
        {
          "rightId": "paymentTypeDelete",
          "active": false
        },
        {
          "rightId": "paymentTypeEdit",
          "active": false
        },
        {
          "rightId": "paymentTypeNew",
          "active": false
        },
        {
          "rightId": "cashRegisterList",
          "active": false
        },
        {
          "rightId": "cashRegisterDelete",
          "active": false
        },
        {
          "rightId": "cashRegisterEdit",
          "active": false
        },
        {
          "rightId": "cashRegisterNew",
          "active": false
        },
        {
          "rightId": "sectionList",
          "active": false
        },
        {
          "rightId": "sectionDelete",
          "active": false
        },
        {
          "rightId": "sectionEdit",
          "active": false
        },
        {
          "rightId": "sectionNew",
          "active": false
        },
        {
          "rightId": "sectionAndTableSettings",
          "active": false
        },
        {
          "rightId": "userRolesList",
          "active": false
        },
        {
          "rightId": "userRolesNew",
          "active": false
        },
        {
          "rightId": "userRolesEdit",
          "active": false
        },
        {
          "rightId": "userRolesDelete",
          "active": false
        }
      ]
    };

    const db = mClient.db();
    const rights = await db.collection('rights').find({}).toArray();

    if (!rights || rights.length === 0) {
      throw new Error("No hay permisos en la base de datos. Primero deben agregarse los permisos en la base de datos");
    }

    const rightsInRole = userAppRole.rights;
    rightsInRole.forEach(right => {
      const index = rights.findIndex(r => r._id === right.rightId )

      if (index === -1) {
        throw new Error(`El permiso ${right.rightId} no se encuentra registrado en la base de datos`);
      }
    })

    await db.createCollection('userroles');
    await db.collection('userroles').insertOne(userAppRole);
    await mClient.close();
    return next();
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports.down = async next => {
  try {
    const mClient = await MongoClient.connect(config.db, { useUnifiedTopology: true });
    const db = mClient.db();
    await db.collection('userroles').remove({ "name": "UserApp" });
    await mClient.close();
    return next();
  } catch (err) {
    return next(err);
  }
}