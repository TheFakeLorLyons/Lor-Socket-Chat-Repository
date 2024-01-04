const io = require("socket.io")(3000, {
    cors: {
        origin: ["http://localhost:8080"],
    },
})

/*io.on("connection", socket => {
    console.log(socket.id)
    socket.on('custom-event', (number, string, object,) => {
        console.log(number, string, object)
    })
})*/

io.on("connection", socket => {
    console.log(socket.id)                  //every user in socket is in a room of their own that is by default their own userid
    socket.on('send-message', (message, room) => {
        if(room === '') {
            socket.broadcast.emit('receive-message', message) //io.emit sends to all users, io.broadcast.emit sends to all users except the sender.
            console.log(message)
        } else {
            //socket.to(room).emit("receive-message", socket.id)
            socket.to(room).emit("receive-message", message)//the 'socket.to' implicitly assumes '.broadcast.to' and does not send to sender.
        }
    })
    socket.on('join-room', (room, cb) => { //must always end a callback function with a cb if applicable
        socket.join(room)
        cb(`Joined ${room}`)
    })
})