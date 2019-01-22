'use strict'

const Section = require('../models/section')

function getSections (req, res) {
  Section.find({}, (err, sections) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!sections) return res.status(404).send({ message: `No existen secciones registradas en la base de datos.`})

    res.status(200).send({ sections })
  })
}

function getSection (req, res) {
  let sectionId = req.params.sectionId

  Section.findById(sectionId, (err, section) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!section) return res.status(404).send({ message: `La sección ${sectionId} no existe`})

    res.status(200).send({ section }) //Cuando la clave y el valor son iguales
  })
}

function saveSection (req, res) {
  console.log('POST /api/section')
  console.log(req.body)

  let section = new Section()
  section.name = req.body.name

  section.save((err, sectionStored) => {
    if(err){
      if(err['code'] == 11000) 
        return res.status(500).send({ message: `Ya existe una sección con ese nombre. Ingrese otro nombre.` })
      return res.status(500).send({ message: `Error al guardar en la base de datos: ${err}` })
    }

    res.status(200).send({ section: sectionStored })
  })
}

function updateSection (req, res) {
  let sectionId = req.params.sectionId
  let bodyUpdate = req.body

  Section.findByIdAndUpdate(sectionId, bodyUpdate, (err, sectionUpdated) => {
    if(err){
      if(err['code'] == 11000) 
        return res.status(500).send({ message: `Ya existe una sección con ese nombre. Ingrese otro nombre.` })
    }

    res.status(200).send({ section: sectionUpdated })
  })
}

function deleteSection (req, res) {
  let sectionId = req.params.sectionId

  Section.findById(sectionId, (err, section) => {
    if (err) return res.status(500).send({ message: `Error al querer borrar la sección: ${err}`})

    section.remove(err => {
      if (err) return res.status(500).send({ message: `Error al querer borrar la sección: ${err}`})
      res.status(200).send({message: `La sección ha sido eliminada`})
    })
  })
}

module.exports = {
  getSection,
  getSections,
  saveSection,
  updateSection,
  deleteSection
}