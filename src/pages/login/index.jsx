import React, { useState } from 'react'; 
import './LoginForm.css'; 
import logo from '../../assets/logo-softcoinp.jpg'; 
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
   
    e.preventDefault();

    if (!username.includes('@')) {
      setError('Por favor, introduce una dirección de correo electrónico válida.');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, {
        name:name,
        email:username,
        password:password
      });

      // Manejar la respuesta del backend
      if(response.data.user){
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
        navigate('/menu');
      } else{
        alert(response.message);
      }

      // Aquí puedes redirigir al usuario o hacer cualquier otra acción basada en la respuesta del servidor
       
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Usuario o contraseña incorrectos.'); // Manejar errores de autenticación
    }
  };

  return (
    <div className="login-container">
      <div className="centrado"> 
        <img src={logo} alt="imagen logo softcoinp" width="250" height="250" /> 
      </div>
      <form onSubmit={handleSubmit}> 
        <div className="form-group"> 
          <label htmlFor="username">Correo electronio:</label> 
          <input 
            type="text" 
            id="username" 
            name="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          /> 
        </div>
        <div className="form-group"> 
          <label htmlFor="password">Contraseña:</label> 
          <input 
            type="password" 
            id="password" 
            name="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          /> 
        </div>
        {error && <div className="error">{error}</div>} 
        <div className="form-group"> 
          <input type="submit" value="Iniciar Sesión" /> 
        </div>
        <div className="form-group"> 
          <a href="/recuperar-contrasena">¿Olvidaste tu contraseña?</a><br></br>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
