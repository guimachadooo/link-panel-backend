/*
controller User - backend link panel

aqui são criados todos os metodos pra interagir com o banco
ex: listar, adicionar, editar, excluir, filtrar

nesse controller verificamos se o usuario e senha
no login existem, pra direcionar ao banco certo,
entre outras verificações
*/

const User = require("../models/User")('link-panel'); //chamando o model User
//const Permission = require("../models/Permission");

module.exports = {
  //index vai listar todos os usuarios para o admin
  async index(req, res) {
    //busca os usuarios na tabela User do bd link-panel
    const users = await User.find();

    if (users.length == 0) {
      return res.json({ msg: "No users to be listed" });
    }
    //se tem usuarios retorna a resposta
    return res.json(users);
  },

  //findOne busca um usuario especifico através do ID
  async findOne(req, res) {
    const userId = req.params.userId;

    User.findOne({ _id: userId })
    .then(user => {
      if (!user) {
        return res.status(404).send({
          msg: "User not found with id " + req.params.userId
        });
      }
      //se achou o usuario envia a resposta
      res.send(user);
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          msg: "User not found with id " + req.params.userId
        });
      }
      return res.status(500).send({
        msg: "Error retrieving post with id " + req.params.userId
      });
    });
  },

  //store irá adicionar novos usuarios a base
  async store(req, res) {
    const {
      database, username, password, name, email, status, permissions
    } = req.body; //listando todos os campos a serem inseridos

    const userExists = await User.findOne({ username: username });
    //se tem o usuario não cria novamente
    if (userExists) {
      return res.json("This user already exists.");
    }
    //se não tem, cria o novo usuario com os parametros
    await User.create({
      database, username, password, name, email, status, permissions
    });
    //envia a resposta no sucesso do create
    return res.json({ "msg": `User ${name} added successfully.` });
  },

  //update irá atualizar o usuario com os dados repassados 
  //no body da requisição
  async update(req, res) {
    //Validate Request
    /*if(!req.body.name) {
        return res.status(400).send({
            msg: "User name cannot be empty."
        });
    }*/

    const userId = req.params;

    //encontrando o usuario e atualizando com o req.body
    User.findByIdAndUpdate(userId, req.body, { new: true })
    .then(user => {
      // console.log(user);
      if (!user) {
        return res.status(404).send({
          msg: "User not found with id " + req.params.userId
        });
      }
      //envia o retorno com o usuario atualizado
      res.send(user);

    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          msg: "User not found with id " + req.params.userId
        });
      }
      return res.status(500).send({
        msg: "Error updating User for id " + req.params.userId
      });
    });
  },

  //delete irá remover o registro, daqui um tempo
  //iremos atualizar pra dar um update status ao invés de delete
  async delete(req, res) {
    //encontrando o usuario com o id
    User.findByIdAndRemove(req.params.userId)
    .then(User => {
      if (!user) {
        return res.status(404).send({
          msg: "User not found with id " + req.params.userId
        });
      }
      //retorna mensagem de sucesso
      res.send({ msg: "User removed successfully." });
    }).catch(err => {
      if (err.kind === 'ObjectId' || err.name === 'NotFound') {
        return res.status(404).send({
          msg: "User not found with id " + req.params.userId
        });
      }
      return res.status(500).send({
        msg: "Could not remove user with id " + req.params.userId
      });
    });
  }
}