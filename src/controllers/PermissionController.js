/*
controler Permission - backend link-panel

ainda será modificado, é quem controla o json de permissoes
*/

module.exports = {
  async index(req, res) {
    // const { userId } = req.headers;
    //setando o db no node-localStorage
    // localStorage.setItem("db", req.body.db);
    // var db = localStorage.getItem("db");
    //chamando o model Permission com o db do cliente, por enquanto bd padrao
    const Permission = require("../models/Permission")("link-panel");

    const permissions = await Permission.find().sort({ updatedAt: "desc" });

    if (permissions.length == 0) {
      return res.json("No permissions to be listed.");
    }
    //se encontoru retorna as permissoes
    return res.json(permissions);
  },

  async store(req, res) {
    // localStorage.setItem("db", req.body.db);
    // var db = localStorage.getItem("db");
    //chamando o model Permission com o db do cliente, por enquanto bd padrao
    const Permission = require("../models/Permission")("link-panel");
    //parametros para salvar a permissao
    const { name, actions, status } = req.body;

    const permissionExists = await Permission.findOne({ name: name });
    //se ja existe nao adiciona
    if (permissionExists) {
      return res.json("This permission already exists.");
    }
    //se nao existe cria a permissao
    await Permission.create({
      name,
      actions,
      status
    });

    return res.json({ msg: `Permission ${name} added successfully.` });
  }
};
