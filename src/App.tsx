
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import CoursesPage from "@/pages/CoursesPage";
import LoginPage from "@/pages/LoginPage";
import MentorDashboardPage from "@/pages/MentorDashboardPage";
import MentorCoursesPage from "@/pages/MentorCoursesPage";
import CreateCoursePage from "@/pages/CreateCoursePage";
import EditCoursePage from "@/pages/EditCoursePage";
import CourseModulesPage from "@/pages/CourseModulesPage";
import ModuleLessonsPage from "@/pages/ModuleLessonsPage";
import MentorFollowersPage from "@/pages/MentorFollowersPage";
import MentorEnrollmentsPage from "@/pages/MentorEnrollmentsPage";
import MentorCalendarPage from "@/pages/MentorCalendarPage";
import NotFound from "@/pages/NotFound";
import { MentorSidebar } from "@/components/MentorSidebar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Routes>
              {/* Public routes */}
              <Route 
                path="/" 
                element={
                  <>
                    <Navigation />
                    <main className="flex-grow">
                      <HomePage />
                    </main>
                    <Footer />
                  </>
                } 
              />
              <Route 
                path="/about" 
                element={
                  <>
                    <Navigation />
                    <main className="flex-grow">
                      <AboutPage />
                    </main>
                    <Footer />
                  </>
                } 
              />
              <Route 
                path="/courses" 
                element={
                  <>
                    <Navigation />
                    <main className="flex-grow">
                      <CoursesPage />
                    </main>
                    <Footer />
                  </>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <>
                    <Navigation />
                    <main className="flex-grow">
                      <LoginPage />
                    </main>
                    <Footer />
                  </>
                } 
              />

              {/* Mentor routes with sidebar */}
              <Route 
                path="/mentor/*"
                element={
                  <SidebarProvider>
                    <div className="flex flex-row min-h-screen w-full">
                      <MentorSidebar />
                      <SidebarInset className="bg-background">
                        <Routes>
                          <Route path="/dashboard" element={<MentorDashboardPage />} />
                          <Route path="/courses" element={<MentorCoursesPage />} />
                          <Route path="/courses/new" element={<CreateCoursePage />} />
                          <Route path="/courses/:id/edit" element={<EditCoursePage />} />
                          <Route path="/courses/:id" element={<CourseModulesPage />} />
                          <Route path="/modules/:id/lessons" element={<ModuleLessonsPage />} />
                          <Route path="/followers" element={<MentorFollowersPage />} />
                          <Route path="/enrollments" element={<MentorEnrollmentsPage />} />
                          <Route path="/calendar" element={<MentorCalendarPage />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </SidebarInset>
                    </div>
                  </SidebarProvider>
                } 
              />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
