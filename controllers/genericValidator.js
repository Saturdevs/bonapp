'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

function validateName (req, res) {
    
    let collection = require('../models/'+ req.params.collectionName);
    
    console.log('POST /api/menu')
    console.log(req.body)
  
    let searchBy = {name: req.params.objectName}

    collection.find(searchBy, (err, objects) => {
        if (err) return     res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
        if (objects.length === 0) return res.status(200).send({ result: true})
    
        res.status(200).send({ result: false})
    })
  }

  module.exports = {validateName};