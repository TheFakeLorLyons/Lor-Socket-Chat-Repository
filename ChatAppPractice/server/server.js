const io = require("socket.io")(3000, {
    cors: {
        origin: ["http://localhost:8080"],
    },
})

io.on("connection", socket => {
    console.log(socket.id)
    socket.on('custom-event', (number, string, object,) => {
        console.log(number, string, object)
    })
})

io.on("connection", socket => {
    console.log(socket.id)
    socket.on('send-message', message => {
        io.emit('receive-message', message)
        console.log(message)
    })
})