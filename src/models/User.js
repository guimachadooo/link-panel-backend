/*
model User - backend link panel

contém a estrutura da tabela User no banco de dados
*/

const { Schema } = require("mongoose"); //schema define a estrutura da tabela
const mongoose = require("mongoose"); //faz a conexão com o banco

//essa variavel contém todos os campos da tabela
const UserSchema = new Schema(
  {
    database: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    permissions: {
      type: Object,
      required: true
    }
  },
  {
    timestamps: true
  }
);

//aqui exportamos uma função que faz o connect com o banco
//repassado ao model dentro dos controllers
//nesse model por enquanto deixamos fixo o banco
//usado para conectar com o link-panel apenas

module.exports = function(params) {
  const myDB = mongoose.connection.useDb(params);
  //.catch((err) => {
  //  console.log("Not Connected to Database ERROR! ", err);
  //});

  const User = myDB.model("User", UserSchema);

  return User; //retornamos a tabela para o module.exports
};