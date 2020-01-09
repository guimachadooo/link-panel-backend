/*
controller Dash - backend link-panel

traz todos os indicadores na tela principal
*/

//chamando o localStorage do node
//localStorage do front nao comunica com o back, por isso
//passa o db do front nos requests, pelo menos por enquanto
const localStorage = require("./localStorage")

module.exports = {
  //indicators traz todos os indicadores do dashboard
  async indicators(req, res){
    //setando o db no node-localStorage
    localStorage.setItem("db", req.body.db);
    var db = localStorage.getItem("db");
    //chamando os models com o db
    const Post = require("../models/Post")(db);
    const Category = require("../models/Category")(db);
    const Author = require("../models/Author")(db);

    const findPosts = await Post.find();
    const totalPosts = findPosts.length;

    const findCats = await Category.find();
    const totalCats = findCats.length;

    const findAuthors = await Author.find();
    const totalAuthors = findAuthors.length;

    return res.json({
      posts: totalPosts,
      categories: totalCats,
      authors: totalAuthors
    });

  },
}