import React from 'react'; // Importamos React
import './PasswordRecoveryForm.css'; // Importamos los estilos CSS
import logo from '../../assets/logo-password.jpg'; // Importamos el logo desde la carpeta de activos

function PasswordRecoveryForm() {
  return (
    // Contenedor principal del formulario de recuperación de contraseña
    <div className="container">
      <img src={logo} alt="imagen icono contraseña" width="100" height="100" /> {/* Mostramos el logo */}
      <h1>¿Olvidaste tu contraseña?</h1> {/* Título del formulario */}
      <p>Introduce el email registrado.</p> {/* Instrucciones */}
      <p>En unos minutos recibirás en esa misma cuenta de correo un mail con una contraseña provisional.</p> {/* Instrucciones adicionales */}

      {/* Formulario para enviar el email de recuperación */}
      <form>
        <input type="text" name="email" placeholder="Escribe tu email" required /> {/* Campo de entrada para el email */}
        <button type="submit">Enviar email</button> {/* Botón para enviar el email */}
      </form>
    </div>
  );
}

export default PasswordRecoveryForm; // Exportamos el componente PasswordRecoveryForm
