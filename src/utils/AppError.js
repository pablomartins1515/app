class AppError {
  message;
  statusCode;

  constructor(message, statusCode = 400){
    //repassando as informações
    this.message = message;
    this.statusCode = statusCode;
  }
}

module.exports = AppError;