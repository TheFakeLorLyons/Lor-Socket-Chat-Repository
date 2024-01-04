import {io} from "socket.io-client"

const joinRoomButton = document.getElementById("room-button")
const messageInput = document.getElementById("message-input")
const roomInput = document.getElementById("room-input")
const form = document.getElementById("form")

const socket = io('http://localhost:3000')
const userSocket = io("http://localhost:3000/user", { auth: {token: "Test"} //if we dont check the auth or they dont pass then the below code will run
})

//userSocket.on('connect_error", error => {
    //displayMessage(error)                                 //For instructional use
//})

socket.on("connect", () => {
    displayMessage(`You connected with id: ${socket.id}`)   //Message displayed to CLIENT (defined by us below)
    socket.emit('custom-event', 10, 'Hi', {a: 'a'})         //sends an event out to the SERVER
})

//socket.emit('custom-event', 12, 'Hello', {c: 'b'})
socket.on("receive-message", message => {
    displayMessage(message)
})

form.addEventListener("submit", e => {
    e.preventDefault()
    const message = messageInput.value
    const room = roomInput.value

    if (message === "") return
    displayMessage(message)
    socket.emit('send-message', message, room)

    messageInput.value = ""
})

joinRoomButton.addEventListener("click", () => {
    const room = roomInput.value
    socket.emit('join-room', room, message => {
        displayMessage(message)
    })
})

function displayMessage(message) {
    const div = document.createElement("div")
    div.textContent = message
    document.getElementById("message-container").append(div)
}


let count = 0
setInterval(() => {
    socket.volatile.emit("ping", ++count) //okay so volatile will make it so no messages are passed if there is a disconnection with the server.
}, 1000)                                    //if removed, the code wil send all the messages that were sent in the interim all at once upon reconnection.

document.addEventListener("keydown", e => {
    if (e.target.matches("input")) return

    if (e.key === "c") socket.connect()
    if (e.key === "d") socket.disconnect()
})