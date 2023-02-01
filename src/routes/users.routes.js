const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const UsersController = require("../controllers/UsersController")
const UserAvatarController = require("../controllers/UserAvatarController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const usersRoutes = Router();
const upload = multer(uploadConfig.MULTER);

const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

//usersRoutes.post("/", (request, response) => {})
usersRoutes.post("/", usersController.create); //chamando o método da classe UsersController
usersRoutes.put("/", ensureAuthenticated, usersController.update);
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarController.update) //atualiza um campo especifico

module.exports = usersRoutes;



//      MIDDLEWARES       //
/*function myMiddleware(request, response, next){ //next -> destino da requisição que é interceptada pelo middleware
  console.log('voce passou pelo middleware')

  if(!request.body.isAdmin) {
    return response.json({message: "user unauthorized"})
  }

  next(); //chama o proximo destino
}*/
//usersRoutes.use(myMiddleware); //aplicando middleware a todas as rotas de usuario
//usersRoutes.post("/", myMiddleware, usersController.create); //aplicando middleware a uma rota especifica
