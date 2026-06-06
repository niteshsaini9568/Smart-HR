import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/landing/LandingPage';
import AdminDashboard from './components/dashboards/AdminDashboard';
import HRManagerDashboard from './components/dashboards/HRManagerDashboard';
import ManagerDashboard from './components/dashboards/ManagerDashboard';
import EmployeeDashboard from './components/dashboards/EmployeeDashboard';
import AIInterviewPage from './components/interviews/AIInterviewPage';
import ResetPasswordPage from './components/auth/ResetPasswordPage';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import OAuthCallback from './components/auth/OAuthCallback';
import JobOpportunitiesPage from './components/jobs/JobOpportunitiesPage';
import JobOpportunityDetailPage from './components/jobs/JobOpportunityDetailPage';
import { Toaster } from './components/ui/sonner';
import { Toaster as HotToaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import LoadingScreen from './components/shared/LoadingScreen';

function cleanupStaleDialogOverlays() {
  document.body.style.removeProperty('overflow');
  document.body.style.removeProperty('padding-right');
  document.body.style.removeProperty('pointer-events');
  document.body.removeAttribute('data-scroll-locked');
  document.querySelectorAll('[data-slot="dialog-overlay"]').forEach((el) => el.remove());
}

function AppContent() {
  const { user, isAuthenticated, isInitializing } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      cleanupStaleDialogOverlays();
    }
  }, [isAuthenticated]);

  const renderDashboard = () => {
    if (!user || !user.role) return <AdminDashboard user={user} />;

    const userWithAvatar = {
      ...user,
      name: `${user.firstName} ${user.lastName}`,
      avatar: user.avatar
        ? `${user.avatar}${user.avatar.includes('?') ? '&' : '?'}t=${user.updatedAt || Date.now()}`
        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}`,
    };

    const role = user.role.toLowerCase();

    switch (role) {
      case 'admin':
        return <AdminDashboard user={userWithAvatar} />;
      case 'hr_recruiter':
      case 'hr-manager':
      case 'hr':
        return <HRManagerDashboard user={userWithAvatar} />;
      case 'manager':
        return <ManagerDashboard user={userWithAvatar} />;
      case 'employee':
        return <EmployeeDashboard user={userWithAvatar} />;
      default:
        return <EmployeeDashboard user={userWithAvatar} />;
    }
  };

  if (isInitializing) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <HotToaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'hsl(240 12% 7%)',
            color: 'hsl(210 40% 98%)',
            borderRadius: '0.625rem',
            fontSize: '0.875rem',
          },
          success: {
            duration: 3000,
            iconTheme: { primary: 'hsl(217 91% 55%)', secondary: '#fff' },
          },
          error: {
            duration: 4000,
            iconTheme: { primary: 'hsl(0 72% 51%)', secondary: '#fff' },
          },
        }}
      />

      <Routes>
        <Route path="/ai-interview/:link" element={<AIInterviewPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/auth/oauth-callback" element={<OAuthCallback />} />
        <Route path="/opportunities/:jobId" element={<JobOpportunityDetailPage />} />
        <Route path="/opportunities" element={<JobOpportunitiesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={isAuthenticated ? renderDashboard() : <LandingPage />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
