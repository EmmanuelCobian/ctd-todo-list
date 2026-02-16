import { NavLink } from 'react-router';
import styles from './Header.module.css';

function Header({ title }) {
  return (
    <div>
      <nav className={styles.navbar}>
        <div className={styles.navCenter}>
          <h1 className={styles.header}>{title}</h1>
        </div>
        <div className={styles.navRight}>
          <NavLink
            to={'/'}
            className={({ isActive }) => {
              return isActive ? styles.active : styles.inactive;
            }}
          >
            Home
          </NavLink>
          <NavLink
            to={'/about'}
            className={({ isActive }) => {
              return isActive ? styles.active : styles.inactive;
            }}
          >
            About
          </NavLink>
        </div>
      </nav>
    </div>
  );
}

export default Header;
