/*
controller Logout - backend link-panel
*/

//chamando o localStorage do node
//localStorage do front nao comunica com o back, por isso
//passa o db do front nos requests, pelo menos por enquanto
const localStorage = require("./localStorage")

module.exports = {
  async logout(req, res){
    //remove a session do node
    localStorage.removeItem('db');
    localStorage.clear();
    //no front tambem remove a session la
    res.send({ msg: "Client successfully logged out." });
  }
}
