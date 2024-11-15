import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

function Estadisticas() {
  const { habitId } = useParams();
  const [progreso, setProgreso] = useState([]);
  const [intervalo, setIntervalo] = useState("Diario");

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/progresos/${habitId}`);
        const progressData = response.data.map(entry => ({
          fecha: new Date(entry.fecha),
          horas: entry.horas || 0
        }));
        setProgreso(procesarDatos(progressData, intervalo));
      } catch (error) {
        console.error('Error al obtener los datos de progreso:', error);
      }
    };
    fetchProgressData();
  }, [habitId, intervalo]);

  // Función para agrupar y promediar datos en función del intervalo
  const procesarDatos = (datos, intervalo) => {
    switch(intervalo) {
      case "Semanal":
        return agruparPorSemana(datos);
      case "Mensual":
        return agruparPorMes(datos);
      case "Anual":
        return agruparPorAnio(datos);
      default: // Diario
        return datos.map(entry => ({
          fecha: entry.fecha.toLocaleDateString(),
          horas: entry.horas
        }));
    }
  };

  // Función para agrupar por semanas
  const agruparPorSemana = (datos) => {
    const resultado = [];
    let semana = [];
    let inicioSemana = datos[0].fecha;

    datos.forEach((entry, index) => {
      semana.push(entry.horas);
      const finSemana = new Date(inicioSemana);
      finSemana.setDate(inicioSemana.getDate() + 6);

      if (entry.fecha > finSemana || index === datos.length - 1) {
        const promedioHoras = semana.reduce((a, b) => a + b, 0) / semana.length;
        resultado.push({
          fecha: `${inicioSemana.toLocaleDateString()} - ${finSemana.toLocaleDateString()}`,
          horas: promedioHoras
        });
        inicioSemana = entry.fecha;
        semana = [entry.horas];
      }
    });

    return resultado;
  };

  // Función para agrupar por meses
  const agruparPorMes = (datos) => {
    const resultado = [];
    let mesActual = datos[0].fecha.getMonth();
    let anioActual = datos[0].fecha.getFullYear();
    let horasMes = [];

    datos.forEach(entry => {
      if (entry.fecha.getMonth() === mesActual && entry.fecha.getFullYear() === anioActual) {
        horasMes.push(entry.horas);
      } else {
        const promedioHoras = horasMes.reduce((a, b) => a + b, 0) / horasMes.length;
        resultado.push({
          fecha: `${new Date(anioActual, mesActual).toLocaleString('default', { month: 'long', year: 'numeric' })}`,
          horas: promedioHoras
        });
        mesActual = entry.fecha.getMonth();
        anioActual = entry.fecha.getFullYear();
        horasMes = [entry.horas];
      }
    });

    // Último mes
    if (horasMes.length) {
      const promedioHoras = horasMes.reduce((a, b) => a + b, 0) / horasMes.length;
      resultado.push({
        fecha: `${new Date(anioActual, mesActual).toLocaleString('default', { month: 'long', year: 'numeric' })}`,
        horas: promedioHoras
      });
    }

    return resultado;
  };

  // Función para agrupar por años
  const agruparPorAnio = (datos) => {
    const resultado = [];
    let anioActual = datos[0].fecha.getFullYear();
    let horasAnio = [];

    datos.forEach(entry => {
      if (entry.fecha.getFullYear() === anioActual) {
        horasAnio.push(entry.horas);
      } else {
        const promedioHoras = horasAnio.reduce((a, b) => a + b, 0) / horasAnio.length;
        resultado.push({
          fecha: anioActual.toString(),
          horas: promedioHoras
        });
        anioActual = entry.fecha.getFullYear();
        horasAnio = [entry.horas];
      }
    });

    // Último año
    if (horasAnio.length) {
      const promedioHoras = horasAnio.reduce((a, b) => a + b, 0) / horasAnio.length;
      resultado.push({
        fecha: anioActual.toString(),
        horas: promedioHoras
      });
    }

    return resultado;
  };

  return (
    <div>
      <h2>Estadísticas de Progreso</h2>
      <select value={intervalo} onChange={(e) => setIntervalo(e.target.value)}>
        <option value="Diario">Diario</option>
        <option value="Semanal">Semanal</option>
        <option value="Mensual">Mensual</option>
        <option value="Anual">Anual</option>
      </select>
      <BarChart width={600} height={300} data={progreso}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="fecha" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="horas" fill="#82ca9d" />
      </BarChart>
    </div>
  );
}

export default Estadisticas;
