'use scrict'

const NotificationType = require('../models/notificationType');

async function getNotificationTypeById(id) {
    try {
        if (id === null || id === undefined) {
            throw new Error('El id del tipo de notificacion que se quiere recuperar de la base de datos no puede ser nulo');
        }
        return await NotificationType.findById(id);
    }
    catch (err) {
        throw new Error(err);
    }
}

module.exports = {
    getNotificationTypeById
}