'use strict'

const Menu = require('../models/menu')
const Category = require('../models/category')

function getMenus (req, res) {
  Menu.find({}, null, {sort: {name: 1}}, (err, menus) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!menus) return res.status(404).send({ message: `No existen cartas registradas en la base de datos.`})

    res.status(200).send({ menus })
  })
}

function getMenu (req, res) {
  let menuId = req.params.menuId

  Menu.findById(menuId, (err, menu) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
    if (!menu) return res.status(404).send({ message: `La carta ${menuId} no existe`})

    res.status(200).send({ menu }) //Cuando la clave y el valor son iguales
  })
}


function saveMenu (req, res) {
  console.log('POST /api/menu')
  console.log(req.body)

  let menu = new Menu()
  menu.name = req.body.name
  menu.picture = req.body.picture

  menu.save((err, menuStored) => {
    if(err){
        if(err['code'] == 11000) 
          return res.status(500).send({ message: `Ya existe un menu con ese nombre. Ingrese otro nombre.` })
      }
      
      res.status(200).send({ menu: menuStored })
  })
}

function updateMenu (req, res) {
  let menuId = req.params.menuId
  let bodyUpdate = req.body

  Menu.findByIdAndUpdate(menuId, bodyUpdate, (err, menuUpdated) => {
     if(err){
        if(err['code'] == 11000) 
          return res.status(500).send({ message: `Ya existe un menu con ese nombre. Ingrese otro nombre.` })
      }

    res.status(200).send({ menu: menuUpdated })
  })
}

function deleteMenu (req, res) {
  let menuId = req.params.menuId

  Menu.findById(menuId, (err, menu) => {
    if (err) return res.status(500).send({ message: `Error al querer borrar la carta: ${err}`})

    menu.remove(err => {
      if (err) return res.status(500).send({ message: `Error al querer borrar la carta: ${err}`})
      res.status(200).send({message: `La carta ha sido eliminada`})
    })
  })
}

function hasCategory (req, res) {
  let menuId = req.params.menuId
  let hasCategory  

  Menu.findById(menuId, (err, menuFind) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})

    if (!menuFind) {
      return res.status(404).send({ message: `La carta ${menuId} no existe`})
    } else {
      Category.findOne({menuId: menuId}, (err, category) => {
        let menu = new Menu()
        if (err) return res.status(500).send({ message: `Error al realizar la petición al servidor ${err}`})
        if (!category) {
          menu = null
        } else {
          menu = menuFind
        }
        res.status(200).send({ menu })
      })
    }
  })  
}

module.exports = {
  getMenu,  
  getMenus,
  saveMenu,
  updateMenu,
  deleteMenu,
  hasCategory
}