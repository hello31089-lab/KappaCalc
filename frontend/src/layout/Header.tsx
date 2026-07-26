import { Link} from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">

        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Главная</Link>
          <Link to="/events" className="nav-link">События</Link>
          <Link to="/profile" className="nav-link">Профиль</Link>
        </nav>
      </div>
    </header>
  );
}