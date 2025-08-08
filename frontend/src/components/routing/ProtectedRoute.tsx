import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface RouteProps {
  children: React.ReactNode;
}

// Styled loading component
const LoadingSpinner = () => (
  <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
    <div className="flex flex-col items-center space-y-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black dark:border-gray-700 dark:border-t-white" />
      <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
        Loading...
      </p>
    </div>
  </div>
);

// Enhanced Protected Route with styled loading state
export const ProtectedRoute = ({ children }: RouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
        <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
          <p className="text-center text-gray-700 dark:text-gray-300">
            Please log in to access this page
          </p>
          <Navigate to="/login" replace />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Enhanced Public Route with transition
export const PublicRoute = ({ children }: RouteProps) => {
  const { user } = useAuth();

  if (user) {
    return (
      <div className="transition-opacity duration-300 ease-in-out">
        <Navigate to="/dashboard" replace />
      </div>
    );
  }

  return <>{children}</>;
};