import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import UserSidebar from "@/components/UserSidebar";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import CoursesPage from "@/pages/CoursesPage";
import LoginPage from "@/pages/LoginPage";
import MentorDashboardPage from "@/pages/MentorDashboardPage";
import CreateCoursePage from "@/pages/CreateCoursePage";
import EditCoursePage from "@/pages/EditCoursePage";
import MeusCursosPage from "@/pages/MeusCursosPage";
import MentorFollowersPage from "@/pages/MentorFollowersPage";
import NotFound from "@/pages/NotFound";
import { supabase } from "@/integrations/supabase/client";

// Import pages for mentorado and admin
import MentoradoDashboardPage from "@/pages/mentorado/DashboardPage";
import MentoradoCursosPage from "@/pages/mentorado/CursosPage";
import MentoradoMentoresPage from "@/pages/mentorado/MentoresPage";
import MentoradoCalendarioPage from "@/pages/mentorado/CalendarioPage";
import MentoradoConfiguracoesPage from "@/pages/mentorado/ConfiguracoesPage";

import AdminDashboardPage from "@/pages/admin/DashboardPage";
import AdminCursosPage from "@/pages/admin/CursosPage";
import AdminMentoresPage from "@/pages/admin/MentoresPage";
import AdminMentoradosPage from "@/pages/admin/MentoradosPage";
import AdminCalendarioPage from "@/pages/admin/CalendarioPage";
import AdminConfiguracoesPage from "@/pages/admin/ConfiguracoesPage";

const queryClient = new QueryClient();

// Protected Route component that redirects to login if not authenticated
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
      
      if (data.session) {
        // Fetch role from profiles table
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.session.user.id)
          .single();
          
        if (profileData) {
          setUserRole(profileData.role);
        }
      }
    };
    checkSession();
  }, []);

  // Show nothing during the initial check
  if (isLoggedIn === null) return null;
  
  if (!isLoggedIn) {
    // Redirect to login, but save the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If allowedRoles is specified, check if user has the right role
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    // User doesn't have the right role - redirect to appropriate dashboard
    if (userRole === 'mentor') {
      return <Navigate to="/mentor/dashboard" replace />;
    } else if (userRole === 'mentorado') {
      return <Navigate to="/mentorado/dashboard" replace />;
    } else if (userRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

// Layout component to use sidebar for protected routes
const ProtectedLayout = ({ children, role }: { children: React.ReactNode, role: string }) => {
  const allowedRoles = [role];
  
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <div className="flex">
        {children}
      </div>
    </ProtectedRoute>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <main className="flex-grow">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/login" element={<LoginPage />} />
              
              {/* Mentor protected routes */}
              <Route path="/mentor/dashboard" element={
                <ProtectedLayout role="mentor">
                  <MentorDashboardPage />
                </ProtectedLayout>
              } />
              <Route path="/mentor/cursos" element={
                <ProtectedLayout role="mentor">
                  <MeusCursosPage />
                </ProtectedLayout>
              } />
              <Route path="/mentor/cursos/novo" element={
                <ProtectedLayout role="mentor">
                  <CreateCoursePage />
                </ProtectedLayout>
              } />
              <Route path="/mentor/cursos/:id/editar" element={
                <ProtectedLayout role="mentor">
                  <EditCoursePage />
                </ProtectedLayout>
              } />
              <Route path="/mentor/mentorados" element={
                <ProtectedLayout role="mentor">
                  <MentorFollowersPage />
                </ProtectedLayout>
              } />
              <Route path="/mentor/calendario" element={
                <ProtectedLayout role="mentor">
                  <NotFound />
                </ProtectedLayout>
              } />
              <Route path="/mentor/configuracoes" element={
                <ProtectedLayout role="mentor">
                  <NotFound />
                </ProtectedLayout>
              } />
              
              {/* Mentorado protected routes */}
              <Route path="/mentorado/dashboard" element={
                <ProtectedLayout role="mentorado">
                  <MentoradoDashboardPage />
                </ProtectedLayout>
              } />
              <Route path="/mentorado/cursos" element={
                <ProtectedLayout role="mentorado">
                  <MentoradoCursosPage />
                </ProtectedLayout>
              } />
              <Route path="/mentorado/mentores" element={
                <ProtectedLayout role="mentorado">
                  <MentoradoMentoresPage />
                </ProtectedLayout>
              } />
              <Route path="/mentorado/calendario" element={
                <ProtectedLayout role="mentorado">
                  <MentoradoCalendarioPage />
                </ProtectedLayout>
              } />
              <Route path="/mentorado/configuracoes" element={
                <ProtectedLayout role="mentorado">
                  <MentoradoConfiguracoesPage />
                </ProtectedLayout>
              } />
              
              {/* Admin protected routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedLayout role="admin">
                  <AdminDashboardPage />
                </ProtectedLayout>
              } />
              <Route path="/admin/cursos" element={
                <ProtectedLayout role="admin">
                  <AdminCursosPage />
                </ProtectedLayout>
              } />
              <Route path="/admin/mentores" element={
                <ProtectedLayout role="admin">
                  <AdminMentoresPage />
                </ProtectedLayout>
              } />
              <Route path="/admin/mentorados" element={
                <ProtectedLayout role="admin">
                  <AdminMentoradosPage />
                </ProtectedLayout>
              } />
              <Route path="/admin/calendario" element={
                <ProtectedLayout role="admin">
                  <AdminCalendarioPage />
                </ProtectedLayout>
              } />
              <Route path="/admin/configuracoes" element={
                <ProtectedLayout role="admin">
                  <AdminConfiguracoesPage />
                </ProtectedLayout>
              } />
              
              {/* Keep backwards compatibility */}
              <Route path="/mentor/courses/new" element={
                <Navigate to="/mentor/cursos/novo" replace />
              } />
              <Route path="/mentor/courses/:id/edit" element={
                <Navigate to="/mentor/cursos/:id/editar" replace />
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
