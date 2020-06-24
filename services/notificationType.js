'use strict';
const NotificationTypeDAO = require('');

async function getNotificationType(notificatioTypeId) {
    try {
        return await NotificationTypeDAO.getNotificationTypeById(notificatioTypeId);
    }
    catch (err) {
        throw new Error(err);
    }
}


module.exports = {
    getNotificationType,
}