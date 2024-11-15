const express = require('express');
const router = express.Router();
const { Habito } = require('../../sequelize');
const { manejarError } = require('../helpers');

router.get('/', async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const usuarioId = req.user.id;
    const habitos = await Habito.findAll({ where: { usuarioId, eliminado: false } });

    if (habitos.length === 0) {
      return res.json({ message: 'No hay hábitos para este usuario', habitos: [] });
    }

    // Verificar si se necesita notificación
    const fechaHoy = new Date();
    habitos.forEach(habito => {
      if (habito.notificaciones) {
        const fechaCreacion = new Date(habito.fechaCreacion);
        let mostrarAlerta = false;

        switch (habito.frecuencia) {
          case 'diario':
            mostrarAlerta = fechaHoy.getDate() !== fechaCreacion.getDate();
            break;
          case 'semanal':
            mostrarAlerta = fechaHoy - fechaCreacion >= 7 * 24 * 60 * 60 * 1000;
            break;
          case 'mensual':
            mostrarAlerta = fechaHoy.getMonth() !== fechaCreacion.getMonth();
            break;
          case 'anual':
            mostrarAlerta = fechaHoy.getFullYear() !== fechaCreacion.getFullYear();
            break;
        }

        habito.setDataValue('mostrarAlerta', mostrarAlerta);
      }
    });

    res.json(habitos);
  } catch (error) {
    manejarError(res, error, 'Error al obtener los hábitos');
  }
});




router.post('/', async (req, res) => {
  try {
    const usuarioId = req.user ? req.user.id : 1;
    const nuevoHabito = await Habito.create({ ...req.body, usuarioId });
    res.status(201).json(nuevoHabito);
  } catch (error) {
    manejarError(res, error, 'Error al crear el hábito');
  }
});

router.put('/:id', async (req, res) => {
  try {
    const habito = await Habito.findByPk(req.params.id);
    if (habito) {
      await habito.update(req.body);
      res.json(habito);
    } else {
      res.status(404).json({ error: 'Hábito no encontrado' });
    }
  } catch (error) {
    manejarError(res, error, 'Error al actualizar el hábito');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const habito = await Habito.findByPk(req.params.id);
    if (!habito) {
      return res.status(404).json({ error: 'Hábito no encontrado' });
    }

    // Marcar el hábito como eliminado en lugar de eliminarlo de la base de datos
    habito.eliminado = true;
    habito.fechaEliminacion = new Date();
    await habito.save();

    res.json({ mensaje: 'Hábito marcado como eliminado' });
  } catch (error) {
    manejarError(res, error, 'Error al eliminar el hábito');
  }
});

router.delete('/eliminar-permanente/:id', async (req, res) => {
  try {
    const habito = await Habito.findByPk(req.params.id);
    if (!habito) {
      return res.status(404).json({ error: 'Hábito no encontrado' });
    }

    // Eliminar de la base de datos en lugar de solo marcarlo
    await habito.destroy();
    res.json({ mensaje: 'Hábito eliminado permanentemente' });
  } catch (error) {
    manejarError(res, error, 'Error al eliminar permanentemente el hábito');
  }
});


router.get('/historial', async (req, res) => {
  try {
    const habitosEliminados = await Habito.findAll({
    where: { eliminado: true },
    attributes: ['id', 'nombre', 'descripcion', 'fechaCreacion', 'fechaEliminacion'],
    });
    res.json(habitosEliminados);
  } catch (error) {
    manejarError(res, error, 'Error al obtener el historial de hábitos eliminados');
  }
  });

  router.put('/restaurar/:id', async (req, res) => {
  try {
    const habito = await Habito.findByPk(req.params.id);
    if (!habito || !habito.eliminado) {
    return res.status(404).json({ error: 'Hábito no encontrado o no está eliminado' });
    }
  
    // Restaurar el hábito
    habito.eliminado = false;
    habito.fechaEliminacion = null;
    await habito.save();
  
    res.json({ mensaje: 'Hábito restaurado exitosamente' });
  } catch (error) {
    manejarError(res, error, 'Error al restaurar el hábito');
  }
  });


module.exports = router;
