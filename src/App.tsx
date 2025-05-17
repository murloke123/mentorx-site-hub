import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import CoursesPage from "@/pages/CoursesPage";
import LoginPage from "@/pages/LoginPage";
import MentorDashboardPage from "@/pages/MentorDashboardPage";
import MentoradoDashboardPage from "@/pages/MentoradoDashboardPage";
import CreateCoursePage from "@/pages/CreateCoursePage";
import EditCoursePage from "@/pages/EditCoursePage";
import MeusCursosPage from "@/pages/MeusCursosPage";
import MentorFollowersPage from "@/pages/MentorFollowersPage";
import NotFound from "@/pages/NotFound";
import Debug from "@/components/Debug";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Debug />
          <Navigation />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/mentor/dashboard" element={<MentorDashboardPage />} />
              <Route path="/mentor/cursos" element={<MeusCursosPage />} />
              <Route path="/mentor/cursos/novo" element={<CreateCoursePage />} />
              <Route path="/mentor/cursos/:id/editar" element={<EditCoursePage />} />
              <Route path="/mentor/followers" element={<MentorFollowersPage />} />
              <Route path="/mentor/mentorados" element={<MentorFollowersPage />} />
              <Route path="/mentorado/dashboard" element={<MentoradoDashboardPage />} />
              <Route path="/mentorado/cursos" element={<NotFound />} />
              <Route path="/mentorado/cursos/:id" element={<NotFound />} />
              <Route path="/mentorado/calendario" element={<NotFound />} />
              <Route path="/mentorado/configuracoes" element={<NotFound />} />
              {/* Keep backwards compatibility for now */}
              <Route path="/mentor/courses/new" element={<CreateCoursePage />} />
              <Route path="/mentor/courses/:id/edit" element={<EditCoursePage />} />
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
