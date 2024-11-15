import React, { useState } from 'react';
import axios from 'axios';

function HabitForm({ setHabits }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [frecuencia, setFrecuencia] = useState('diario'); // Valor inicial del desplegable
  const [notificaciones, setNotificaciones] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newHabit = {
        nombre,
        descripcion,
        frecuencia,
        notificaciones,
      };
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8080/api/habitos', newHabit, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabits((prev) => [...prev, response.data]);
      setNombre('');
      setDescripcion('');
      setFrecuencia('diario');
      setNotificaciones(false);
    } catch (error) {
      console.error('Error al agregar el hábito:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre del hábito"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        required
      />
      <select
        value={frecuencia}
        onChange={(e) => setFrecuencia(e.target.value)}
        required
      >
        <option value="diario">Diario</option>
        <option value="semanal">Semanal</option>
        <option value="mensual">Mensual</option>
        <option value="anual">Anual</option>
      </select>
      <label>
        Notificaciones
        <input
          type="checkbox"
          checked={notificaciones}
          onChange={(e) => setNotificaciones(e.target.checked)}
        />
      </label>
      <button type="submit">Agregar</button>
    </form>
  );
}

export default HabitForm;
