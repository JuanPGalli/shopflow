import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './sideBarAdmin.module.css';
import {
  FaUsers,
  FaBox,
  /* FaLayerGroup, */
  FaChartBar,
  FaEnvelope,
  FaShoppingBag,
} from 'react-icons/fa';

const SideBarAdmin = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`${styles.sidebar} ${expanded ? styles.expanded : styles.collapsed}`}>
      <div className={styles.toggleButton} onClick={toggleSidebar}>
        {expanded ? <span>&larr;</span> : <span>&rarr;</span>}
      </div>
      <ul className={styles.menu}>
        <li>
          <NavLink
            to='/admin/dashboard'
            className={({ isActive }) => (isActive ? styles.selected : '')}
          >
            {expanded ? (
              <>
                <FaChartBar size={20} />
                <span id={styles.blanco}>Dashboard</span>
              </>
            ) : (
              <FaChartBar size={20} />
            )}
          </NavLink>
        </li>

        <li>
          <NavLink
            to='/admin/users'
            className={({ isActive }) => (isActive ? styles.selected : '')}
          >
            {expanded ? (
              <>
                <FaUsers size={20} />
                <span id={styles.blanco}>Usuarios</span>
              </>
            ) : (
              <FaUsers size={20} />
            )}
          </NavLink>
        </li>

        <li>
          <NavLink
            to='/admin/allbuys'
            className={({ isActive }) => (isActive ? styles.selected : '')}
          >
            {expanded ? (
              <>
                <FaShoppingBag size={20} />
                <span id={styles.blanco}>Ventas</span>
              </>
            ) : (
              <FaShoppingBag size={20} />
            )}
          </NavLink>
        </li>

        <li>
          <NavLink to='#' className={({ isActive }) => (isActive ? styles.selected : '')}>
            {expanded ? (
              <>
                <FaBox size={20} />
                <span id={styles.blanco}>Productos</span>
              </>
            ) : (
              <FaBox size={20} />
            )}
          </NavLink>
          <ul className={styles.submenu}>
            <li>
              <NavLink
                to='/admin/products/create'
                className={({ isActive }) => (isActive ? styles.selected : '')}
              >
                Crear producto
              </NavLink>
            </li>
            <li>
              <NavLink
                to='/admin/allProducts'
                className={({ isActive }) => (isActive ? styles.selected : '')}
              >
                Editar producto
              </NavLink>
            </li>
          </ul>
        </li>

        <li>
          <NavLink
            to='/admin/mailing'
            className={({ isActive }) => (isActive ? styles.selected : '')}
          >
            {expanded ? (
              <>
                <FaEnvelope size={20} />
                <span id={styles.blanco}>Mailing</span>
              </>
            ) : (
              <FaEnvelope size={20} />
            )}
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default SideBarAdmin;
