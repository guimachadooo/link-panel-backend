/*
model Post - backend link panel

contém a estrutura da tabela Post no banco de dados
*/

const { Schema } = require("mongoose"); //schema define a estrutura da tabela
const mongoose = require("mongoose"); //faz a conexão com o banco

//essa variavel contém todos os campos da tabela
const PostSchema = new Schema(
  {
    status: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    brief: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    likes: {
      type: Number
      //required: true,
    },
    category: {
      type: String,
      required: true
    },
    author: [
      {
        type: Schema.Types.ObjectId,
        ref: "Author"
      }
    ]
  },
  {
    timestamps: true
  }
);

//aqui exportamos uma função que faz o connect com o banco
//repassado ao model dentro dos controllers
//params = banco de dados

module.exports = function(params) {
  const myDB = mongoose.connection.useDb(params);
  //.catch((err) => {
  //  console.log("Not Connected to Database ERROR! ", err);
  //});

  const Post = myDB.model("Post", PostSchema);

  return Post; //retornamos a tabela para o module.exports
};