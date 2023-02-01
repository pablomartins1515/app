require("express-async-errors");
require("dotenv/config");

const migrationsRun = require("./database/sqlite/migrations");
const AppError = require("./utils/AppError");

const uploadConfig = require("./configs/upload");

const cors = require("cors");
const express = require("express"); //importando
const routes = require("./routes") //vai carregar o index por padrão

migrationsRun();

const app = express(); //inicializando o express
app.use(cors());
app.use(express.json()); //informando para essa api que o padrão utilizado para receber as informações é JSON

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes); //usar estas rotas

//tratando excessões
app.use((error, request, response, next) => {
  if(error instanceof AppError){//saber se o error é do lado do cliente //se a instancia é do tipo AppError
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    })
  }

  console.error(error);

  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  })

});

const PORT = process.env.PORT || 3333; //definindo endereço / número da porta que a api vai ficar esperando as requisições
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`)); // ficar "escutando" esta porta.. e quando a aplicação iniciar, vai executar a mensagem