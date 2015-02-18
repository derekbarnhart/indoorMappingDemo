var SocketIO = require('socket.io');

module.exports = function SocketService(app){

    var io = SocketIO(app);

    return io;
}

