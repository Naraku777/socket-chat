//

var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io').listen(server)

var users = []

app.use('/static', express.static('static'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

io.on('connection', socket => {
  socket.on('login', nickname => {
    if (users.includes(nickname)) {
      socket.emit('nicknameExisted')
    } else {
      socket.userIndex = users.length
      socket.nickname = nickname
      users.push(nickname)
      socket.emit('loginSuccess')
      io.sockets.emit('system', nickname, users.length, 'login')
    }
  })
  socket.on('disconnect', () => {
    users.splice(socket.userIndex, 1)
    socket.broadcast.emit('system', socket.nickname, users.length, 'logout')
  })
  socket.on('postMsg', msg => {
    socket.broadcast.emit('newMsg', socket.nickname, msg)
  })
})

server.listen(9208)