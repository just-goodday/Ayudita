import { Link } from "react-router-dom";
import styles from "../styles/Sidebar.module.css";

const Sidebar = () => {
    return (
        <aside className={styles.sidebar}>
            <h3 className={styles.title}>Bienvenido</h3>
            <nav className={styles.nav}>
                <Link to="/dashboard/alumnos" className={styles.link}>Gestión de Alumnos</Link>
                <Link to="/dashboard/idiomas" className={styles.link}>Gestión de Idiomas</Link>
            </nav>
        </aside>
    );
};

export default Sidebar;
