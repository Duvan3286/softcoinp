import React, { useEffect, useState } from 'react';
import './register-user-form.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Modal, Typography } from '@mui/material';

function RegisterUser(props) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [id, setId] = useState('');
  const [typeUsers, setTypeUsers] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { dataItem, onClose, onOpen, setOpenForm } = props;

  useEffect(() => {
    setId(dataItem.id);
    setUsername(dataItem.name);
    setEmail(dataItem.email);
    setTypeUsers(dataItem.type_users_id);
  }, [dataItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let passwordError = '';

    // Validar la longitud de la contraseña
    if (password.length < 6) {
      passwordError = 'La contraseña debe tener al menos 6 caracteres.';
    }

    // Si hay un error en la contraseña, establecer el mensaje de error y detener el proceso
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/registro`, 
      {
        id: id,
        name: username,
        email: email,
        password: password,
        type_users: typeUsers
      });

      if (response.data.user) {
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
        if (response.data.redirect === 1) {
          navigate('/menu');
        } else {
          location.reload();
        }
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setError('Hubo un problema al registrar el usuario.');
    }
  };

  return (
    <>
      <Modal
        open={onOpen}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="register-user-form">
          <Box>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Registro de Usuario
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <form onSubmit={handleSubmit}>
                <div className="rs-form-group">
                  <label htmlFor="username">Nombre de Usuario:</label>
                  <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="rs-form-group">
                  <label htmlFor="email">Correo Electrónico:</label>
                  <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="rs-form-group">
                  <label htmlFor="password">Contraseña:</label>
                  <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>

                <div className="rs-form-group">
                  <label htmlFor="type_users">Tipo de usuario:   </label>
                  <select id="type_users" value={typeUsers} onChange={(e) => setTypeUsers(e.target.value)} required>
                    <option value="">Selecciona un tipo de usuario</option>
                    <option value="1">Administrador</option>
                    <option value="2">Operador</option>
                  </select><br></br>
                </div>
                <button type="submit" className="rs-button">Registrarse</button>
              </form>
              {error && <p className="error-message">{error}</p>}
            </Typography>
          </Box>
        </div>
      </Modal>
    </>
  );
}

export default RegisterUser;
