import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from '../styles/Login.module.css';

export default function Login() {
    const [usuario, setUsuario] = useState('');
    const [clave, setClave] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        if (usuario === 'admin' && clave === '1234') {
            navigate('/dashboard');
        } else {
            setError('Credenciales incorrectas');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h2 className={styles.title}>Iniciar Sesión</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="Usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                    /><br />
                    <input
                        type="password"
                        className={styles.input}
                        placeholder="Contraseña"
                        value={clave}
                        onChange={(e) => setClave(e.target.value)}
                    /><br />
                    {error && <p className={styles.error}>{error}</p>}
                    <button type="submit" className={styles.button}>Ingresar</button>
                </form>
            </div>
        </div>
    );
}
