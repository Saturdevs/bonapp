'use strict'
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const config = require('../config');

module.exports.up = async next => {
  let mClient = null;
  try {
    mClient = await MongoClient.connect(config.db, { useUnifiedTopology: true });

    const appMenus = [
      {
        "_id": "orders",
        "order": 1,
        "active": true,
        "parent": null,
        "neededRights": null,
        "displayedRights": [
          {
            "rightName": "orderNew"
          },
          {
            "rightName": "closeOrder"
          },
          {
            "rightName": "addProducts"
          },
          {
            "rightName": "deleteProducts"
          }
        ],
        "imgsrc": "assets/img/taza.png"
      },
      {
        "_id": "sales",
        "order": 2,
        "active": true,
        "parent": null,
        "neededRights": null,
        "displayedRights": [
          {
            "rightName": "ordersList"
          },
          {
            "rightName": "orderDelete"
          },
          {
            "rightName": "orderDetail"
          }
        ],
        "imgsrc": "assets/img/moneda.png"
      },
      {
        "_id": "restaurant",
        "order": 3,
        "active": true,
        "parent": null,
        "neededRights": null,
        "displayedRights": null,
        "imgsrc": "assets/img/cubiertos.png"
      },
      {
        "_id": "clients-module",
        "order": 4,
        "active": true,
        "parent": null,
        "neededRights": null,
        "displayedRights": null,
        "imgsrc": "assets/img/perfilredondo.png"
      },
      {
        "_id": "suppliers-module",
        "order": 5,
        "active": true,
        "parent": null,
        "neededRights": null,
        "displayedRights": null,
        "imgsrc": "assets/img/camion.png"
      },
      {
        "_id": "settings",
        "order": 6,
        "active": true,
        "parent": null,
        "neededRights": null,
        "displayedRights": [
          {
            "rightName": "group-size"
          },
          {
            "rightName": "group-paymentType"
          },
          {
            "rightName": "group-cashRegister"
          },
          {
            "rightName": "group-section"
          },
          {
            "rightName": "group-userRole"
          }
        ],
        "imgsrc": "assets/img/engranaje.png"
      },
      {
        "_id": "section",
        "order": 1,
        "active": true,
        "parent": "orders",
        "neededRights": [
          {
            "rightName": "tablesOrders"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "counter",
        "order": 2,
        "active": false,
        "parent": "orders",
        "neededRights": null,
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "delivery",
        "order": 3,
        "active": false,
        "parent": "orders",
        "neededRights": null,
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "sales-list",
        "order": 1,
        "active": true,
        "parent": "sales",
        "mandatory": true,
        "neededRights": [
          {
            "rightName": "ordersList"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "cash-flows",
        "order": 2,
        "active": true,
        "parent": "sales",
        "mandatory": true,
        "neededRights": [
          {
            "rightName": "cashFlowList"
          }
        ],
        "displayedRights": [
          {
            "rightName": "cashFlowList"
          },
          {
            "rightName": "cashFlowDelete"
          },
          {
            "rightName": "cashFlowDetail"
          },
          {
            "rightName": "cashFlowNew"
          }
        ],
        "imgsrc": null
      },
      {
        "_id": "cash-counts",
        "order": 3,
        "active": true,
        "parent": "sales",
        "mandatory": true,
        "neededRights": [
          {
            "rightName": "cashCountList"
          }
        ],
        "displayedRights": [
          {
            "rightName": "cashCountList"
          },
          {
            "rightName": "cashCountDelete"
          },
          {
            "rightName": "cashCountEdit"
          },
          {
            "rightName": "cashCountNew"
          }
        ],
        "imgsrc": null
      },
      {
        "_id": "order-detail",
        "order": null,
        "active": true,
        "parent": "sales-list",
        "neededRights": [
          {
            "rightName": "orderDetail"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "cash-flows-detail",
        "order": null,
        "active": true,
        "parent": "cash-flows",
        "neededRights": [
          {
            "rightName": "cashFlowDetail"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "cash-flows-new",
        "order": null,
        "active": true,
        "parent": "cash-flows",
        "neededRights": [
          {
            "rightName": "cashFlowNew"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "cash-counts-edit",
        "order": null,
        "active": true,
        "parent": "cash-counts",
        "neededRights": [
          {
            "rightName": "cashCountEdit"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "cash-counts-new",
        "order": null,
        "active": true,
        "parent": "cash-counts",
        "neededRights": [
          {
            "rightName": "cashCountNew"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "menu",
        "order": 1,
        "active": true,
        "parent": "restaurant",
        "mandatory": true,
        "neededRights": null,
        "displayedRights": [
          {
            "rightName": "menuList"
          },
          {
            "rightName": "menuDelete"
          },
          {
            "rightName": "menuEdit"
          },
          {
            "rightName": "menuNew"
          }
        ],
        "imgsrc": null
      },
      {
        "_id": "menu-list",
        "order": null,
        "active": true,
        "parent": "menu",
        "mandatory": true,
        "neededRights": [
          {
            "rightName": "menuList"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "menu-edit",
        "order": null,
        "active": true,
        "parent": "menu",
        "neededRights": [
          {
            "rightName": "menuEdit"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "menu-new",
        "order": null,
        "active": true,
        "parent": "menu",
        "neededRights": [
          {
            "rightName": "menuNew"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "category",
        "order": 2,
        "active": true,
        "parent": "restaurant",
        "mandatory": true,
        "neededRights": null,
        "displayedRights": [
          {
            "rightName": "categoryList"
          },
          {
            "rightName": "categoryDelete"
          },
          {
            "rightName": "categoryEdit"
          },
          {
            "rightName": "categoryNew"
          }
        ],
        "imgsrc": null
      },
      {
        "_id": "category-list",
        "order": null,
        "active": true,
        "parent": "category",
        "mandatory": true,
        "neededRights": [
          {
            "rightName": "categoryList"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "category-edit",
        "order": null,
        "active": true,
        "parent": "category",
        "neededRights": [
          {
            "rightName": "categoryEdit"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "category-new",
        "order": null,
        "active": true,
        "parent": "category",
        "neededRights": [
          {
            "rightName": "categoryNew"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "dailyMenu",
        "order": 4,
        "active": true,
        "parent": "restaurant",
        "mandatory": true,
        "neededRights": null,
        "displayedRights": [
          {
            "rightName": "dailyMenuList"
          },
          {
            "rightName": "dailyMenuEdit"
          },
          {
            "rightName": "dailyMenuNew"
          }
        ],
        "imgsrc": null
      },
      {
        "_id": "dailyMenu-list",
        "order": null,
        "active": true,
        "parent": "dailyMenu",
        "mandatory": true,
        "neededRights": [
          {
            "rightName": "dailyMenuList"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "dailyMenu-edit",
        "order": null,
        "active": true,
        "parent": "dailyMenu",
        "neededRights": [
          {
            "rightName": "dailyMenuEdit"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "dailyMenu-new",
        "order": null,
        "active": true,
        "parent": "dailyMenu",
        "neededRights": [
          {
            "rightName": "dailyMenuNew"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "stockControl",
        "order": 5,
        "active": true,
        "parent": "restaurant",
        "mandatory": true,
        "neededRights": [
          {
            "rightName": "stockControl"
          }
        ],
        "displayedRights": [],
        "imgsrc": null
      },
      {
        "_id": "product",
        "order": 3,
        "active": true,
        "parent": "restaurant",
        "mandatory": true,
        "neededRights": null,
        "displayedRights": [
          {
            "rightName": "productList"
          },
          {
            "rightName": "productDelete"
          },
          {
            "rightName": "productEdit"
          },
          {
            "rightName": "productNew"
          },
          {
            "rightName": "stockControl"
          }
        ],
        "imgsrc": null
      },
      {
        "_id": "product-list",
        "order": 1,
        "active": true,
        "parent": "product",
        "mandatory": true,
        "neededRights": [
          {
            "rightName": "productList"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "product-edit",
        "order": null,
        "active": true,
        "parent": "product",
        "neededRights": [
          {
            "rightName": "productEdit"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "product-new",
        "order": null,
        "active": true,
        "parent": "product",
        "neededRights": [
          {
            "rightName": "productNew"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "clients",
        "order": 1,
        "active": true,
        "parent": "clients-module",
        "mandatory": true,
        "neededRights": [
          {
            "rightName": "clientList"
          }
        ],
        "displayedRights": [
          {
            "rightName": "clientList"
          },
          {
            "rightName": "clientDelete"
          },
          {
            "rightName": "clientEdit"
          },
          {
            "rightName": "clientNew"
          }
        ],
        "imgsrc": null
      },
      {
        "_id": "clients-edit",
        "order": null,
        "active": true,
        "parent": "clients",
        "neededRights": [
          {
            "rightName": "clientEdit"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "clients-new",
        "order": null,
        "active": true,
        "parent": "clients",
        "neededRights": [
          {
            "rightName": "clientNew"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "current-accounts",
        "order": 2,
        "active": true,
        "parent": "clients-module",
        "mandatory": true,
        "neededRights": [
          {
            "rightName": "transactionList"
          }
        ],
        "displayedRights": [
          {
            "rightName": "transactionList"
          },
          {
            "rightName": "transactionDelete"
          },
          {
            "rightName": "transactionDetail"
          },
          {
            "rightName": "transactionNew"
          }
        ],
        "imgsrc": null
      },
      {
        "_id": "current-accounts-transaction-new",
        "order": null,
        "active": true,
        "parent": "current-accounts",
        "neededRights": [
          {
            "rightName": "transactionNew"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "current-accounts-transaction-detail",
        "order": null,
        "active": true,
        "parent": "current-accounts",
        "neededRights": [
          {
            "rightName": "transactionDetail"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "suppliers",
        "order": 1,
        "active": true,
        "parent": "suppliers-module",
        "neededRights": [
          {
            "rightName": "supplierList"
          }
        ],
        "displayedRights": [
          {
            "rightName": "supplierList"
          },
          {
            "rightName": "supplierDelete"
          },
          {
            "rightName": "supplierEdit"
          },
          {
            "rightName": "supplierNew"
          }
        ],
        "imgsrc": null
      },
      {
        "_id": "supplier-new",
        "order": null,
        "active": true,
        "parent": "suppliers",
        "neededRights": [
          {
            "rightName": "supplierNew"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "supplier-edit",
        "order": null,
        "active": true,
        "parent": "suppliers",
        "neededRights": [
          {
            "rightName": "supplierEdit"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "general-settings",
        "order": 1,
        "active": true,
        "parent": "settings",
        "neededRights": null,
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "cash-register",
        "order": 1,
        "active": true,
        "parent": "general-settings",
        "neededRights": [
          {
            "rightName": "cashRegisterList"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "cash-register-new",
        "order": null,
        "active": true,
        "parent": "cash-register",
        "neededRights": [
          {
            "rightName": "cashRegisterNew"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "cash-register-edit",
        "order": null,
        "active": true,
        "parent": "cash-register",
        "neededRights": [
          {
            "rightName": "cashRegisterEdit"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "size",
        "order": 2,
        "active": true,
        "parent": "general-settings",
        "neededRights": [
          {
            "rightName": "sizeList"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "size-new",
        "order": null,
        "active": true,
        "parent": "size",
        "neededRights": [
          {
            "rightName": "sizeNew"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "size-edit",
        "order": null,
        "active": true,
        "parent": "size",
        "neededRights": [
          {
            "rightName": "sizeEdit"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "payment-types",
        "order": 3,
        "active": true,
        "parent": "general-settings",
        "neededRights": [
          {
            "rightName": "paymentTypeList"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "payment-types-new",
        "order": null,
        "active": true,
        "parent": "payment-types",
        "neededRights": [
          {
            "rightName": "paymentTypeNew"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "payment-types-edit",
        "order": null,
        "active": true,
        "parent": "payment-types",
        "neededRights": [
          {
            "rightName": "paymentTypeEdit"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "users",
        "order": 4,
        "active": true,
        "parent": "general-settings",
        "neededRights": [
          {
            "rightName": "userList"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "users-new",
        "order": null,
        "active": true,
        "parent": "users",
        "neededRights": [
          {
            "rightName": "userNew"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "users-edit",
        "order": null,
        "active": true,
        "parent": "users",
        "neededRights": [
          {
            "rightName": "userEdit"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "roles-users",
        "order": 5,
        "active": true,
        "parent": "general-settings",
        "neededRights": [
          {
            "rightName": "userRolesList"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "roles-users-new",
        "order": null,
        "active": true,
        "parent": "roles-users",
        "neededRights": [
          {
            "rightName": "userRolesNew"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "roles-users-edit",
        "order": null,
        "active": true,
        "parent": "roles-users",
        "neededRights": [
          {
            "rightName": "userRolesEdit"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "sections",
        "order": 6,
        "active": true,
        "parent": "general-settings",
        "neededRights": [
          {
            "rightName": "sectionList"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "sections-new",
        "order": null,
        "active": true,
        "parent": "sections",
        "neededRights": [
          {
            "rightName": "sectionNew"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "sections-edit",
        "order": null,
        "active": true,
        "parent": "sections",
        "neededRights": [
          {
            "rightName": "sectionEdit"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "tables-section",
        "order": 2,
        "active": true,
        "parent": "settings",
        "neededRights": [
          {
            "rightName": "sectionAndTableSettings"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "new-order",
        "order": null,
        "active": true,
        "neededRights": [
          {
            "rightName": "orderNew"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      },
      {
        "_id": "generate-qr",
        "order": null,
        "active": true,
        "parent": "general-settings",
        "neededRights": [
          {
            "rightName": "generateQR"
          }
        ],
        "displayedRights": null,
        "imgsrc": null
      }
    ]

    const db = mClient.db();
    await db.createCollection('appmenus');
    await db.collection('appmenus').insertMany(appMenus);    
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
    await db.dropCollection("appmenus");
    await mClient.close();
    return next();
  } catch (err) {
    return next(err);
  }
}