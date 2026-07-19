import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiBars3, HiXMark } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './messaging/NotificationBell';
import BrandLogo from './BrandLogo';
import toast from 'react-hot-toast';

const links = [
  { to: '/home', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/templates', label: 'Templates' },
  { to: '/my-templates', label: 'My Work' },
];

export default function AppNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="app-nav">
      <BrandLogo to="/home" className="brand-logo--nav" />

      <div className="nav-links nav-links--desktop">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      <motion.div
        className="nav-user"
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <NotificationBell />
        {user?.avatar ? <img src={user.avatar} alt="" className="user-avatar" /> : null}
        <span className="user-name">{user?.name || user?.email}</span>
        <NavLink to="/profile" className="nav-profile-link" aria-label="Profile">
          Profile
        </NavLink>
        <button type="button" onClick={handleLogout} className="btn-ghost">
          Logout
        </button>
        <button
          type="button"
          className="nav-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <HiXMark size={22} /> : <HiBars3 size={22} />}
        </button>
      </motion.div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className="nav-mobile-panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `nav-mobile-link${isActive ? ' nav-mobile-link--active' : ''}`}
                onClick={closeMenu}
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink to="/profile" className="nav-mobile-link" onClick={closeMenu}>
              Profile
            </NavLink>
            <NavLink to="/contact" className="nav-mobile-link" onClick={closeMenu}>
              Contact
            </NavLink>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </nav>
  );
}
