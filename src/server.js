/* 
server.js - backend link panel 

aqui iniciamos o servidor node com o pacote express;
o pacote cors é utilizado para aceitar as requisições
de qualquer url;

o arquivo routes contém todas as rotas do app, ele 
passa dentro do express

socket-io usado para teste por enquanto, para trocar dados
com o frontend por websockets
*/

const express = require("express");
const cors = require("cors");
const routes = require("./routes");


const app = express();
var bodyParser = require('body-parser')
var path = require('path');

const server = require("http").Server(app);
const io = require("socket.io")(server);

const connectedUsers = {};

io.on("connection", socket => {
  //console.log(socket.id);

  const { user } = socket.handshake.query;

  console.log(user, socket.id)
  connectedUsers[user] = socket.id;

  socket.on('user', res => {
    //console.log(res);
  })

  setTimeout(() => {
    socket.emit('req', {
      res: 'teste'
    })
  }, 1100);
});

app.use((req, res, next) => {
  //antes de iniciar o express, passamos o 
  //websocket pra ele escutar também
  req.io = io;
  req.connectedUsers = connectedUsers;
  res.header('Access-Control-Allow-Origin', '*');

  return next();
});


app.use(cors());
app.use(express.json());
app.use(routes);

//apos iniciar o cors, leitura json e rotas no express,
//o server escuta as requisições na porta 7777
server.listen(process.env.PORT || 5000)
