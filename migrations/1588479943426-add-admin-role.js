'use strict'
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const config = require('../config');

module.exports.up = async next => {
  let mClient = null;
  try {
    mClient = await MongoClient.connect(config.db, { useUnifiedTopology: true });

    const adminRole = {
      "name": "Admin",
      "isWaiter": false,
      "rights": [
        {
          "rightId": "get-arqueos",
          "active": true
        },
        {
          "rightId": "get-arqueo-by-id",
          "active": true
        },
        {
          "rightId": "get-arqueo-open-by-cash-register",
          "active": true
        },
        {
          "rightId": "post-arqueos",
          "active": true
        },
        {
          "rightId": "put-arqueos",
          "active": true
        },
        {
          "rightId": "put-logical-delete-arqueos",
          "active": true
        },
        {
          "rightId": "delete-arqueos",
          "active": true
        },
        {
          "rightId": "get-cashflows",
          "active": true
        },
        {
          "rightId": "get-cashflow-by-id",
          "active": true
        },
        {
          "rightId": "post-cashflows",
          "active": true
        },
        {
          "rightId": "put-logical-delete-cashflows",
          "active": true
        },
        {
          "rightId": "delete-cashflows",
          "active": true
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
          "active": true
        },
        {
          "rightId": "put-cashregisters",
          "active": true
        },
        {
          "rightId": "delete-cashregisters",
          "active": true
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
          "active": true
        },
        {
          "rightId": "put-categories",
          "active": true
        },
        {
          "rightId": "put-categories-disable",
          "active": true
        },
        {
          "rightId": "delete-categories",
          "active": true
        },
        {
          "rightId": "get-clients",
          "active": true
        },
        {
          "rightId": "get-client-by-id",
          "active": true
        },
        {
          "rightId": "get-clients-with-current-account-enabled",
          "active": true
        },
        {
          "rightId": "post-clients",
          "active": true
        },
        {
          "rightId": "put-clients",
          "active": true
        },
        {
          "rightId": "delete-clients",
          "active": true
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
          "active": true
        },
        {
          "rightId": "put-menus",
          "active": true
        },
        {
          "rightId": "put-menus-disable",
          "active": true
        },
        {
          "rightId": "delete-menus",
          "active": true
        },
        {
          "rightId": "get-orders",
          "active": true
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
          "active": true
        },
        {
          "rightId": "put-orders-delete",
          "active": true
        },
        {
          "rightId": "put-orders-update-payments",
          "active": true
        },
        {
          "rightId": "delete-orders",
          "active": true
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
          "active": true
        },
        {
          "rightId": "put-paymenttypes",
          "active": true
        },
        {
          "rightId": "delete-paymenttypes",
          "active": true
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
          "active": true
        },
        {
          "rightId": "put-products",
          "active": true
        },
        {
          "rightId": "put-products-update-price",
          "active": true
        },
        {
          "rightId": "delete-products",
          "active": true
        },
        {
          "rightId": "get-sections",
          "active": true
        },
        {
          "rightId": "get-section-by-id",
          "active": true
        },
        {
          "rightId": "post-sections",
          "active": true
        },
        {
          "rightId": "put-sections",
          "active": true
        },
        {
          "rightId": "delete-sections",
          "active": true
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
          "active": true
        },
        {
          "rightId": "put-sizes",
          "active": true
        },
        {
          "rightId": "delete-sizes",
          "active": true
        },
        {
          "rightId": "get-suppliers",
          "active": true
        },
        {
          "rightId": "get-supplier-by-id",
          "active": true
        },
        {
          "rightId": "post-suppliers",
          "active": true
        },
        {
          "rightId": "put-suppliers",
          "active": true
        },
        {
          "rightId": "delete-suppliers",
          "active": true
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
          "active": true
        },
        {
          "rightId": "get-table-by-number",
          "active": true
        },
        {
          "rightId": "post-tables",
          "active": true
        },
        {
          "rightId": "put-tables",
          "active": true
        },
        {
          "rightId": "put-tables-by-number",
          "active": true
        },
        {
          "rightId": "put-tables-unset-and-delete",
          "active": true
        },
        {
          "rightId": "delete-tables",
          "active": true
        },
        {
          "rightId": "get-transactions",
          "active": true
        },
        {
          "rightId": "get-transaction-by-id",
          "active": true
        },
        {
          "rightId": "post-transactions",
          "active": true
        },
        {
          "rightId": "delete-transactions",
          "active": true
        },
        {
          "rightId": "get-user",
          "active": true
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
          "active": true
        },
        {
          "rightId": "delete-user",
          "active": true
        },
        {
          "rightId": "get-user-by-id",
          "active": true
        },
        {
          "rightId": "put-users",
          "active": true
        },
        {
          "rightId": "get-userroles-withoutrights",
          "active": true
        },
        {
          "rightId": "put-userrole",
          "active": true
        },
        {
          "rightId": "get-userrole-with-rights-by-menu",
          "active": true
        },
        {
          "rightId": "get-all-userroles",
          "active": true
        },
        {
          "rightId": "delete-userroles",
          "active": true
        },
        {
          "rightId": "post-userroles",
          "active": true
        },
        {
          "rightId": "tablesOrders",
          "active": true
        },
        {
          "rightId": "orderNew",
          "active": true
        },
        {
          "rightId": "closeOrder",
          "active": true
        },
        {
          "rightId": "addProducts",
          "active": true
        },
        {
          "rightId": "deleteProducts",
          "active": true
        },
        {
          "rightId": "ordersList",
          "active": true
        },
        {
          "rightId": "orderDelete",
          "active": true
        },
        {
          "rightId": "orderDetail",
          "active": true
        },
        {
          "rightId": "cashFlowList",
          "active": true
        },
        {
          "rightId": "cashFlowDelete",
          "active": true
        },
        {
          "rightId": "cashFlowDetail",
          "active": true
        },
        {
          "rightId": "cashFlowNew",
          "active": true
        },
        {
          "rightId": "cashCountList",
          "active": true
        },
        {
          "rightId": "cashCountDelete",
          "active": true
        },
        {
          "rightId": "cashCountEdit",
          "active": true
        },
        {
          "rightId": "cashCountNew",
          "active": true
        },
        {
          "rightId": "menuList",
          "active": true
        },
        {
          "rightId": "menuDelete",
          "active": true
        },
        {
          "rightId": "menuEdit",
          "active": true
        },
        {
          "rightId": "menuNew",
          "active": true
        },
        {
          "rightId": "categoryList",
          "active": true
        },
        {
          "rightId": "categoryDelete",
          "active": true
        },
        {
          "rightId": "categoryEdit",
          "active": true
        },
        {
          "rightId": "categoryNew",
          "active": true
        },
        {
          "rightId": "productList",
          "active": true
        },
        {
          "rightId": "productDelete",
          "active": true
        },
        {
          "rightId": "productEdit",
          "active": true
        },
        {
          "rightId": "productNew",
          "active": true
        },
        {
          "rightId": "clientList",
          "active": true
        },
        {
          "rightId": "clientDelete",
          "active": true
        },
        {
          "rightId": "clientEdit",
          "active": true
        },
        {
          "rightId": "clientNew",
          "active": true
        },
        {
          "rightId": "transactionList",
          "active": true
        },
        {
          "rightId": "transactionDelete",
          "active": true
        },
        {
          "rightId": "transactionDetail",
          "active": true
        },
        {
          "rightId": "transactionNew",
          "active": true
        },
        {
          "rightId": "supplierList",
          "active": true
        },
        {
          "rightId": "supplierDelete",
          "active": true
        },
        {
          "rightId": "supplierEdit",
          "active": true
        },
        {
          "rightId": "supplierNew",
          "active": true
        },
        {
          "rightId": "sizeList",
          "active": true
        },
        {
          "rightId": "sizeDelete",
          "active": true
        },
        {
          "rightId": "sizeEdit",
          "active": true
        },
        {
          "rightId": "sizeNew",
          "active": true
        },
        {
          "rightId": "paymentTypeList",
          "active": true
        },
        {
          "rightId": "paymentTypeDelete",
          "active": true
        },
        {
          "rightId": "paymentTypeEdit",
          "active": true
        },
        {
          "rightId": "paymentTypeNew",
          "active": true
        },
        {
          "rightId": "cashRegisterList",
          "active": true
        },
        {
          "rightId": "cashRegisterDelete",
          "active": true
        },
        {
          "rightId": "cashRegisterEdit",
          "active": true
        },
        {
          "rightId": "cashRegisterNew",
          "active": true
        },
        {
          "rightId": "sectionList",
          "active": true
        },
        {
          "rightId": "sectionDelete",
          "active": true
        },
        {
          "rightId": "sectionEdit",
          "active": true
        },
        {
          "rightId": "sectionNew",
          "active": true
        },
        {
          "rightId": "sectionAndTableSettings",
          "active": true
        },
        {
          "rightId": "userRolesList",
          "active": true
        },
        {
          "rightId": "userRolesNew",
          "active": true
        },
        {
          "rightId": "userRolesEdit",
          "active": true
        },
        {
          "rightId": "userRolesDelete",
          "active": true
        },
        {
          "rightId": "generateQR",
          "active": true
        }, 
        {
          "rightId": "post-qr",
          "active": true
        },
        {
          "rightId": "dailyMenuList",
          "active": true
        }, 
        {
          "rightId": "get-dailyMenus",
          "active": true
        }, 
        {
          "rightId": "get-available-dailyMenus",
          "active": true
        }, 
        {
          "rightId": "dailyMenuEdit",
          "active": true
        }, 
        {
          "rightId": "dailyMenuNew",
          "active": true
        },
        {
          "rightId": "get-dailyMenu-by-id",
          "active": true
        },
        {
          "rightId": "put-dailyMenu",
          "active": true
        },
        {
          "rightId": "post-dailyMenu",
          "active": true
        },
      ]
    };

    const db = mClient.db();
    const rights = await db.collection('rights').find({}).toArray();

    if (!rights || rights.length === 0) {
      throw new Error("No hay permisos en la base de datos. Primero deben agregarse los permisos en la base de datos");
    }

    const rightsInRole = adminRole.rights;
    rightsInRole.forEach(right => {
      const index = rights.findIndex(r => r._id === right.rightId)

      if (index === -1) {
        throw new Error(`El permiso ${right.rightId} no se encuentra registrado en la base de datos`);
      }
    })

    await db.createCollection('userroles');
    await db.collection('userroles').insertOne(adminRole);
    return next();
  } catch (err) {
    throw new Error(err.message);
  } finally {
    mClient.close();
  }
}

module.exports.down = async next => {
  try {
    const mClient = await MongoClient.connect(config.db, { useUnifiedTopology: true });
    const db = mClient.db();
    await db.collection('userroles').deleteOne({ "name": "Admin" });
    await mClient.close();
    return next();
  } catch (err) {
    return next(err);
  }
}