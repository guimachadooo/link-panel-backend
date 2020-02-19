/*
model Client - backend link panel

contém a estrutura da tabela Client no banco de dados
*/
const { Schema } = require("mongoose"); //schema define a estrutura da tabela
const mongoose = require("mongoose"); //faz a conexão com o banco

//essa variavel contém todos os campos da tabela
const ClientSchema = new Schema(
  {
    userId: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      required: true
    },
    domain: {
      type: String,
      required: true
    },
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
    identity: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    city: String,
    state: String,
    plan: {
      type: Number,
      required: true
    },
    cicle: {
      type: Number,
      required: true
    },
    expires: {
      type: String,
      required: true
    },
    niche: String,
    status: Number,
    version: String,
    maintenance: Number,
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Permission"
      }
    ]
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

  const Client = myDB.model("Client", ClientSchema);

  return Client; //retornamos a tabela para o module.exports
};
