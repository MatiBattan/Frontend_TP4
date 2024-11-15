import React, { useState } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (contraseña !== confirmarContraseña) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      const newUser = { nombre, email, contraseña };
      const response = await axios.post('http://localhost:8080/api/usuarios/register', newUser);

      if (response.status === 201) {
        alert('Usuario registrado con éxito');
        navigate('/');
      }
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      alert('Error al registrar el usuario');
    }
  };

  // Manejador para el botón de regresar al login
  const handleGoToLogin = () => {
    navigate('/');
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Registrar Usuario</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={contraseña}
        onChange={(e) => setContraseña(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirmar Contraseña"
        value={confirmarContraseña}
        onChange={(e) => setConfirmarContraseña(e.target.value)}
        required
      />
      <button type="submit">Registrar</button>
      <button type="button" onClick={handleGoToLogin}>Volver</button>
    </form>
  );
}

export default Register;
