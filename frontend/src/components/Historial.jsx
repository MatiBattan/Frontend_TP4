import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Historial() {
  const [deletedHabits, setDeletedHabits] = useState([]);

  useEffect(() => {
    const fetchDeletedHabits = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/habitos/historial', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDeletedHabits(response.data);
      } catch (error) {
        console.error("Error al obtener el historial de hábitos eliminados:", error);
      }
    };

    fetchDeletedHabits();
  }, []);

  const restoreHabit = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/api/habitos/restaurar/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Actualiza el estado eliminando el hábito restaurado del historial
      setDeletedHabits(deletedHabits.filter(h => h.id !== id));
    } catch (error) {
      console.error("Error al restaurar el hábito:", error);
    }
  };

  const deleteHabitPermanently = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/habitos/eliminar-permanente/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Actualiza el estado eliminando el hábito definitivamente
      setDeletedHabits(deletedHabits.filter(h => h.id !== id));
    } catch (error) {
      console.error("Error al eliminar el hábito permanentemente:", error);
    }
  };

  return (
    <div>
      <h2>Historial de Hábitos Eliminados</h2>
      {deletedHabits.length === 0 ? (
        <p>No hay hábitos eliminados para mostrar.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Fecha de Creación</th>
              <th>Fecha de Eliminación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {deletedHabits.map((habito) => (
              <tr key={habito.id}>
                <td>{habito.nombre}</td>
                <td>{habito.descripcion}</td>
                <td>{new Date(habito.fechaCreacion).toLocaleDateString()}</td>
                <td>{new Date(habito.fechaEliminacion).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => restoreHabit(habito.id)}>Restaurar</button>
                  <button onClick={() => deleteHabitPermanently(habito.id)}>Eliminar Definitivamente</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Historial;
