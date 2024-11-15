module.exports = (sequelize, DataTypes) => {
	const Habito = sequelize.define('Habito', {
	  nombre: {
		type: DataTypes.STRING,
		allowNull: false,
	  },
	  descripcion: {
		type: DataTypes.STRING,
	  },
	  frecuencia: {
		type: DataTypes.INTEGER,
		allowNull: false,
	  },
	  notificaciones: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	  },
	  fechaCreacion: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: DataTypes.NOW,
	  },
	  fechaEliminacion: {
		type: DataTypes.DATE,
		allowNull: true,
	  },
	  eliminado: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false,
	  },
	});

	Habito.associate = (models) => {
	  Habito.belongsTo(models.Usuario, {
		foreignKey: 'idUsuario',
		as: 'usuario',
	  });
	  Habito.hasMany(models.Progreso, {
		foreignKey: 'idHabito',
		as: 'progresos',
	  });
	};

	return Habito;
  };
  