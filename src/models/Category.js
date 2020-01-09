/*
model Category - backend link panel

contém a estrutura da tabela Category no banco de dados
*/

const { Schema } = require("mongoose"); //schema define a estrutura da tabela
const mongoose = require("mongoose"); //faz a conexão com o banco

//essa variavel contém todos os campos da tabela
const CategorySchema = new Schema({
  order: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

//aqui exportamos uma função que faz o connect com o banco
//repassado ao model dentro dos controllers
//params = banco de dados

module.exports = function(params) {
  const myDB = mongoose.connection.useDb(params);
  //.catch((err) => {
  //  console.log("Not Connected to Database ERROR! ", err);
  //});

  const Category = myDB.model("Category", CategorySchema);

  return Category; //retornamos a tabela para o module.exports
};