'use strict'

const cron = require('node-cron');
// const notificationController = require('../controllers/notification');
const notificationService = require('../services/notification');

const sendNonReadNotifications = () => {
    // notificationService.resendNotifications();
    return;
}

function runScheduler() {   
    cron.schedule('*/1 * * * *', sendNonReadNotifications.bind(this))
}

// schedule takes two arguments, cron time and the task to call when we reach that time
module.exports = {
    runScheduler
}