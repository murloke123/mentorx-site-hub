import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
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

const queryClient = new QueryClient();

// Protected Route component that redirects to login if not authenticated
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    checkSession();
  }, []);

  // Show nothing during the initial check
  if (isLoggedIn === null) return null;
  
  if (!isLoggedIn) {
    // Redirect to login, but save the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
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
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected mentor routes */}
              <Route path="/mentor/dashboard" element={
                <ProtectedRoute>
                  <MentorDashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/mentor/cursos" element={
                <ProtectedRoute>
                  <MeusCursosPage />
                </ProtectedRoute>
              } />
              <Route path="/mentor/cursos/novo" element={
                <ProtectedRoute>
                  <CreateCoursePage />
                </ProtectedRoute>
              } />
              <Route path="/mentor/cursos/:id/editar" element={
                <ProtectedRoute>
                  <EditCoursePage />
                </ProtectedRoute>
              } />
              <Route path="/mentor/followers" element={
                <ProtectedRoute>
                  <MentorFollowersPage />
                </ProtectedRoute>
              } />
              <Route path="/mentor/mentorados" element={
                <ProtectedRoute>
                  <MentorFollowersPage />
                </ProtectedRoute>
              } />
              <Route path="/mentor/calendario" element={
                <ProtectedRoute>
                  <NotFound />
                </ProtectedRoute>
              } />
              <Route path="/mentor/configuracoes" element={
                <ProtectedRoute>
                  <NotFound />
                </ProtectedRoute>
              } />
              <Route path="/mentor/cursos/:id" element={
                <ProtectedRoute>
                  <NotFound />
                </ProtectedRoute>
              } />
              <Route path="/mentor/modulos/novo" element={
                <ProtectedRoute>
                  <NotFound />
                </ProtectedRoute>
              } />
              <Route path="/mentor/modulos/:id" element={
                <ProtectedRoute>
                  <NotFound />
                </ProtectedRoute>
              } />
              <Route path="/mentor/modulos/:id/editar" element={
                <ProtectedRoute>
                  <NotFound />
                </ProtectedRoute>
              } />
              <Route path="/mentor/modulos/:id/aulas" element={
                <ProtectedRoute>
                  <NotFound />
                </ProtectedRoute>
              } />
              
              {/* Keep backwards compatibility */}
              <Route path="/mentor/courses/new" element={
                <ProtectedRoute>
                  <CreateCoursePage />
                </ProtectedRoute>
              } />
              <Route path="/mentor/courses/:id/edit" element={
                <ProtectedRoute>
                  <EditCoursePage />
                </ProtectedRoute>
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
