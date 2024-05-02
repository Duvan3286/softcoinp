import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ListUser.css'; 
import RegisterUser from './create';

function ListUser() {
    const [usuarios, setUsuarios] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [dataItem, setDataItem] = useState([]);


    useEffect(() => {
        const cargarUsuarios = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/usuarios`);
                setUsuarios(response.data);
            } catch (error) {
                console.error('Error al obtener usuarios:', error);
            }
        };

        cargarUsuarios();
    }, []);

    const handleOpenForm = (dataItem)=>{
        setOpenForm(true);
        setDataItem(dataItem);
    }

    const handleCloseForm = ()=>{
        setOpenForm(false);
    }

    const deleteUser = async (id) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/delete_user/${id}`);
            if (response.data.success) {
                
                console.log('Usuario eliminado correctamente');
                cargarUsuarios();
                
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error al borrar usuario:', error);
            alert('Usuario eliminado correctamente.');
            window.location.reload();
        }
    };
        
    



    return (
        <div className="list-user-container">
            <br />
            <h2 className="list-user-header">Lista de Usuarios</h2>
            <a onClick={() =>handleOpenForm([])} className="link2">Crear Nuevo Usuario</a>
            <table className="list-user-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Tipo de usuario</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map(usuario => (
                        <tr key={usuario.id}>
                            <td>{usuario.id}</td>
                            <td>{usuario.name}</td>
                            <td>{usuario.email}</td>
                            <td>{usuario.type_users_id === 1 ? 'Administrador' : 'Operador'}</td>
                            <td className="action-buttons">
                                <button className="delete" onClick={() => deleteUser(usuario.id)}>Eliminar</button><br></br><br></br>
                               
                                <button className="update" onClick={() => handleOpenForm(usuario)}>Actualizar</button>
                            
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {openForm && <RegisterUser onOpen={true} onClose={handleCloseForm} dataItem={dataItem} setOpenForm={setOpenForm} />}
        </div>
    );
}

export default ListUser;
