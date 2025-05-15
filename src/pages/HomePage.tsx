
import Hero from "@/components/Hero";
import CourseCard from "@/components/CourseCard";
import MentorCard from "@/components/MentorCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Onboarding from "@/components/Onboarding";
import { mockCourses, mockMentors } from "@/data/mockData";

const becomeMentorSlides = [
  {
    title: "Sua própria plataforma",
    description: "Configure sua própria plataforma com sua marca, identidade visual e logo.",
    icon: "🎨"
  },
  {
    title: "Compartilhe nas redes",
    description: "Compartilhe nas redes sociais — no futuro, integrará com WhatsApp e outras plataformas.",
    icon: "📱"
  },
  {
    title: "Recompensas exclusivas",
    description: "Ganhe recompensas exclusivas participando do ecossistema MentorX.",
    icon: "🏆"
  },
  {
    title: "Comunidade de mentores",
    description: "Interaja com outros mentores e faça parte de um grupo exclusivo.",
    icon: "👥"
  }
];

const HomePage = () => {
  const [showMentorDialog, setShowMentorDialog] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const featuredCourses = mockCourses.slice(0, 3);
  const topMentors = mockMentors.slice(0, 3);
  
  const handleBecomeMentor = () => {
    setShowMentorDialog(false);
    setShowOnboarding(true);
  };

  return (
    <div>
      <Hero />
      
      {/* "Seja um Mentor" CTA */}
      <section className="py-10 bg-gradient-to-br from-purple-100 to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Compartilhe seu conhecimento</h2>
              <p className="text-lg mb-6">
                Transforme sua experiência em oportunidade. Crie cursos, realize mentorias
                e construa sua comunidade de seguidores.
              </p>
              <Button 
                size="lg" 
                className="relative overflow-hidden group animate-pulse hover:animate-none"
                onClick={() => setShowMentorDialog(true)}
              >
                <span className="absolute inset-0 bg-white/20 transform translate-x-full group-hover:translate-x-[-100%] transition-transform duration-300"></span>
                <span className="relative z-10">+ Seja um Mentor</span>
              </Button>
            </div>
            <div className="lg:w-1/2 w-full">
              <Carousel className="w-full">
                <CarouselContent>
                  {becomeMentorSlides.map((slide, index) => (
                    <CarouselItem key={index}>
                      <div className="p-6 bg-white rounded-xl shadow-sm border h-64 flex flex-col justify-center items-center text-center">
                        <div className="text-4xl mb-4">{slide.icon}</div>
                        <h3 className="text-xl font-semibold mb-2">{slide.title}</h3>
                        <p className="text-gray-600">{slide.description}</p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Courses */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Cursos em Destaque</h2>
            <Link to="/courses">
              <Button variant="outline">Ver Todos</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Top Mentors */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Mentores em Destaque</h2>
            <Link to="/mentors">
              <Button variant="outline">Ver Todos</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topMentors.map(mentor => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        </div>
      </section>
      
      {/* How it Works */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-12">Como Funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full mb-4">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Encontre seu Mentor</h3>
              <p className="text-gray-600">Explore nossa rede de especialistas e encontre o mentor ideal para suas necessidades.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full mb-4">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Agende Sessões</h3>
              <p className="text-gray-600">Escolha horários disponíveis e agende sessões personalizadas com seu mentor.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full mb-4">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Evolua com Conhecimento</h3>
              <p className="text-gray-600">Acesse cursos, materiais exclusivos e aplique os aprendizados na prática.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Become Mentor Dialog */}
      <Dialog open={showMentorDialog} onOpenChange={setShowMentorDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Torne-se um Mentor</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <Carousel>
              <CarouselContent>
                {becomeMentorSlides.map((slide, index) => (
                  <CarouselItem key={index}>
                    <div className="p-6 text-center">
                      <div className="text-5xl mb-4">{slide.icon}</div>
                      <h3 className="text-xl font-semibold mb-2">{slide.title}</h3>
                      <p className="text-gray-600">{slide.description}</p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>

            <div className="flex justify-center mt-8">
              <Button onClick={handleBecomeMentor}>
                Começar como Mentor
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Onboarding Dialog */}
      <Onboarding open={showOnboarding} onComplete={() => setShowOnboarding(false)} />
    </div>
  );
};

export default HomePage;
