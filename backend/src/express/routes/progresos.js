const express = require('express');
const router = express.Router();
const { Progreso, Habito } = require('../../sequelize');
const { manejarError } = require('../helpers');

router.get('/:id', async (req, res) => {
  try {
    const progresos = await Progreso.findAll({ where: { habitoId: req.params.id } });
    res.json(progresos);
  } catch (error) {
    manejarError(res, error, 'Error al obtener el progreso');
  }
});

router.post('/:id', async (req, res) => {
  try {
    const nuevoProgreso = await Progreso.create({ 
      ...req.body, 
      habitoId: req.params.id 
    });
    res.status(201).json(nuevoProgreso);
  } catch (error) {
    manejarError(res, error, 'Error al registrar el progreso');
  }
});


router.get('/usuario/:idUsuario', async (req, res) => {
  try {
    const { idUsuario } = req.params;

    const progresos = await Progreso.findAll({
      include: [
        {
          model: Habito,
          as: 'habito',
          where: { usuarioId: idUsuario },
          attributes: ['nombre'],
        },
      ],
    });

    res.json(progresos);
  } catch (error) {
    manejarError(res, error, 'Error al obtener los progresos de los hábitos del usuario');
  }
});

module.exports = router;
