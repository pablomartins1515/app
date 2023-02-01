const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");

const UserRepository = require("../repositories/UserRepository");
const sqliteConnection = require("../database/sqlite");
const UserCreateService = require("../services/UserCreateService");

class UsersController {
  async create(request, response){
    const { name, email, password } = request.body; //corpo da requisição lá no insomnia

    const userRepository = new UserRepository();
    const userCreateService = new UserCreateService(userRepository);
    await userCreateService.execute({name, email, password});

    return response.status(201).json();
  }

  async update (request, response) {
    const {name, email, password, old_password} = request.body;
    const user_id = request.user.id;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);

    if(!user) {
      throw new AppError("Usuário não encontrado");
    }

    const userWithUpdateEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]); //verificar se esta mudando o email para outro que ja existe

    if(userWithUpdateEmail && userWithUpdateEmail.id !== user.id){
      throw new AppError("Este e-mail já está em uso.");
    }

    user.name = name ?? user.name; //se existir conteudo dentro de 'name', este vai se ser usado //se nao, o utilizado sera o user.name (continuar o que estava antes)
    user.email = email ?? user.email;

    
    if(password && !old_password){ //se o usuario digitou a senha antiga
      throw new AppError("Você precisa informar a senha antiga para definir a nova senha")
    }

    if(password && old_password) { //se os dois foram informados
      const checkOldPassword = await compare (old_password, user.password); //verificar se a senha antiga é igual a que está cadastrada no bd

      if(!checkOldPassword) {
        throw new AppError("A senha antiga não confere");
      }

      user.password = await hash(password, 8);
    }

    await database.run(`
      UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`,
      [user.name, user.email, user.password, user_id]
    );

    return response.json();
  }
}

module.exports = UsersController; //exportando classe



//5 métodos para o controller:
/**
 * index - GET para listar vários registros.
 * show - GET para exibir um registro específico.
 * create - POST para criar um registro.
 * update - PUT para atualizar um registro.
 * delete - DELETE para remover um regsitro.
 */