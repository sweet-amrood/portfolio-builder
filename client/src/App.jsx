import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { MessagingProvider } from './context/MessagingContext';
import { AnalyticsProvider } from './context/AnalyticsContext';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import ProtectedLayout from './components/ProtectedLayout';
import { PublicRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import Templates from './pages/Templates';
import TemplatePreview from './pages/TemplatePreview';
import MyTemplates from './pages/MyTemplates';
import SavedTemplateView from './pages/SavedTemplateView';
import Contact from './pages/Contact';
import PortfolioBuilder from './pages/PortfolioBuilder';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import AnalyticsPage from './pages/AnalyticsPage';
import AiCreate from './pages/AiCreate';
import PublicPortfolio from './pages/PublicPortfolio';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <MessagingProvider>
        <AnalyticsProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                border: '1px solid #334155',
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route element={<AuthLayout />}>
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <Signup />
                  </PublicRoute>
                }
              />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>

            <Route element={<ProtectedLayout />}>
              <Route element={<MainLayout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/create" element={<AiCreate />} />
                <Route path="/templates/:templateId/preview" element={<TemplatePreview />} />
                <Route path="/my-templates" element={<MyTemplates />} />
                <Route path="/my-templates/:templateId" element={<SavedTemplateView />} />
                <Route path="/my-portfolio" element={<Navigate to="/my-templates" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/builder" element={<PortfolioBuilder />} />
              </Route>
            </Route>

            <Route path="/:slug" element={<PublicPortfolio />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
        </AnalyticsProvider>
        </MessagingProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
