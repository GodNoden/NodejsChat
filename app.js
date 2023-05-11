var express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
var nicknames = {};

server.listen(8080);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

// SOCKETS
io.sockets.on("connection", function (socket) {
  socket.on("sendMessage", function (data) {
    io.sockets.emit("newMessage", { msg: data, nick: socket.nickname });
  });

  socket.on("newUser", function (data, callback) {
    if (data in nicknames) {
      callback(false);
    } else {
      callback(true);
      socket.nickname = data;
      nicknames[socket.nickname] = 1;
      updateNickNames();
    }
  });

  socket.on("disconnect", function (data) {
    if (!socket.nickname) return;
    delete nicknames[socket.nickname];
    updateNickNames();
  });

  function updateNickNames() {
    io.sockets.emit("usernames", nicknames);
  }
});

// io.on('connection', client => {
//     client.on('event', data => { /* … */ });
//     client.on('disconnect', () => { /* … */ });
// });
