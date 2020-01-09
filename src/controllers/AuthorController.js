/*
controller Author - backend link-panel

aqui se gerencia os autores dos posts, quem pode postar no blog/site
*/

//chamando o localStorage do node
//localStorage do front nao comunica com o back, por isso
//passa o db do front nos requests, pelo menos por enquanto
const localStorage = require("./localStorage");
const mongoose = require('mongoose')

module.exports = {
  //index lista todos os autores do blog/site
  async index(req, res) {
    //setando o db no node-localStorage
    localStorage.setItem("db", req.body.db);
    var db = localStorage.getItem("db");
    const Author = require("../models/Author")(db);//chama model Author com o db

    const authors = await Author.find();

    if (authors.length == 0) {
      return res.json({ error: "No authors to be listed." });
    }
    //se tem autores retorna eles
    return res.json(authors);
  },

  //author lista o cadastro do autor passado para edição
  async author(req, res) {
    //o localStorage do node recebe o db do localStorage do front
    //e salva ele aqui para tratar no backend, talvez websocket ajude
    localStorage.setItem("db", req.body.db);
    var db = localStorage.getItem("db");
    const Author = require("../models/Author")(db); //chamando o model Post com o db
    const authorId = req.body.authorId

    const author = await Author.findOne({ _id: authorId });

    if (author.length == 0) {
      return res.json({ error: "Não foi possível encontrar esse autor" });
    }
    //se encontrou author, retorna ele
    return res.json(author);
  },

  //store irá adicionar novos autores para gerenciar o blog/site
  async store(req, res) {
    const { name, description, database, userId } = req.body;
    //setando o db no node-localStorage
    localStorage.setItem("db", req.body.db);
    var db = localStorage.getItem("db");
    const Author = require("../models/Author")(db);//chama model Author com o db

    const authorExists = await Author.findOne({ name: name });
    //verifica se já existe com esse nome
    if (authorExists) {
      return res.json({ error: "Já existe um autor com esse nome." });
    }
    //se nao existe cria o novo autor
    await Author.create({
      name,
      description,
      database,
      userId//,
      // avatar
    });
    //retorna sucesso
    return res.json({ msg: "Autor criado com sucesso!" });
  },

  //update atualiza o autor com os parametros informados
  async update(req, res) {
    //setando o db no node-localStorage
    localStorage.setItem("db", req.body.db);
    var db = localStorage.getItem("db");
    const Author = require("../models/Author")(db);//chama model Author com o db
    // Validate Request
    /*if(!req.body.name) {
            return res.status(400).send({
                msg: "Author name cannot be empty."
            });
        }*/

    mongoose.set('useFindAndModify', false);
    //encontra o autor e atualiza com req.body
    Author.findByIdAndUpdate(req.params.authorId, req.body, { new: true })
      .then(author => {
        if (!author) {
          return res.status(404).send({
            error: "Author not found with id " + req.params.authorId
          });
        }
        //retorna o autor atualizado
        res.send({ msg: "Autor atualizado com sucesso!" });
      })
      .catch(err => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            msg: "Author not found with id " + req.params.authorId
          });
        }
        return res.status(500).send({
          msg: "Error updating author with id " + req.params.authorId
        });
      });
  },

  //delete remove o autor
  async delete(req, res) {
    //setando o db no node-localStorage
    localStorage.setItem("db", req.body.db);
    var db = localStorage.getItem("db");
    const Author = require("../models/Author")(db);//chama model Author com o db

    mongoose.set('useFindAndModify', false);

    Author.findByIdAndRemove(req.params.authorId)
      .then(author => {
        if (!author) {
          return res.status(404).send({
            msg: "Author not found with id " + req.params.authorId
          });
        }
        //se encontrou removeu e retorna sucesso
        res.send({ msg: "Autor removido com sucesso." });
      })
      .catch(err => {
        if (err.kind === "ObjectId" || err.name === "NotFound") {
          return res.status(404).send({
            msg: "Author not found with id " + req.params.authorId
          });
        }
        return res.status(500).send({
          msg: "Could not remove author with id " + req.params.authorId
        });
      });
  }
};
