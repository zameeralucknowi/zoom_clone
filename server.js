require('dotenv').config();
const express = require('express');
const { v4: uuidv4 } = require('uuid')
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});

app.set('view engine', 'ejs');
app.use(express.static("public"))


app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
})

app.use('/peerjs', peerServer);

app.get('/:roomId', (req, res) => {
    const roomId = req.params.roomId;
    res.render('room', { roomId })
})

io.on('connection', (socket) => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', userId);

        socket.on('message', message => {
            io.to(roomId).emit('createMessage', message)
        })

        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected', userId);
            // socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })


    })
})


server.listen(process.env.PORT || 3000);


/////////////////////////////////////////////////////////////////////

// const express = require('express')
// const app = express()
//     // const cors = require('cors')
//     // app.use(cors())
// const server = require('http').Server(app)
// const io = require('socket.io')(server)
// const { ExpressPeerServer } = require('peer');
// const peerServer = ExpressPeerServer(server, {
//     debug: true
// });
// const { v4: uuidV4 } = require('uuid')

// app.use('/peerjs', peerServer);

// app.set('view engine', 'ejs')
// app.use(express.static('public'))

// app.get('/', (req, res) => {
//     res.redirect(`/${uuidV4()}`)
// })

// app.get('/:room', (req, res) => {
//     res.render('room', { roomId: req.params.room })
// })

// io.on('connection', socket => {
//     socket.on('join-room', (roomId, userId) => {
//         socket.join(roomId)
//             // socket.to(roomId).broadcast.emit('user-connected', userId);
//         socket.broadcast.to(roomId).emit('user-connected', userId);
//         // messages
//         socket.on('message', (message) => {
//             //send message to the same room
//             io.to(roomId).emit('createMessage', message)
//         });

//         socket.on('disconnect', () => {
//             socket.to(roomId).broadcast.emit('user-disconnected', userId)
//         })
//     })
// })

// server.listen(3000)