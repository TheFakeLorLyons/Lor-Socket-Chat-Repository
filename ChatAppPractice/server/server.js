const { instrument } = require("@socket.io/admin-ui")

const io = require("socket.io")(3000, {
    cors: { 
        allowEIO3:true,
        origin: ["http://localhost:8080", "https://admin.socket.io"],
        credentials:true
    }
});

const userIo = io.of('/user')
userIo.on("connection", socket => {
    console.log("connected to user namespace with username " + socket.username)
})

userIo.use((socket, next) => {
    if(socket.handshake.auth.token) {
        socket.username = getUsernameFromToken(socket.handshake.auth.token)
        next()
    } else {
        next(new Error('Please send token'))
    }
})//this and userIo above can be used to simply authenticate user

function getUsernameFromToken(token) {
    return token //this is where we could access information from the DB
}

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
            socket.broadcast.emit("receive-message", message) //io.emit sends to all users, io.broadcast.emit sends to all users except the sender.
            console.log(message)
        } else {
            //socket.to(room).emit("receive-message", socket.id)
            socket.to(room).emit("receive-message", message)//the 'socket.to' implicitly assumes '.broadcast.to' and does not send to sender.
        }
    })
    socket.on("join-room", (room, cb) => { //must always end a callback function with a cb if applicable
        socket.join(room)
        cb(`Joined ${room}`)
    })
    socket.on("ping", n => console.log(n))
})

instrument(io, {withCredentials: true,auth: false})