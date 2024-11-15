function aplicarRelaciones(sequelize) {
	const { Usuario, Habito, Progreso } = sequelize.models;
  
	Usuario.hasMany(Habito, {
	  foreignKey: 'usuarioId',
	  as: 'habitos',
	});
  
	Habito.belongsTo(Usuario, {
	  foreignKey: 'usuarioId',
	  as: 'usuario',
	});
  
	Habito.hasMany(Progreso, {
	  foreignKey: 'habitoId',
	  as: 'progresos',
	});
  
	Progreso.belongsTo(Habito, {
	  foreignKey: 'habitoId',
	  as: 'habito',
	});
  }
  
  module.exports = aplicarRelaciones;
  