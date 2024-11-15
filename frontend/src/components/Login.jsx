import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Importar Link

function Login() {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/usuarios/login', { email, contraseña });
      localStorage.setItem('token', response.data.token);
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email" 
        required 
      />
      <input 
        type="password" 
        value={contraseña} 
        onChange={(e) => setContraseña(e.target.value)} 
        placeholder="Contraseña" 
        required 
      />
      <button type="submit">Iniciar sesión</button>

      {/* Agregado mensaje para redirigir a la página de registro */}
      <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
    </form>
  );
}

export default Login;
