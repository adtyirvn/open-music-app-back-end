const ClientError = require('./ClientError');

class NotFoundError extends ClientError {
  constructor(message, statusCode = 404) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'Not Found Error';
  }
}
module.exports = NotFoundError;
