/*
controller Login - backend link-panel

intermedia o request de login, verifica se o usuario
existe na base, se existir retorna o objeto user com
o banco de dados dele que será usado adiante
*/
const User = require("../models/User")('link-panel');//chamando o model User

module.exports = {
  //login verifica se o usuario existe para avançar no painel
  async login(req, res){
    
    User.findOne({ username: req.body.username, password: req.body.password })
    .then(user => {
      //console.log(user);
      if (!user) {
        return res.send({
          msg: 'Usuário ou senha incorretos...'
        });

      }
      //retorna o usuario encontrado
      res.send(user);

    }).catch(err => {
      // console.log(err);
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          msg: "User not found with username " + req.body.username
        });
      }

      return res.status(500).send({
        msg: "Error retrieving User with username " + req.body.username
      });
    });
  },

  //setDb utiliza o usuario encontrado para conectar ao banco dele
  async setDb(req, res){
    // console.log(req.body)
    User.findOne({ _id: req.body.id, database: req.body.database })
    .then(user => {

      if (!user) {
        //return res.status(404).send({
        return res.send({
          msg: 'Usuário ou banco de dados incorretos...'
        });
      }
      //retorna o usuario com seu banco de dados para o componente Main,
      //no frontend ao receber esse retorno despacha para /main/user/dashboard
      res.send({ user: user })

    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          msg: "User not found with database " + req.body.database
        });
      }

      return res.status(500).send({
        msg: "Error retrieving User with database " + req.body.database
      });
    });    
  },

  //inicia o painel conectando ao banco padrao para checar os usuarios
  async defaultDb(req, res){
    const mongoose = require("mongoose");
    var connectTo = `mongodb+srv://admin:lennon01@cluster0-zy4l4.mongodb.net/link-panel?retryWrites=true&w=majority`;


    mongoose.connect(connectTo, {
      useNewUrlParser: true,
      useFindAndModify: false
    }, function(err, db) {
      if (err) {
        console.log(`Unable to connect defaultDb. Please start the server. Error:`, err);
      } else {
        //retorna o nome do banco so pra saber se esta ok
        var db = db.db.s.databaseName;
        res.send(`database_set_${db}`);
      }
    })    
  }
}