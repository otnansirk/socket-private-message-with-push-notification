// /app/sockets/receivers.server.sockets.js
var socketIO;
exports.receivers = (io) => {
socketIO = io;
io.emit('generated notification','hello');
}
// handle different type of notification.
