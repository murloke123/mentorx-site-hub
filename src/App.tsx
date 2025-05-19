
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import CoursesPage from "./pages/CoursesPage";
import AboutPage from "./pages/AboutPage";
import MentorDashboardPage from "./pages/MentorDashboardPage";
import MeusCursosPage from "./pages/MeusCursosPage";
import CreateCoursePage from "./pages/CreateCoursePage";
import EditCoursePage from "./pages/EditCoursePage";
import CourseModulesPage from "./pages/CourseModulesPage";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import MentorFollowersPage from "./pages/MentorFollowersPage";
import MentoradoDashboardPage from "./pages/MentoradoDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminCoursesPage from "./pages/AdminCoursesPage";
import AdminMentorsPage from "./pages/AdminMentorsPage";
import AdminMentoradosPage from "./pages/AdminMentoradosPage";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cursos" element={<CoursesPage />} />
        <Route path="/sobre" element={<AboutPage />} />
        
        {/* Mentor routes */}
        <Route path="/mentor" element={<Navigate to="/mentor/dashboard" replace />} />
        <Route path="/mentor/dashboard" element={<MentorDashboardPage />} />
        <Route path="/mentor/cursos" element={<MeusCursosPage />} />
        <Route path="/mentor/cursos/novo" element={<CreateCoursePage />} />
        <Route path="/mentor/cursos/:id/editar" element={<EditCoursePage />} />
        <Route path="/mentor/cursos/:id/modulos" element={<CourseModulesPage />} />
        <Route path="/mentor/cursos/:id/detalhes" element={<CourseDetailsPage />} />
        <Route path="/mentor/seguidores" element={<MentorFollowersPage />} />
        
        {/* Mentorado routes */}
        <Route path="/mentorado" element={<Navigate to="/mentorado/dashboard" replace />} />
        <Route path="/mentorado/dashboard" element={<MentoradoDashboardPage />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/cursos" element={<AdminCoursesPage />} />
        <Route path="/admin/mentores" element={<AdminMentorsPage />} />
        <Route path="/admin/mentorados" element={<AdminMentoradosPage />} />
        
        {/* Fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
