import { NavLink } from 'react-router-dom';

export const AppNavbar = () => {
  return (
    <nav className="navbar navbar-expand navbar-dark">
      <div className="container-fluid px-0">
        <span className="navbar-brand ms-3">
          <i className="bi bi-cash-stack me-1"></i>Caisse
        </span>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
                to="/"
                end
              >
                <i className="bi bi-grid me-1"></i>Articles
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
                to="/prices"
              >
                <i className="bi bi-tag me-1"></i>Prix
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
                to="/parameters"
              >
                <i className="bi bi-gear me-1"></i>Paramètres
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
