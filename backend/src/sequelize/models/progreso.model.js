module.exports = (sequelize, DataTypes) => {
	const Progreso = sequelize.define('Progreso', {
	  fecha: {
		type: DataTypes.DATE,
		allowNull: false,
	  },
	  cumplido: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
	  },
	  horas: {
		type: DataTypes.INTEGER, // Tipo de dato para almacenar horas
		allowNull: true, // Puedes hacer que sea opcional o requerido según prefieras
	  },
	});
  
	Progreso.associate = (models) => {
	  Progreso.belongsTo(models.Habito, {
		foreignKey: 'HabitoId',
		as: 'habito',
	  });
	};
  
	return Progreso;
  };
  