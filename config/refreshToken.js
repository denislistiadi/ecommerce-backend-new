const jwt = require('jsonwebtoken');

const refreshGenerateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' });

module.exports = { refreshGenerateToken };
