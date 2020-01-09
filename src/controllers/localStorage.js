//faz a instancia do node-localstorage
var LocalStorage = require('node-localstorage').LocalStorage,
//pasta onde ficam salvos os dados
localStorage = new LocalStorage('./scratch');

module.exports = localStorage