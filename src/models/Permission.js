/*
model Permission - backend link panel

contém a estrutura da tabela Permission no banco de dados
*/

const { Schema } = require("mongoose"); //schema define a estrutura da tabela
const mongoose = require("mongoose"); //faz a conexão com o banco

//essa variavel contém todos os campos da tabela
const PermissionSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  actions: {
    type: Array,
    required: true
  },
  status: {
    type: String,
    required: true
  }
});

//aqui exportamos uma função que faz o connect com o banco
//repassado ao model dentro dos controllers
//params = banco de dados

module.exports = function(params) {
  const myDB = mongoose.connection.useDb(params);
  //.catch((err) => {
  //  console.log("Not Connected to Database ERROR! ", err);
  //});

  const Permission = myDB.model("Permission", PermissionSchema);

  return Permission; //retornamos a tabela para o module.exports
};