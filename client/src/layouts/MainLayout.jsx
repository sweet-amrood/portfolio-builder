import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppNavbar from '../components/AppNavbar';
import AppFooter from '../components/AppFooter';
import FloatingMessenger from '../components/messaging/FloatingMessenger';

export default function MainLayout() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const isBuilder = pathname === '/builder';
  const isSavedTemplateView = /^\/my-templates\/[^/]+$/.test(pathname);
  const isTemplatePreview = /^\/templates\/[^/]+\/preview$/.test(pathname);
  const isImmersive = isBuilder || isTemplatePreview || isSavedTemplateView;

  return (
    <div className={`app-shell${isImmersive ? ' app-shell--builder' : ''}`}>
      {!isTemplatePreview && !isSavedTemplateView && <AppNavbar />}
      <main className="app-main">
        <Outlet />
      </main>
      {!isImmersive && <AppFooter />}
      {user ? <FloatingMessenger /> : null}
    </div>
  );
}
