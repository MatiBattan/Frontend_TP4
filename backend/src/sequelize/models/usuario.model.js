module.exports = (sequelize, DataTypes) => {
	const Usuario = sequelize.define('Usuario', {
	  nombre: {
		type: DataTypes.STRING,
		allowNull: false,
	  },
	  email: {
		type: DataTypes.STRING,
		unique: true,
		allowNull: false,
	  },
	  contraseña: {
		type: DataTypes.STRING,
		allowNull: false,
	  },
	});
	
	Usuario.associate = (models) => {
	  Usuario.hasMany(models.Habito, {
		foreignKey: 'usuarioId',
		as: 'habitos',
	  });
	};
  
	return Usuario;
  };
  