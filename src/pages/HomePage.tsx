
import React from "react";
import { Link } from "react-router-dom";
import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";
import CourseCard from "@/components/CourseCard";
import MentorCard from "@/components/MentorCard";
import Footer from "@/components/Footer";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getPublicCourses } from "@/services/courseService";
import { courses, mentors } from "@/data/mockData";

const HomePage: React.FC = () => {
  const { toast } = useToast();
  const [liveCourses, setLiveCourses] = React.useState(courses.slice(0, 3));
  
  React.useEffect(() => {
    const loadCourses = async () => {
      try {
        const publicCourses = await getPublicCourses();
        if (publicCourses.length > 0) {
          setLiveCourses(publicCourses.slice(0, 3));
        }
      } catch (error) {
        console.error("Error loading courses:", error);
        toast({
          title: "Erro ao carregar cursos",
          description: "Não foi possível buscar os cursos disponíveis.",
          variant: "destructive",
        });
      }
    };
    
    loadCourses();
  }, [toast]);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <Hero />
      
      {/* Featured Courses */}
      <section className="py-12 px-4 md:px-8 lg:px-16 bg-slate-50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Cursos em Destaque</h2>
            <Link to="/courses">
              <Button variant="outline">Ver todos os cursos</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Mentors */}
      <section className="py-12 px-4 md:px-8 lg:px-16">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Mentores em Destaque</h2>
            <Button variant="outline">Conheça nossos mentores</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-primary text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Comece sua jornada hoje</h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Acesse cursos de alta qualidade e mentorias personalizadas para acelerar sua carreira
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="secondary" size="lg">
              Explorar cursos
            </Button>
            <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
              Encontrar mentor
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default HomePage;
