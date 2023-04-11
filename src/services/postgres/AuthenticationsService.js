const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class AuthenticationsService {
  constructor() {
    this._pool = new Pool();
    this._table = 'authentications';
  }

  async addRefreshToken(token) {
    const query = {
      text: `INSERT INTO ${this._table} VALUES($1)`,
      values: [token],
    };
    await this._pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: `SELECT token FROM ${this._table} WHERE token = $1`,
      values: [token],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: `DELETE FROM ${this._table} WHERE token = $1`,
      values: [token],
    };
    await this._pool.query(query);
  }
}
module.exports = AuthenticationsService;
