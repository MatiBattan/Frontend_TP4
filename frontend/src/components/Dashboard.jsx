import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HabitList from './HabitList';
import HabitForm from './HabitForm';

function Dashboard() {
  const [habits, setHabits] = useState([]);
  const navigate = useNavigate();

  const fetchHabits = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/habitos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data && response.data.habitos) {
        setHabits(response.data.habitos);
      }
    } catch (error) {
      console.error("Error al obtener los hábitos:", error);
    }
  };

  const deleteHabit = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/habitos/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Actualiza el estado después de eliminar
      setHabits(habits.filter(habit => habit.id !== id));
    } catch (error) {
      console.error("Error al eliminar el hábito:", error);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  return (
    <div>
      <h1>Hábitos</h1>
      <button onClick={() => navigate('/historial')}>Ver Historial de Hábitos</button>
      <HabitForm setHabits={setHabits} />
      <HabitList habits={habits} setHabits={setHabits} deleteHabit={deleteHabit} />
    </div>
  );
}

export default Dashboard;
