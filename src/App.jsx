import React from 'react'; // Importamos React
import LoginForm from './pages/login'; // Importamos el componente LoginForm desde la ruta proporcionada
import PasswordRecoveryForm from './pages/password'; // Importamos el componente PasswordRecoveryForm desde la ruta proporcionada
import MainMenu from './pages/menu'; // Importamos el componente MainMenu desde la ruta proporcionada
import { Routes, Route, BrowserRouter } from 'react-router-dom'; // Importamos las utilidades de enrutamiento de React Router
import RegisterUser from './pages/register_user/create';
import ListUser from './pages/register_user';
import PersonList from './pages/person_list';
import AccessList from './pages/access_list';

function App() {
  return (
    // Componente BrowserRouter para envolver las rutas
    <BrowserRouter>
      {/* Componente Routes para definir las rutas */}
      <Routes>
        {/* Ruta para la página de inicio de sesión, renderiza el componente LoginForm */}
        <Route path="/" element={<LoginForm />} />
        {/* Ruta para la página de recuperación de contraseña, renderiza el componente PasswordRecoveryForm */}
        <Route path="/recuperar-contrasena" element={<PasswordRecoveryForm />} />
        {/* Ruta para la página de menú, renderiza el componente MainMenu */}
        <Route path="/menu" element={<MainMenu />} />
        <Route path="/personal-registrado" element={<PersonList />} />
        <Route path="/Registro-entradas" element={<AccessList />} />
        <Route path="/registrar-usuario" element={<ListUser/>} />
        <Route path="/crear-usuario" element={<RegisterUser/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 
