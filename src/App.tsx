
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
import CreateCoursePage from "@/pages/CreateCoursePage";
import MentorFollowersPage from "@/pages/MentorFollowersPage";
import NotFound from "@/pages/NotFound";


const queryClient = new QueryClient();

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
              <Route path="/mentor/dashboard" element={<MentorDashboardPage />} />
              <Route path="/mentor/courses/new" element={<CreateCoursePage />} />
              <Route path="/mentor/followers" element={<MentorFollowersPage />} />
              {/* Add additional mentor routes */}
              <Route path="/mentor/courses/:id" element={<NotFound />} />
              <Route path="/mentor/courses/:id/edit" element={<NotFound />} />
              <Route path="/mentor/modules/new" element={<NotFound />} />
              <Route path="/mentor/modules/:id" element={<NotFound />} />
              <Route path="/mentor/modules/:id/edit" element={<NotFound />} />
              <Route path="/mentor/modules/:id/lessons" element={<NotFound />} />
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
