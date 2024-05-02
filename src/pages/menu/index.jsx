import React, { useState, useEffect } from 'react'; // Importamos React y los hooks useState y useEffect
import './MainMenu.css'; // Importamos los estilos CSS si los tienes
import { useNavigate } from 'react-router-dom';
import Dropzone from 'react-dropzone'; // Importamos Dropzone para manejar la carga de archivos
import logo from '../../assets/logo_davo.jpg'; // Importamos el logo desde la carpeta de activos
import axios from 'axios';

function MainMenu() {

    const [identificationError, setIdentificationError] = useState('');
    const [statusButton, setstatusButton] = useState(true);
    const [id, setId] = useState('');
    const [identification, setIdentification] = useState('');
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [typePerson, setTypePerson] = useState('');
    const [job, setJob] = useState('');
    const [destination, setDestination] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [reason, setReason] = useState('');
    const [motivo, setMotivo] = useState('');
    const [idPuerta, setIdPuerta] = useState('');
    const [error, setError] = useState('');
    const [access, setAccess] = useState(null);
    const navigate = useNavigate();

    // Definimos el estado para la fecha y hora actual
    const [dateTime, setDateTime] = useState(new Date());
    // Definimos el estado para los archivos seleccionados
    const [files, setFiles] = useState([]);
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('user_data')));
    const [userType, setuserType] = useState(userData.type_users_id);


    // useEffect para actualizar la fecha y hora cada segundo
    useEffect(() => {
        const intervalId = setInterval(() => {
            setDateTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    // Función para manejar la caída de archivos en Dropzone
    const handleDrop = (acceptedFiles) => {
        setFiles(acceptedFiles);
    };

    // Función para manejar cambios en el campo de identificación
    const handleIdentificationChange = (e) => {
        const inputValue = e.target.value;
        setIdentification(inputValue); // Actualizar el estado de identificación

        // Validar si la entrada contiene solo números
        if (!/^\d*$/.test(inputValue)) {
            setIdentificationError('Por favor, ingresa solo números.');
        } else {
            setIdentificationError(''); // Limpiar el mensaje de error si la entrada es válida
        }
    };

    const searchPerson = async () => {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/search_person`, {
            identification: identification,
        });

        if (response.data.person) {
            setstatusButton(false);
            const personData = response.data.person;
            setId(personData.id);
            setName(personData.name);
            setLastname(personData.lastname);
            setTypePerson(personData.type_person_id);
            setJob(personData.job);
            setAddress(personData.address);
            setPhone(personData.phone);
            setEmail(personData.email);
            setAccess(response.data.access);
            
        } else {
            setstatusButton(true);
            setId('');
            setName('');
            setLastname('');
            setTypePerson('');
            setJob('');
            setAddress('');
            setPhone('');
            setEmail('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.includes('@')) {
            setError('Por favor, introduce una dirección de correo electrónico válida.');
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/register_person`, {
                id: id,
                identification: identification,
                name: name,
                lastname: lastname,
                type_person_id: typePerson,
                job: job,
                destination: destination,
                address: address,
                phone: phone,
                email: email,
                reason: reason

            });

            if (response.data.person) {
                const personData = response.data.person;
                setId(personData.id);
            } else {
                alert(response.message);
            }
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            setError('Hubo un problema al registrar el usuario.');
        }
    };

    const deletePerson = async () => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/delete_person/${identification}`);
            if (response.data.success) {
                setIdentification('');
                setName('');
                setLastname('');
                setTypePerson('');
                setJob('');
                setDestination('');
                setAddress('');
                setPhone('');
                setEmail('');
                setReason('');
                setstatusButton(true);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error al borrar datos:', error);
            setError('Hubo un problema al borrar los datos.');
        }
    };

    const handlerRegisterAccess = async () => {


        if(!access || access.status == 0){

            var errorMessage = '';
            if(reason == ''){
                errorMessage += 'Razon Obligatoria\n';
            }
            if(destination == ''){
                errorMessage += 'Destino Obligatoria\n';
            }

            if(errorMessage != ''){
                alert(errorMessage);
                return;
            }
        }

      
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/entrada`, {
                reason: reason,
                destination: destination,
                person_id: id,
                access: access
            });
            if (response.data.message) {
                setIdentification('');
                setName('');
                setLastname('');
                setTypePerson('');
                setJob('');
                setDestination('');
                setAddress('');
                setPhone('');
                setEmail('');
                setReason('');
                setMotivo('');
                setIdPuerta('');
                setId('');
                setstatusButton(true);
                alert(response.data.message);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error al registar el acceso:', error);
            //setError('Hubo un problema al registrar el acceso.');
        }
    };

    return (
        // Contenedor principal del menú
        <React.Fragment>
            <div className="mm-container">
                {/* Columna izquierda del menú */}
                <div className="mm-column">
                    <input type="text" id="identification" value={identification} onChange={handleIdentificationChange} required />
                    {identificationError && <span style={{ color: '#FFA500', fontWeight: 'bold' }}>{identificationError}</span>}
                    <button type="button" className="mm-button" onClick={searchPerson}>Buscar</button>

                    <br />
                    <h2>Datos de ingreso</h2>
                    {/* Formulario para ingresar datos */}
                    <form onSubmit={handleSubmit}>
                        <div className="mm-form-group">
                            {/* Campos para ingresar datos personales */}
                            <label htmlFor="name">Nombre:</label>
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />

                            <label htmlFor="lastname">Apellido:</label>
                            <input type="text" id="lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} required />

                            <label htmlFor="job">Cargo u Oficio:</label>
                            <input type="text" id="job" value={job} onChange={(e) => setJob(e.target.value)} required />

                            <label htmlFor="address">Direccion:</label>
                            <input type="text" id="name" value={address} onChange={(e) => setAddress(e.target.value)} required />

                            <label htmlFor="phone">Telefono:</label>
                            <input type="text" id="name" value={phone} onChange={(e) => setPhone(e.target.value)} required />

                            <label htmlFor="email">Correo Electronico:</label>
                            <input type="text" id="name" value={email} onChange={(e) => setEmail(e.target.value)} required />

                            <label htmlFor="type_person">Tipo de persona:   </label>
                            <br />
                            <select id="type_person" value={typePerson} onChange={(e) => setTypePerson(e.target.value)} required>
                                <option value="">Selecciona un tipo de persona</option>
                                <option value="1">Empleado</option>
                                <option value="2">Proveedor</option>
                                <option value="3">Visitante</option>
                            </select><br /><br />

                            <button type="submit" className="mm-button">{id ? 'Editar' : 'Guardar'} Datos</button>
                            {userType == 1 && !statusButton && (
                                <button type="button" className="mm-button delete-button" onClick={deletePerson}>Borrar Persona</button>)}
                            </div>
                            </form>
                            <hr />

                            <label htmlFor="destination"style={{ color: 'white' }}>Destino:</label>
                            <input type="text" id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} required />

                            <label htmlFor="reason"style={{ color: 'white' }}>Motivo:</label>
                            <textarea id="reason" name="reason" rows="5" cols="55" value={reason} onChange={(e) => setReason(e.target.value)} required />
                        
                    
                </div>

                {/* Columna derecha del menú */}
                <div className="mm-column-2">
                    <div className="mm-container-2">
                        {/* Subcolumna izquierda */}
                        <div className="mm-sub-column">
                            {/* Botones de entrada y salida */}
                            <button type="button" className="mm-button-2" onClick={handlerRegisterAccess}>ENTRADA/SALIDA</button><br></br><br></br>
                            {/*<button type="button" className="mm-button-2">Salida  </button>*/}
                        </div>

                        {/* Subcolumna central */}
                        <div className="mm-sub-column">
                            {/* Componente Dropzone para cargar archivos 
                            <Dropzone onDrop={handleDrop}>
                                {({ getRootProps, getInputProps }) => (
                                    <div {...getRootProps()} className="mm-sub-column">
                                        <input {...getInputProps()} id="type_file_hidden" style={{ display: 'none' }} />
                                        <button type="mm-button" className="mm-button-3" id="foto-perfil">Foto De Perfil</button>
                                    </div>
                                )}
                            </Dropzone>*/}
                            {/* Mostrar imágenes seleccionadas */}
                            <div>
                                {files.map(file => (
                                    <img key={file.name} src={URL.createObjectURL(file)} alt={file.name} />
                                ))}
                            </div>
                        </div>

                        <div className="mm-sub-column">
                            <img src={logo} alt="logo de marca" width="135" height="160" style={{ borderRadius: '10px' }} />
                        </div>
                    </div>

                    {/* Contenedor para mostrar la fecha y hora */}
                    <div className="mm-container-3" style={{ flexDirection: 'mm-column' }}>
                        <h2>Fecha y hora de ingreso</h2>
                        <div id="reloj" style={{ color: 'orange' }}>{dateTime.toLocaleString()}</div>
                    </div>


                    {/* Contenedor para los botones de crear reportes */}

                    <div className="mm-container-4">

                        <div className="mm-sub-column">
                            <a href="/Registro-entradas" className="link3">Registro de entradas</a>
                        </div>
                    </div>



                    {userType == 1 && (
                        <div className="mm-container-5">

                            <div className="mm-sub-column">
                                <a href="/personal-registrado" className="link3">Personal registrado</a>
                            </div>
                        </div>
                    )}

                    {userType == 1 && (
                        <div className="form-group">
                            <h1>Usuario Administrador<br></br>{userData.name}</h1>
                            <a href="/registrar-usuario" className="link1">Opciones de Usuario</a>
                        </div>
                    )}

                    {userType == 2 && (
                        <h1>Usuario Operador<br></br>{userData.name}</h1>)}
                </div>
            </div>
        </React.Fragment>
    );
}

export default MainMenu; // Exportamos el componente MainMenu
