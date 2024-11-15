const { Sequelize, DataTypes } = require('sequelize');
const aplicarRelaciones = require('./extra-setup');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db.sqlite',
  logging: false,
});

const Usuario = require('./models/usuario.model')(sequelize, DataTypes);
const Habito = require('./models/habito.model')(sequelize, DataTypes);
const Progreso = require('./models/progreso.model')(sequelize, DataTypes);

aplicarRelaciones(sequelize);

module.exports = { sequelize, Usuario, Habito, Progreso };
