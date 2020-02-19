/*
controller Client - backend link-panel

gerencia todos os clientes da base
*/

const localStorage = require("./localStorage");
const mongoose = require('mongoose')

module.exports = {
  //index lista todos os clientes
  async index(req, res) {
    const Client = require("../models/Client")('link-panel');
    const clients = await Client.find();

    if (clients.length == 0) {
      return res.json({ msg: "No users to be listed." });
    }
    //retorna os clientes
    return res.json(clients);
  },

  //findClient procura o cliente pelo id na url
  async findClient(req, res) {
    const Client = require("../models/Client")('link-panel');
    const find = await Client.findOne({ userId: req.body.userId });

    if (find.length == 0) {
      return res.json({ error: "Cannot find this user." });
    }
    //retorna o cliente
    return res.send(find);
  },

  //client lista o cadastro do cliente passado para edição
  async client(req, res) {
    //o localStorage do node recebe o db do localStorage do front
    //e salva ele aqui para tratar no backend, talvez websocket ajude
    localStorage.setItem("db", req.body.db);
    var db = localStorage.getItem("db");
    const Client = require("../models/Client")(db); //chamando o model Client com o db
    const clientId = req.body.clientId

    mongoose.set('useUnifiedTopology', true);

    const client = await Client.findOne({ userId: clientId });

    if (client.length == 0) {
      return res.json({ msg: "Cannot found this client." });
    }
    //se encontrou client, retorna ele
    return res.json(client);
  },

  //store adiciona um novo cliente na base
  async store(req, res) {
    const {
      avatar,
      domain,
      database,
      username,
      password,
      name,
      identity,
      phone,
      email,
      city,
      state,
      plan,
      cicle,
      expires,
      niche,
      status,
      version,
      maintenance
    } = req.body;

    const Client = require("../models/Client")('link-panel');
    const clientExists = await Client.findOne({ name: name });

    if (clientExists) {
      return res.json({ msg: "This user already exists." });
    }
    //se nao existe, cria o novo cliente
    await Client.create({
      avatar,
      domain,
      database,
      username,
      password,
      name,
      identity,
      phone,
      email,
      city,
      state,
      plan,
      cicle,
      expires,
      niche,
      status,
      version,
      maintenance: 1
    });

    return res.json({ msg: `Client ${name} added successfully.` });
  },

  //update atualiza o cliente com os parametros informados
  async update(req, res) {
    // Validate Request
    /*if(!req.body.name) {
            return res.status(400).send({
                msg: "User name cannot be empty."
            });
        }*/

    const Client = require("../models/Client")('link-panel');
    const User = require("../models/User")('link-panel');
    //encontra o cliente e atualiza com req.body
    mongoose.set('useUnifiedTopology', true);

    Client.findOne({ userId: req.params.clientId })
      .then(client => {
        var clientId = client._id

        Client.findByIdAndUpdate(clientId, req.body, { new: true })
        .then(upclient => {
          // console.log(client);
          if (!upclient) {
            return res.status(404).send({
              error: "Client not found with id " + clientId
            });
          }

          User.findByIdAndUpdate(req.params.clientId, { 
            username: req.body.username,
            password: req.body.password,
            email: req.body.email 
          }, { new: false })
          .then(user => {
          //   //retorna o cliente atualizado
            res.send({ msg: "Dados atualizados com sucesso!" });
          })
          .catch(err => {
            if (err.kind === "ObjectId") {
              return res.status(404).send({
                error: "User not found with id " + clientId
              });
            }
            return res.status(500).send({
              error: "Error updating user with id " + clientId
            });
          });
        })
        .catch(err => {
          if (err.kind === "ObjectId") {
            return res.status(404).send({
              error: "Client not found with id " + clientId
            });
          }
          return res.status(500).send({
            error: "Error updating client with id " + clientId
          });
        });
      })    
  },


  //maintenance atualiza o cliente com os parametros informados
  async maintenance(req, res) {
    // Validate Request
    /*if(!req.body.name) {
            return res.status(400).send({
                msg: "User name cannot be empty."
            });
        }*/

    const Client = require("../models/Client")('link-panel');
    //encontra o cliente e atualiza com req.body
    mongoose.set('useUnifiedTopology', true);

    var clientId = req.params.clientId

    Client.findByIdAndUpdate(clientId, req.body, { new: true })
    .then(upclient => {
      // console.log(client);
      if (!upclient) {
        return res.status(404).send({
          error: "Client not found with id " + clientId
        });
      }

      res.send({ msg: "Atualizado..." + upclient.maintenance });
     
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          error: "Client not found with id " + clientId
        });
      }
      return res.status(500).send({
        error: "Error updating client with id " + clientId
      });
    });  
  },

  //delete remove o cliente da base
  async delete(req, res) {
    const Client = require("../models/Client")('link-panel');
    Client.findByIdAndRemove(req.params.clientId)
      .then(client => {
        if (!client) {
          return res.status(404).send({
            msg: "Client not found with id " + req.params.clientId
          });
        }
        //retorna sucesso na remoção
        res.send({ msg: "Client removed successfully." });
      })
      .catch(err => {
        if (err.kind === "ObjectId" || err.name === "NotFound") {
          return res.status(404).send({
            msg: "Client not found with id " + req.params.clientId
          });
        }
        return res.status(500).send({
          msg: "Could not remove client with id " + req.params.clientId
        });
      });
  }
};