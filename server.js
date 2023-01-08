const express = require('express')
const app = express()
const server = require('http').Server(app)

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html')
})
const CLIENT_LIST = {}

app.use(express.static(__dirname + '/client'))
server.listen(6969)

const io = require('socket.io') (server, {})
io.sockets.on('connection', function(socket) {
    socket.id = randomInteger(0, 999999999999)
    socket.isBusy = false
    socket.match = ""
    CLIENT_LIST[socket.id] = socket
    console.log('new connection! ' + socket.id)

    socket.on('disconnect', function() {
        if(socket.isBusy) {
            socket.match.emit('strangerDisconnected')
        }
        
        delete CLIENT_LIST[socket.id]
        delete queue[socket.id]
    })

    socket.on('sendMessage', function(data) {
        // console.log(data)
        // console.log(CLIENT_LIST[data.strange])

        CLIENT_LIST[data.stranger].emit('newMessage', { text: data.text })
    })
})

const queue = {}

setInterval(function() {
    for(let i in CLIENT_LIST) {
        const client = CLIENT_LIST[i]
        if(!client.isBusy && !queue[i]) {
            queue[i] = client
            console.log(`added ${i} to queue`)
        }
    }
}, 1000) // raz na 2 sekudny sprawdzamy czy wszyscy maja matcha i dodajemy do queue

setInterval(function() {
    if(Object.keys(queue).length <= 1) return
    for(let i in queue) {
        let s2
        for(let j in queue) {
            if(j !== i) {
                s2 = CLIENT_LIST[j]
            }
        }
        // console.log(i)
        const stranger1 = CLIENT_LIST[i]
        // const stranger2 = CLIENT_LIST[]
        match(stranger1, s2)
    }
}, 1000) // raz na 2 sekundy sprawdzamy czy jest kogo matchować, jeśli tak, to robimy to

function match(stranger1, stranger2) {
    if(stranger1 == stranger2) return
    stranger1.match = stranger2
    stranger2.match = stranger1
    stranger1.emit('newMatch', { id: stranger2.id})
    stranger2.emit('newMatch', { id: stranger1.id})
    delete queue[stranger1.id]
    delete queue[stranger2.id]
    console.log(queue)
    stranger1.isBusy = true
    stranger2.isBusy = true
    stranger1.match = stranger2
    stranger2.match = stranger1
    console.log(`Matched ${stranger1.id} & ${stranger2.id}`)
}


function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
