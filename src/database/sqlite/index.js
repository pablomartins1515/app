const sqlite3 = require("sqlite3"); //drive
const sqlite = require("sqlite"); //responsavel por conectar
const path = require("path"); //resolve os endereços de acordo com o ambiente

async function sqliteConnection(){
  const database = await sqlite.open({
    filename: path.resolve(__dirname, "..", "database.db"), //propriedade para falar onde o arquivo fica salvo
    driver: sqlite3.Database
  });

  return database;
}

module.exports = sqliteConnection;