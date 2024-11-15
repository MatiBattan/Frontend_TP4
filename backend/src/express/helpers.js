function validarEmail(email) {
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return regex.test(email);
  }
  
  function manejarError(res, error, mensaje = 'Ocurrió un error') {
	console.error(error);
	res.status(500).json({ error: mensaje });
  }
  
  module.exports = {
	validarEmail,
	manejarError,
  };
  