import { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../services/Api';

const Alumnos = () => {
    const [alumnos, setAlumnos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [alumnoActual, setAlumnoActual] = useState(null);
    
    // Estado del formulario con validación inicial
    const [formulario, setFormulario] = useState({
        nombre: '',
        correo: '',
        telefono: '',
        idioma: ''
    });
    const [erroresFormulario, setErroresFormulario] = useState({});

    // Validar formulario
    const validarFormulario = () => {
        const nuevosErrores = {};
        if (!formulario.nombre.trim()) nuevosErrores.nombre = 'Nombre requerido';
        if (!formulario.correo.trim()) {
        nuevosErrores.correo = 'Correo requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.correo)) {
        nuevosErrores.correo = 'Correo inválido';
        }
        if (!formulario.telefono.trim()) nuevosErrores.telefono = 'Teléfono requerido';
        if (!formulario.idioma.trim()) nuevosErrores.idioma = 'Idioma requerido';
        
        setErroresFormulario(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    // Obtener alumnos con manejo de errores mejorado
    const obtenerAlumnos = async () => {
        try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(API_URL);
        
        // Verificar estructura de respuesta
        if (!data) throw new Error('La API no devolvió datos');
        
        // Manejar diferentes estructuras de respuesta
        const datosAlumnos = Array.isArray(data) 
            ? data 
            : data.results || data.data || data.alumnos || [];
        
        if (!Array.isArray(datosAlumnos)) {
            throw new Error('Formato de datos inválido');
        }
        
        setAlumnos(datosAlumnos);
        } catch (err) {
        const mensajeError = err.response?.data?.message || 
                            err.message || 
                            'Error al cargar alumnos';
        setError(mensajeError);
        setAlumnos([]); // Resetear a array vacío
        console.error('Error en obtenerAlumnos:', err);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        obtenerAlumnos();
    }, []);

    // Manejar cambios en el formulario con validación
    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setFormulario(prev => ({
        ...prev,
        [name]: value
        }));
        
        // Limpiar error al escribir
        if (erroresFormulario[name]) {
        setErroresFormulario(prev => ({
            ...prev,
            [name]: undefined
        }));
        }
    };

    // Enviar formulario con validación
    const manejarEnvio = async (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;
        
        try {
        setLoading(true);
        if (alumnoActual) {
            await axios.put(`${API_URL}${alumnoActual.id}/`, formulario);
        } else {
            await axios.post(API_URL, formulario);
        }
        setModalAbierto(false);
        await obtenerAlumnos(); 
        resetearFormulario();
        } catch (err) {
        const mensajeError = err.response?.data?.message || 
                            'Error al guardar alumno';
        setError(mensajeError);
        console.error('Error en manejarEnvio:', err);
        } finally {
        setLoading(false);
        }
    };

    // Eliminar alumno con confirmación
    const eliminarAlumno = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este alumno?")) return;
        
        try {
        setLoading(true);
        await axios.delete(`${API_URL}${id}/`);
        await obtenerAlumnos();
        } catch (err) {
        const mensajeError = err.response?.data?.message || 
                            'Error al eliminar alumno';
        setError(mensajeError);
        console.error('Error en eliminarAlumno:', err);
        } finally {
        setLoading(false);
        }
    };

    // Editar alumno
    const editarAlumno = (alumno) => {
        setAlumnoActual(alumno);
        setFormulario({
        nombre: alumno.nombre || '',
        correo: alumno.correo || '',
        telefono: alumno.telefono || '',
        idioma: alumno.idioma || ''
        });
        setModalAbierto(true);
    };

    // Resetear formulario
    const resetearFormulario = () => {
        setFormulario({
        nombre: '',
        correo: '',
        telefono: '',
        idioma: ''
        });
        setAlumnoActual(null);
        setErroresFormulario({});
    };

    return (
        <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Gestión de Alumnos</h1>
        
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            </div>
        )}

        <div className="flex justify-between items-center mb-4">
            <button 
            onClick={() => setModalAbierto(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
            + Agregar Alumno
            </button>
        </div>

        {loading ? (
            <div className="text-center py-8">Cargando alumnos...</div>
        ) : (
            <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                <tr>
                    <th className="py-2 px-4 border">ID</th>
                    <th className="py-2 px-4 border">Nombre</th>
                    <th className="py-2 px-4 border">Correo</th>
                    <th className="py-2 px-4 border">Teléfono</th>
                    <th className="py-2 px-4 border">Idioma</th>
                    <th className="py-2 px-4 border">Acciones</th>
                </tr>
                </thead>
                <tbody>
                {alumnos.length > 0 ? (
                    alumnos.map((alumno) => (
                    <tr key={alumno.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border">{alumno.id}</td>
                        <td className="py-2 px-4 border">{alumno.nombre}</td>
                        <td className="py-2 px-4 border">{alumno.correo}</td>
                        <td className="py-2 px-4 border">{alumno.telefono}</td>
                        <td className="py-2 px-4 border">{alumno.idioma}</td>
                        <td className="py-2 px-4 border space-x-2">
                        <button
                            onClick={() => editarAlumno(alumno)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
                        >
                            Editar
                        </button>
                        <button
                            onClick={() => eliminarAlumno(alumno.id)}
                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                        >
                            Eliminar
                        </button>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan="6" className="py-4 text-center text-gray-500">
                        No se encontraron alumnos
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
        )}

        {/* Modal */}
        {modalAbierto && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                <h2 className="text-xl font-bold mb-4">
                    {alumnoActual ? 'Editar Alumno' : 'Nuevo Alumno'}
                </h2>
                
                <form onSubmit={manejarEnvio}>
                    <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Nombre*</label>
                    <input
                        type="text"
                        name="nombre"
                        value={formulario.nombre}
                        onChange={manejarCambio}
                        className={`w-full p-2 border rounded ${erroresFormulario.nombre ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {erroresFormulario.nombre && (
                        <p className="text-red-500 text-sm mt-1">{erroresFormulario.nombre}</p>
                    )}
                    </div>
                    
                    <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Correo*</label>
                    <input
                        type="email"
                        name="correo"
                        value={formulario.correo}
                        onChange={manejarCambio}
                        className={`w-full p-2 border rounded ${erroresFormulario.correo ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {erroresFormulario.correo && (
                        <p className="text-red-500 text-sm mt-1">{erroresFormulario.correo}</p>
                    )}
                    </div>
                    
                    <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Teléfono*</label>
                    <input
                        type="tel"
                        name="telefono"
                        value={formulario.telefono}
                        onChange={manejarCambio}
                        className={`w-full p-2 border rounded ${erroresFormulario.telefono ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {erroresFormulario.telefono && (
                        <p className="text-red-500 text-sm mt-1">{erroresFormulario.telefono}</p>
                    )}
                    </div>
                    
                    <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Idioma*</label>
                    <input
                        type="text"
                        name="idioma"
                        value={formulario.idioma}
                        onChange={manejarCambio}
                        className={`w-full p-2 border rounded ${erroresFormulario.idioma ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {erroresFormulario.idioma && (
                        <p className="text-red-500 text-sm mt-1">{erroresFormulario.idioma}</p>
                    )}
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => {
                        setModalAbierto(false);
                        resetearFormulario();
                        }}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                    >
                        {loading ? 'Guardando...' : alumnoActual ? 'Actualizar' : 'Guardar'}
                    </button>
                    </div>
                </form>
                </div>
            </div>
            </div>
        )}
        </div>
    );
};

export default Alumnos;