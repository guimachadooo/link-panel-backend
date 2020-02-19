/*
routes - backend link panel

aqui são identificadas as requisições e pra onde devem seguir;
instanciamos o express para enviar as rotas a ele;
*/

const express = require("express");

//aqui todos os controllers são chamados
const LoginController = require('./controllers/LoginController');
const LogoutController = require('./controllers/LogoutController');

const DashController = require('./controllers/DashController');
const AuthorController = require('./controllers/AuthorController');
const CategoryController = require('./controllers/CategoryController');
const ClientController = require('./controllers/ClientController');
const PostController = require('./controllers/PostController');
const PermissionController = require('./controllers/PermissionController');
const UserController = require('./controllers/UserController');

const routes = express.Router();

//login
routes.post('/login', LoginController.login);
routes.get('/', LoginController.defaultDb);
routes.post('/main/:encoded', LoginController.setDb);
routes.post('/panel/logout', LogoutController.logout);
//end login

// dashboard
routes.post('/panel/dashboard', DashController.indicators);
//end dashboard

// authors
routes.post('/panel/authors', AuthorController.index);
routes.post('/panel/viewauthor', AuthorController.author);
routes.post('/panel/author/new', AuthorController.store);
routes.post('/panel/authors/:authorId', AuthorController.update);

routes.post('/panel/authors/:authorId/delete', AuthorController.delete);
// end authors

// categories
routes.post('/panel/categories', CategoryController.index);
routes.post('/panel/viewcategory', CategoryController.category);
routes.post('/panel/category/new', CategoryController.store);
routes.post('/panel/categories/:categoryId', CategoryController.update);

routes.post('/panel/categories/:categoryId/delete', CategoryController.delete);
// end categories

// clients
routes.get('/panel/clients', ClientController.index);
routes.post('/panel/profile', ClientController.findClient);
// routes.post('/panel/:userId/changePlan', ClientController.changePlan);
routes.post('/panel/viewclient', ClientController.client);
routes.post('/panel/client/new', ClientController.store);
routes.post('/panel/client/:clientId', ClientController.update);
routes.post('/panel/client/maintenance/:clientId', ClientController.maintenance);

routes.delete('/panel/clients/:clientId', ClientController.delete);
// end clients

// users
routes.get('/panel/users', UserController.index);
routes.post('/panel/users', UserController.store);
routes.get('/panel/user/:userId', UserController.findOne);
// end users

// permissions
routes.get('/panel/permissions', PermissionController.index);
routes.post('/panel/permissions', PermissionController.store);
// end permissions

//posts
routes.post('/panel/posts', PostController.index);
routes.post('/panel/viewpost', PostController.post);
routes.post('/panel/post/new', PostController.store);
routes.post('/panel/post/:postId', PostController.update);

routes.post('/panel/post/:postId/delete', PostController.delete);
//end posts

//exportando todas as rotas para o express usar
module.exports = routes;