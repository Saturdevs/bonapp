'use strict'

const HttpStatus = require('http-status-codes');
const QRCode = require('qrcode')
const fs = require('fs');
const os = require('os');

async function generateQRCode(req, res) {
    try {
        let tableNumber = req.body.tableNumber
        let options = {
            scale: 1,
            width: 1920
        }
            let qr = await QRCode.toDataURL(JSON.stringify(req.body), options);

        let result = {message: "QR Generado Exitosamente", path: '~/Downloads/', data: qr}
        res.status(HttpStatus.OK).send({result: result});
        return res;
        
    } catch (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: `Error al querer generar el codigo QR: ${err.message}.` });
    }
}

module.exports = {
    generateQRCode
}