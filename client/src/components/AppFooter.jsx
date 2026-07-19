import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';

export default function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="app-footer-inner">
        <div className="footer-brand">
          <BrandLogo to="/home" size="sm" />
          <p className="footer-tagline">Build portfolios that open doors.</p>
        </div>

        <div className="footer-columns">
          <div className="footer-col">
            <h4>Product</h4>
            <Link to="/templates">Templates</Link>
            <Link to="/builder">Builder</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <Link to="/home">Features</Link>
            <Link to="/my-templates">My Work</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-col">
            <h4>Account</h4>
            <Link to="/profile">Profile</Link>
            <Link to="/dashboard/analytics">Analytics</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Novafolio. All rights reserved.</p>
      </div>
    </footer>
  );
}
