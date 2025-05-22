import React from "react";
import { Link } from "react-router-dom";
import Hero from "@/components/Hero";
import CourseCard from "@/components/CourseCard";
import MentorCard from "@/components/MentorCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getPublicCourses } from "@/services/courseService";
import { getFeaturedMentors, type Mentor } from "@/services/mentorService";

const HomePage: React.FC = () => {
  const { toast } = useToast();
  const [liveCourses, setLiveCourses] = React.useState<any[]>([]);
  const [featuredMentors, setFeaturedMentors] = React.useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [courses, mentors] = await Promise.all([
          getPublicCourses(),
          getFeaturedMentors()
        ]);
        
        setLiveCourses(courses.slice(0, 3));
        setFeaturedMentors(mentors);
      } catch (error) {
        console.error("Error loading homepage data:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível buscar os cursos e mentores.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);

  return (
    <div>
      <Hero />
      
      {/* Live Courses Section */}
      <section className="py-12 px-4 md:px-8 lg:px-16">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Cursos em Destaque</h2>
            <Link to="/courses">
              <Button variant="outline">Ver todos os cursos</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {!isLoading && liveCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
            {isLoading && (
              <>
                <div className="h-48 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-48 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-48 bg-gray-100 rounded-lg animate-pulse" />
              </>
            )}
          </div>
        </div>
      </section>
      
      {/* Featured Mentors Section */}
      <section className="py-12 px-4 md:px-8 lg:px-16">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Mentores em Destaque</h2>
            <Link to="/mentors">
              <Button variant="outline">Conheça nossos mentores</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {!isLoading && featuredMentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
            {isLoading && (
              <>
                <div className="h-48 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-48 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-48 bg-gray-100 rounded-lg animate-pulse" />
              </>
            )}
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
            <Link to="/courses">
              <Button variant="secondary" size="lg">
                Explorar cursos
              </Button>
            </Link>
            <Link to="/mentors">
              <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
                Encontrar mentor
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
