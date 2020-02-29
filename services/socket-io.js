const rooms = require('../shared/enums/socketRooms');
const sio = require('socket.io');

function initialize(server){
    var io = sio.listen(server);
    io.on("connection", socket => { //se ejecuta cada vez que un usuario se conecta al socket
        // console.log('a new user just connected!! ');
        socket.on("webSystemConnection", connection => { // escucha el metodo webSystemConnection, que lo mando desde el sistema web para asignarlo a la room WEBSYSTEM 
            socket.join(rooms.WEBSYSTEM); // asigno el sistema web a la room websystem para poder despues comunicarme con el mismo
        });
    
        socket.on("callWaiter", waiterCall => { //escucha el metodo de llamar al mozo, que lo llamo desde la app
            socket.to(rooms.WEBSYSTEM).emit('callWaiter', waiterCall); //le emito al sistema web que alguien llamo al mozo
            // si queremos que tambien le mande al mozo, solamente hay que emitirle al mozo el mismo mensaje
        });
    });
}


module.exports = {
    initialize
}