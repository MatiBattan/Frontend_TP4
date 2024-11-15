const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

function generateToken(usuario) {
  return jwt.sign(
    { id: usuario.id, email: usuario.email },
    SECRET_KEY,
    { expiresIn: '24h' }
  );
}

module.exports = { generateToken };
