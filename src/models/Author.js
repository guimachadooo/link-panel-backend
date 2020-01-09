/*
model Author - backend link panel

contém a estrutura da tabela Author no banco de dados
*/

const { Schema } = require("mongoose"); //schema define a estrutura da tabela
const mongoose = require("mongoose"); //faz a conexão com o banco

//essa variavel contém todos os campos da tabela
const AuthorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    //required: true,
  },
  database: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    // required: true,
  },
  userId: [{
    type: Schema.Types.ObjectId,
    ref: "User",
  }],
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

  const Author = myDB.model("Author", AuthorSchema);

  return Author; //retornamos a tabela para o module.exports
};