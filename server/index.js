const { NavItem } = require('react-bootstrap')

const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000",
    }
})

io.on('connection', socket => {
    const id = socket.handshake.query.id
    socket.join(id)
    socket.on("send-message", (data) => {
        data.data[0].room.participants.filter(i=>{return i!==id}).forEach(user => {
            socket.broadcast.to(user).emit('receive-message', data.data[0])
        })
    })
    socket.on("new-user", (data) => {
        socket.broadcast.emit("update-users", data);
    })
    socket.on("new-group", (data) => {
        data.participants.forEach(i => {
            socket.broadcast.to(i._id).emit("update-groups", data);
        })
    })
})

http.listen(4000, function () {
    console.log('listening on port 4000')
})