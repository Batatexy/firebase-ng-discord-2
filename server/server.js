// node "server/server.js"

const { log } = require('console');

//Importa o express
const http = require('http').createServer();

//Importa o socket.io
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
    },
});

//Recebe a conexão do cliente
io.on('connection', (socket) => {
    log(typeof socket);
    console.log('New client connected');

    //Recebe a mensagem do cliente
    socket.on('message', (message) => {
        console.log(message.userID, message.text);

        //Envia a mensagem para todos os clientes conectados
        //Não consegui fazer mandar o socket (Caso precise)
        io.emit('message', message);
    });
})

http.listen(8080, () => {
    console.log('Server is listening on port 8080');
});

