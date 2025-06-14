
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ThemeProvider as CustomThemeProvider } from '@/contexts/ThemeContext';
import { useTheme as useCustomTheme } from '@/contexts/ThemeContext';
import CourseLandingPublicPage from './pages/CourseLandingPublicPage';
import { AuthContextProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import ModuleDetailsPage from './pages/ModuleDetailsPage';
import { SubscriptionDashboard } from './components/subscription/SubscriptionDashboard';
import { SubscriptionSuccessPage } from './pages/SubscriptionSuccessPage';
import StripeConfigPage from './pages/StripeConfigPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { isDarkMode } = useCustomTheme();

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#2563EB',
      },
      secondary: {
        main: '#7C3AED',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/course/:courseId" element={<CourseDetailsPage />} />
            <Route path="/course/:courseId/module/:moduleId" element={<ModuleDetailsPage />} />
            <Route path="/landing/:courseId" element={<CourseLandingPublicPage />} />
            <Route path="/subscription" element={<SubscriptionDashboard />} />
            <Route path="/subscription/success" element={<SubscriptionSuccessPage />} />
            <Route path="/admin/stripe" element={<StripeConfigPage />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <CustomThemeProvider>
          <AppContent />
        </CustomThemeProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;
