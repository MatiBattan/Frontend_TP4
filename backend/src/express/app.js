const express = require('express');
const cors = require('cors'); // Importa cors
const { sequelize } = require('../sequelize');
const authenticateToken = require('./middlewares/authenticateToken');

const app = express();

// Configura CORS para permitir solicitudes desde cualquier origen
app.use(cors()); 

// O configura CORS con opciones específicas
// app.use(cors({
//   origin: 'http://localhost:3000', // Cambia esto al dominio de tu frontend
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true,
// }));

app.use(express.json());

const usuarioRoutes = require('./routes/usuarios');
const habitoRoutes = require('./routes/habitos');
const progresoRoutes = require('./routes/progresos');

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/habitos', authenticateToken, habitoRoutes);
app.use('/api/progresos', authenticateToken, progresoRoutes);

app.use((req, res, next) => {
  res.status(404).send("Ruta no encontrada");
});

module.exports = app;
