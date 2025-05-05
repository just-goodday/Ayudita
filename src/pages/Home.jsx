import { useNavigate } from "react-router-dom";
import styles from "../styles/Home.module.css";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div>
            {/* Navbar */}
            <nav className={styles.navbar}>
                <h2 className={styles.title}>Colegio Sideral</h2>
                <button 
                    onClick={() => navigate('/login')} 
                    className={styles.button}
                >
                    Iniciar sesión
                </button>
            </nav>

            {/* Contenido principal */}
            <main className={styles.main}>
                <h1>Bienvenido al Colegio Sideral</h1>
                <p>Desaprende para aprender, UTP tu mejor opción 🫵.</p>
            </main>
        </div>
    );
}
