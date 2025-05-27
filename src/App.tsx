import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import CoursesPage from "./pages/CoursesPage";
import LoginPage from "@/pages/LoginPage";
import MentorDashboardPage from "@/pages/MentorDashboardPage";
import MentoradoDashboardPage from "@/pages/MentoradoDashboardPage";
import CreateCoursePage from "@/pages/CreateCoursePage";
import EditCoursePage from "@/pages/EditCoursePage";
import MeusCursosPage from "@/pages/MeusCursosPage";
import MentorFollowersPage from "@/pages/MentorFollowersPage";
import ModulosPage from "@/pages/ModulosPage";
import ConteudosPage from "@/pages/ConteudosPage";
import NotFound from "@/pages/NotFound";
import Debug from "@/components/Debug";
import CoursePlayerPage from "@/pages/mentor/cursos/CoursePlayerPage";
import RoutesVisualizationPage from "./pages/mentor/configuracoes/RoutesVisualizationPage";
import DatabaseMappingPage from "./pages/mentor/configuracoes/DatabaseMappingPage";

// Importar as novas páginas de perfil
import MentorProfilePage from "@/pages/profile/MentorProfilePage";
import MentorPublicProfilePage from "@/pages/profile/MentorPublicProfilePage";
import MentoradoProfilePage from "@/pages/profile/MentoradoProfilePage";
import AdminProfilePage from "@/pages/profile/AdminProfilePage";

// Importar as novas páginas de administração
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import AdminMentorsPage from "@/pages/AdminMentorsPage";
import AdminMentoradosPage from "@/pages/AdminMentoradosPage";
import AdminCoursesPage from "@/pages/AdminCoursesPage";

const queryClient = new QueryClient();

// Componente para controlar a exibição do Navigation
const AppContent = () => {
  const location = useLocation();
  const isCoursePlayerPage = location.pathname.includes('/mentor/cursos/view/');
  const isMentorPublicProfilePage = location.pathname.includes('/mentor/publicview/');

  return (
    <div className="flex flex-col min-h-screen">
      <Debug />
      {!isCoursePlayerPage && !isMentorPublicProfilePage && <Navigation />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rotas de Mentor */}
          <Route path="/mentor/dashboard" element={<MentorDashboardPage />} />
          <Route path="/mentor/perfil" element={<MentorProfilePage />} />
          <Route path="/mentor/publicview/:id" element={<MentorPublicProfilePage />} />
          <Route path="/mentor/cursos" element={<MeusCursosPage />} />
          <Route path="/mentor/cursos/novo" element={<CreateCoursePage />} />
          <Route path="/mentor/cursos/:id/editar" element={<EditCoursePage />} />
          <Route path="/mentor/cursos/view/:id" element={<CoursePlayerPage />} />
          <Route path="/mentor/cursos/:cursoId/modulos" element={<ModulosPage />} />
          <Route path="/mentor/cursos/:cursoId/modulos/:moduloId" element={<ConteudosPage />} />
          <Route path="/mentor/followers" element={<MentorFollowersPage />} />
          <Route path="/mentor/mentorados" element={<MentorFollowersPage />} />
          <Route path="/mentor/configuracoes/rotas" element={<RoutesVisualizationPage />} />
          <Route path="/mentor/configuracoes/database-mapping" element={<DatabaseMappingPage />} />
          
          {/* Rotas de Mentorado */}
          <Route path="/mentorado/dashboard" element={<MentoradoDashboardPage />} />
          <Route path="/mentorado/perfil" element={<MentoradoProfilePage />} />
          <Route path="/mentorado/cursos" element={<NotFound />} />
          <Route path="/mentorado/cursos/:id" element={<NotFound />} />
          <Route path="/mentorado/calendario" element={<NotFound />} />
          <Route path="/mentorado/configuracoes" element={<NotFound />} />
          
          {/* Rotas de Administrador */}
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/perfil" element={<AdminProfilePage />} />
          <Route path="/admin/mentores" element={<AdminMentorsPage />} />
          <Route path="/admin/mentors" element={<AdminMentorsPage />} />
          <Route path="/admin/mentorados" element={<AdminMentoradosPage />} />
          <Route path="/admin/cursos" element={<AdminCoursesPage />} />
          <Route path="/admin/relatorios" element={<NotFound />} />
          <Route path="/admin/configuracoes" element={<NotFound />} />
        </Routes>
      </main>
      {!isCoursePlayerPage && !isMentorPublicProfilePage && <Footer />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
