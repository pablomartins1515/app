const { verify } = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth");

function ensureAuthenticated(request, response, next) {
  const authHeader = request.headers.authorization;

  if(!authHeader){ //verifica se o token não existe
    throw new AppError("JWT Token não informado", 401);
  }

  const [, token] = authHeader.split(" "); //quebrando o texto em um array e pegando apenas a segunda posição para a var 'token'

  try {
    const {sub: user_id} = verify(token, authConfig.jwt.secret); //verificar se é um token válido

    request.user = {
      id: Number(user_id)
    };

    return next();
  } catch {
    throw new AppError("JWT Token inválido", 401);
  }
}

module.exports = ensureAuthenticated;