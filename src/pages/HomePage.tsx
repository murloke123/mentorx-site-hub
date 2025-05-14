
import Hero from "@/components/Hero";
import CourseCard from "@/components/CourseCard";
import MentorCard from "@/components/MentorCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Course, User } from "@/types";

const featuredCourses: Course[] = [
  {
    id: "1",
    title: "Marketing Digital para Iniciantes",
    description: "Aprenda os fundamentos do marketing digital e como aplicá-los em seu negócio.",
    mentorId: "1",
    price: 0,
    imageUrl: "/placeholder.svg",
  },
  {
    id: "2",
    title: "Gestão de Projetos com Metodologias Ágeis",
    description: "Domine técnicas de gestão de projetos usando Scrum, Kanban e outras metodologias ágeis.",
    mentorId: "2",
    price: 197,
    imageUrl: "/placeholder.svg",
  },
  {
    id: "3",
    title: "Finanças Pessoais e Investimentos",
    description: "Organize suas finanças e comece a investir com estratégia e conhecimento.",
    mentorId: "3",
    price: 149.90,
    imageUrl: "/placeholder.svg",
  },
];

const topMentors: User[] = [
  {
    id: "1",
    name: "Ana Silva",
    email: "ana@example.com",
    role: "mentor",
    bio: "Especialista em marketing digital com mais de 10 anos de experiência em grandes empresas.",
    areas: ["Marketing Digital", "Branding"],
  },
  {
    id: "2",
    name: "Carlos Mendes",
    email: "carlos@example.com",
    role: "mentor",
    bio: "Gerente de Projetos certificado PMP com background em tecnologia e transformação digital.",
    areas: ["Gestão de Projetos", "Agile"],
  },
  {
    id: "3",
    name: "Juliana Costa",
    email: "juliana@example.com",
    role: "mentor",
    bio: "Consultora financeira especializada em investimentos e planejamento para pessoas físicas e startups.",
    areas: ["Finanças", "Investimentos"],
  },
];

const HomePage = () => {
  return (
    <div>
      <Hero />
      
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
    </div>
  );
};

export default HomePage;
