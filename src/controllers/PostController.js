/*
controller Post - backend link-panel

aqui serao gerenciados todos os posts dos clientes
em breve com o metodo de upload de arquivos
*/

//chamando o localStorage do node
//localStorage do front nao comunica com o back, por isso
//passa o db do front nos requests, pelo menos por enquanto
const localStorage = require("./localStorage");
const mongoose = require('mongoose')

module.exports = {
  //index irá listar todos os posts
  async index(req, res) {
    //o localStorage do node recebe o db do localStorage do front
    //e salva ele aqui para tratar no backend, talvez websocket ajude
    localStorage.setItem("db", req.body.db);
    var db = localStorage.getItem("db");
    const Post = require("../models/Post")(db); //chamando o model Post com o db

    const posts = await Post.find().sort({ updatedAt: "desc" });

    if (posts.length == 0) {
      return res.json({ msg: "No posts to be listed." });
    }
    //se encontrou posts, retorna eles
    return res.json(posts);
  },

  //post lista o cadastro do post passado para edição
  async post(req, res) {
    //o localStorage do node recebe o db do localStorage do front
    //e salva ele aqui para tratar no backend, talvez websocket ajude
    localStorage.setItem("db", req.body.db);
    var db = localStorage.getItem("db");
    const Post = require("../models/Post")(db); //chamando o model Post com o db
    const postId = req.body.postId

    const post = await Post.findOne({ _id: postId });

    if (post.length == 0) {
      return res.json({ msg: "Cannot found this post." });
    }
    //se encontrou post, retorna ele
    return res.json(post);
  },

  //store irá adicionar novos posts ao banco do usuario
  async store(req, res) {
    const { status, title, brief, content, likes, category, author } = req.body;
    //setando o db no node-localStorage
    localStorage.setItem("db", req.body.db);
    var db = localStorage.getItem("db");
    const Post = require("../models/Post")(db); //chamando o model Post com o db

    const postExists = await Post.findOne({ title: title });
    //verifica se já existe o post com esse titulo
    if (postExists) {
      return res.json({ error: "Já existe um post com esse nome, escolha outro." });
    }
    //se nao existe cria o novo post
    await Post.create({
      status,
      title,
      brief,
      content,
      likes,
      category,
      author
    });
    //retorna sucesso
    return res.json({ msg: "Post adicionado com sucesso!" });
  },

  //update atualiza as informações de um post
  async update(req, res) {
    //setando o db no node-localStorage
    localStorage.setItem("db", req.body.db);
    var db = localStorage.getItem("db");
    const Post = require("../models/Post")(db); //chamando o model Post com o db

    mongoose.set('useUnifiedTopology', true);

    //encontra o post e atualiza com o req.body
    Post.findByIdAndUpdate(req.params.postId, req.body, { new: true })
      .then(post => {
        if (!post) {
          return res.status(404).send({
            error: "Post not found with id " + req.params.postId
          });
        }
        //se encontrou retorna o post atualizado
        res.send({ msg: "post alterado com sucesso!" });
      })
      .catch(err => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            msg: "Post not found with id " + req.params.postId
          });
        }
        return res.status(500).send({
          msg: "Error updating post with id " + req.params.postId
        });
      });
  },

  //searchPosts encontra posts com a string informada
  async searchPosts(req, res) {
    //setando o db no node-localStorage
    localStorage.setItem("db", req.body.db);
    var db = localStorage.getItem("db");
    const Post = require("../models/Post")(db); //chamando o model Post com o db

    const title = req.params.searchString.split("-").join(" ");

    Post.find({ title: { $regex: ".*" + title + ".*" } })
      .sort({ updatedAt: "desc" }) //ordena por ultimos cadastrados
      .then(post => {
        if (!post) {
          return res.status(404).send({
            msg: "Post not found with name " + req.params.searchString
          });
        }

        if (post.length == 0) {
          return res.json({
            msg:
              "Você pesquisou por '" +
              req.params.searchString +
              "'. Nada encontrado."
          });
        }
        //retorna o post ou posts
        res.send(post);
      })
      .catch(err => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            msg: "Post not found with name " + req.params.searchString
          });
        }
        return res.status(500).send({
          msg: "Error retrieving post with name " + req.params.searchString
        });
      });
  },

  //findByCategory encontra os posts por categoria
  async findByCategory(req, res) {
    //setando o db no node-localStorage
    localStorage.setItem("db", req.body.db);
    var db = localStorage.getItem("db");
    const Post = require("../models/Post")(db); //chamando o model Post com o db

    const title = req.params.categoryName.split("-").join(" ");

    Category.findOne({ name: title })
      .then(category => {
        if (!category) {
          return res.status(404).send({
            msg: "Category not found with name " + req.params.categoryName
          });
        }
        //se encontrou a categoria, busca os posts com essa categoria
        Post.find({
          category: category._id
        })
          .then(post => {
            if (!post) {
              return res.status(404).send({
                msg: "Post not found with category " + req.params.categoryName
              });
            }

            if (post.length == 0) {
              return res.json({
                msg: "Sem posts para a categoria " + req.params.categoryName
              });
            }
            //se encontrou os posts, retorna eles
            res.send(post);
          })
          .catch(err => {
            if (err.kind === "ObjectId") {
              return res.status(404).send({
                msg: "Post not found with category " + req.params.categoryName
              });
            }
            return res.status(500).send({
              msg:
                "Error retrieving post with category " + req.params.categoryName
            });
          });
      })
      .catch(err => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            msg: "Category not found with name " + req.params.categoryName
          });
        }
      });
  },

  //delete remove os posts do banco do cliente,
  //no futuro pode ser que mude para update de status pra não remover
  async delete(req, res) {
    //setando o db no node-localStorage
    localStorage.setItem("db", req.body.db);
    var db = localStorage.getItem("db");
    const Post = require("../models/Post")(db); //chamando o model Post com o db

    mongoose.set('useFindAndModify', false);

    Post.findByIdAndRemove(req.body.postId)
      .then(post => {
        if (!post) {
          return res.status(404).send({
            error: "Post not found with id " + req.body.postId
          });
        }
        //retorna sucesso
        res.send({ msg: "Post removido." });
      })
      .catch(err => {
        if (err.kind === "ObjectId" || err.name === "NotFound") {
          return res.status(404).send({
            msg: "Post not found with id " + req.body.postId
          });
        }
        return res.status(500).send({
          msg: "Could not remove post with id " + req.body.postId
        });
      });
  }
};
