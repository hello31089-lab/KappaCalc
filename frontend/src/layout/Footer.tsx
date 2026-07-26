import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">© {new Date().getFullYear()} Пет-проект Афиша. Все права защищены.</p>
        <div className="footer-links">
          <a href="#privacy" className="footer-link">Политика конфиденциальности</a>
          <a href="#contacts" className="footer-link">Контакты</a>
        </div>
      </div>
    </footer>
  );
}