/*
controller Category - backend link-panel

aqui se gerencia as categorias dos categorys
*/

//chamando o localStorage do node
//localStorage do front nao comunica com o back, por isso
//passa o db do front nos requests, pelo menos por enquanto
const localStorage = require("./localStorage");
const mongoose = require('mongoose')

module.exports = {
  //index lista todos os categorias do blog/site
  async index(req, res) {
    //setando o db no node-localStorage
    localStorage.setItem("db", req.body.db);
    var db = localStorage.getItem("db");
    const Category = require("../models/Category")(db);//chama model Category com o db

    const categories = await Category.find()
    .sort({ updatedAt: "desc" });

    if (categories.length == 0) {
      return res.json("No categories to be listed.");
    }
    //se tem categorias retorna eles
    return res.json(categories);
  },

  //category lista o cadastro do category passado para edição
  async category(req, res) {
    //o localStorage do node recebe o db do localStorage do front
    //e salva ele aqui para tratar no backend, talvez websocket ajude
    localStorage.setItem("db", req.body.db);
    var db = localStorage.getItem("db");
    const Category = require("../models/Category")(db); //chamando o model Post com o db
    const categoryId = req.body.categoryId

    const category = await Category.findOne({ _id: categoryId });

    if (category.length == 0) {
      return res.json({ msg: "Cannot found this category." });
    }
    //se encontrou category, retorna ele
    return res.json(category);
  },

  //store irá adicionar novos categorias para gerenciar o blog/site
  async store(req, res) {
    const { order, name} = req.body;
    //setando o db no node-localStorage
    localStorage.setItem("db", req.body.db);
    var db = localStorage.getItem("db");
    const Category = require("../models/Category")(db);//chama model Category com o db

    const categoryExists = await Category.findOne({ name: name });
    //verifica se já existe com esse nome
    if (categoryExists) {
      return res.json({ error: "Já existe uma categoria com esse nome." });
    }
    //se nao existe cria o novo autor
    await Category.create({
      order,
      name
    });
    //retorna sucesso
    return res.json({ msg: "Categoria criada com sucesso!" });
  },

  //update atualiza o autor com os parametros informados
  async update(req, res) {
    //setando o db no node-localStorage
    localStorage.setItem("db", req.body.db);
    var db = localStorage.getItem("db");
    const Category = require("../models/Category")(db);//chama model Category com o db
    // Validate Request
    /*if(!req.body.name) {
            return res.status(400).send({
                msg: "Category name cannot be empty."
            });
        }*/
    mongoose.set('useFindAndModify', false);

    //encontra o autor e atualiza com req.body
    Category.findByIdAndUpdate(req.params.categoryId, req.body, { new: true })
      .then(category => {
        if (!category) {
          return res.status(404).send({
            msg: "Category not found with id " + req.params.categoryId
          });
        }
        //retorna o autor atualizado
        res.send({ msg: "Categoria atualizada com sucesso!" });
      })
      .catch(err => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            msg: "Category not found with id " + req.params.categoryId
          });
        }
        return res.status(500).send({
          msg: "Error updating category with id " + req.params.categoryId
        });
      });
  },

  //delete remove o autor
  async delete(req, res) {
    //setando o db no node-localStorage
    localStorage.setItem("db", req.body.db);
    var db = localStorage.getItem("db");
    const Category = require("../models/Category")(db);//chama model Category com o db

    mongoose.set('useFindAndModify', false);

    Category.findByIdAndRemove(req.params.categoryId)
      .then(category => {
        if (!category) {
          return res.status(404).send({
            msg: "Category not found with id " + req.params.categoryId
          });
        }
        //se encontrou removeu e retorna sucesso
        res.send({ msg: "Categoria removida com sucesso." });
      })
      .catch(err => {
        if (err.kind === "ObjectId" || err.name === "NotFound") {
          return res.status(404).send({
            msg: "Category not found with id " + req.params.categoryId
          });
        }
        return res.status(500).send({
          msg: "Could not remove category with id " + req.params.categoryId
        });
      });
  }
};
