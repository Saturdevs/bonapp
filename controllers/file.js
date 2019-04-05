
'use strict'

//const File = require('../models/file')
const fs = require('fs');
const os = require('os');


function saveFile(req, res) {
  console.log('POST /api/file')
  console.log(req.body)

  // string generated by canvas.toDataURL()
  var img = req.body.data;
  var imgName = req.body.name;
  var buf = new Buffer(img, 'base64');
  var folder = '';
  var homeDir = os.homedir()+'/Documents/BonApp/bonapp-web-system/src/assets/img/';


  if(req.body.type.indexOf('image') !=  -1){    
    switch (req.body.subtype) {
      case 'product':
        folder = 'products/'
        break;
      case 'category':
        folder = 'categories/'
        break;
      case 'menu':
        folder = 'menus/'
        break;
      default:
        break;
    }
  }

  if(req.body.type.indexOf('application') !=  -1){  
    folder = "documents/"
  }

  if(folder == ''){
    return res.status(500).send({ message: `El tipo de archivo no es correcto. No se encuentra el directorio de destino.` })
  }
  if(!fs.existsSync(homeDir+folder)){
    fs.mkdirSync(homeDir+folder, { recursive: true }, (err) => {
      if (err) throw err;
    });
  }

  if(fs.existsSync(homeDir+folder)){
    fs.chmod(homeDir+folder,0o777);
  }

  if(!fs.existsSync(homeDir+folder+imgName)) {
    fs.writeFile(homeDir+folder + imgName, buf);
    return res;
  };
  
  if(fs.existsSync(homeDir+folder+imgName)){
    fs.chmod(homeDir+folder+imgName,0o777);
  }

}
module.exports = {
  saveFile,
}
