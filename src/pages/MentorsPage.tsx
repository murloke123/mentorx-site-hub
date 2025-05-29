import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Search, Users, Star, Award, Briefcase, Heart, Grid3X3 } from "lucide-react";
import { getAllPublicMentors } from "@/services/mentorService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { MentorCard } from "@/components/MentorCard";
import { Mentor } from "@/types/mentor";

const MentorsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [filter, setFilter] = useState("all"); // "all", "with-courses", "popular"

  // Fetch public mentors
  const { data: mentors = [], isLoading, error } = useQuery({
    queryKey: ['publicMentors'],
    queryFn: getAllPublicMentors
  });

  // Debug: Log dos dados para entender a estrutura
  useEffect(() => {
    if (mentors.length > 0) {
      console.log("=== DEBUG MENTORS ===");
      console.log("Total de mentores:", mentors.length);
      mentors.forEach((mentor, index) => {
        console.log(`Mentor ${index + 1}:`, {
          name: mentor.full_name,
          courses: mentor.courses_count,
          followers: mentor.followers_count,
          specialties: [mentor.sm_tit1, mentor.sm_tit2, mentor.sm_tit3].filter(Boolean)
        });
      });
    }
  }, [mentors]);

  // Extrair especialidades únicas dos mentores
  const getUniqueSpecialties = () => {
    const specialties = new Set<string>();
    mentors.forEach(mentor => {
      if (mentor.sm_tit1) specialties.add(mentor.sm_tit1);
      if (mentor.sm_tit2) specialties.add(mentor.sm_tit2);
      if (mentor.sm_tit3) specialties.add(mentor.sm_tit3);
    });
    return Array.from(specialties);
  };

  const uniqueSpecialties = getUniqueSpecialties();

  // Função para verificar se um mentor tem uma especialidade
  const mentorHasSpecialty = (mentor: Mentor, specialty: string) => {
    return mentor.sm_tit1?.toLowerCase().includes(specialty.toLowerCase()) ||
           mentor.sm_tit2?.toLowerCase().includes(specialty.toLowerCase()) ||
           mentor.sm_tit3?.toLowerCase().includes(specialty.toLowerCase());
  };

  // Categories com contadores dinâmicos
  const categoriesWithAll = [
    { 
      id: "all", 
      name: "Todos os Mentores", 
      color: "#8B5CF6",
      icon: Grid3X3,
      count: mentors.length 
    },
    { 
      id: "lideranca", 
      name: "Liderança", 
      color: "#3B82F6",
      icon: Star,
      count: mentors.filter(mentor => mentorHasSpecialty(mentor, "liderança") || mentorHasSpecialty(mentor, "leadership")).length
    },
    { 
      id: "desenvolvimento", 
      name: "Desenvolvimento", 
      color: "#F59E0B",
      icon: Award,
      count: mentors.filter(mentor => mentorHasSpecialty(mentor, "desenvolvimento") || mentorHasSpecialty(mentor, "development")).length
    },
    { 
      id: "negocios", 
      name: "Negócios", 
      color: "#10B981",
      icon: Briefcase,
      count: mentors.filter(mentor => mentorHasSpecialty(mentor, "negócios") || mentorHasSpecialty(mentor, "business")).length
    },
    { 
      id: "carreira", 
      name: "Carreira", 
      color: "#EF4444",
      icon: Users,
      count: mentors.filter(mentor => mentorHasSpecialty(mentor, "carreira") || mentorHasSpecialty(mentor, "career")).length
    },
    { 
      id: "vida", 
      name: "Vida Pessoal", 
      color: "#EC4899",
      icon: Heart,
      count: mentors.filter(mentor => mentorHasSpecialty(mentor, "vida") || mentorHasSpecialty(mentor, "pessoal")).length
    }
  ];

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch = mentor.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (mentor.bio || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (mentor.highlight_message || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesSpecialty = true;
    if (selectedSpecialty !== "all") {
      const category = categoriesWithAll.find(c => c.id === selectedSpecialty);
      if (category) {
        switch (selectedSpecialty) {
          case "lideranca":
            matchesSpecialty = mentorHasSpecialty(mentor, "liderança") || mentorHasSpecialty(mentor, "leadership");
            break;
          case "desenvolvimento":
            matchesSpecialty = mentorHasSpecialty(mentor, "desenvolvimento") || mentorHasSpecialty(mentor, "development");
            break;
          case "negocios":
            matchesSpecialty = mentorHasSpecialty(mentor, "negócios") || mentorHasSpecialty(mentor, "business");
            break;
          case "carreira":
            matchesSpecialty = mentorHasSpecialty(mentor, "carreira") || mentorHasSpecialty(mentor, "career");
            break;
          case "vida":
            matchesSpecialty = mentorHasSpecialty(mentor, "vida") || mentorHasSpecialty(mentor, "pessoal");
            break;
          default:
            matchesSpecialty = true;
        }
      }
    }
    
    let matchesFilter = true;
    if (filter === "with-courses") matchesFilter = (mentor.courses_count || 0) > 0;
    if (filter === "popular") matchesFilter = (mentor.followers_count || 0) > 5;
    
    return matchesSearch && matchesSpecialty && matchesFilter;
  });

  // Debug do filtro atual
  useEffect(() => {
    if (selectedSpecialty !== "all") {
      console.log(`=== FILTRO ATIVO: ${selectedSpecialty} ===`);
      console.log(`Mentores filtrados: ${filteredMentors.length}`);
      filteredMentors.forEach(mentor => {
        console.log(`- ${mentor.full_name} (especialidades: ${[mentor.sm_tit1, mentor.sm_tit2, mentor.sm_tit3].filter(Boolean).join(', ')})`);
      });
    }
  }, [selectedSpecialty, filteredMentors]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section com Aurora */}
      <AuroraBackground className="h-[600px]" showRadialGradient={true}>
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col gap-4 items-center justify-center px-4 z-10"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight text-center">
            Conecte-se com Mentores Excepcionais
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto italic text-center">
            Encontre o mentor ideal para acelerar seu crescimento pessoal e profissional
          </p>

          {/* Search and Filter Container */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 max-w-5xl mx-auto mb-16">
            {/* Search Input */}
            <div className="relative flex-1 max-w-2xl w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              <Input 
                type="text" 
                placeholder="Busque por nome, especialidade ou área de atuação..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg rounded-2xl border-0 shadow-xl bg-white transition-all duration-300 focus:outline-none focus:ring-0 focus:shadow-2xl focus:shadow-white/20"
                style={{
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = '0 0 0 4px rgba(255, 255, 255, 0.3), 0 10px 25px rgba(0, 0, 0, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
                }}
              />
            </div>
            
            {/* Filter Pills */}
            <div className="flex gap-4">
              <Button
                variant={filter === "all" ? "default" : "secondary"}
                onClick={() => setFilter("all")}
                className={`rounded-full px-6 py-6 font-medium transition-all duration-300 focus:outline-none focus:ring-0 ${
                  filter === "all" 
                    ? "bg-white text-purple-700 shadow-lg hover:shadow-xl focus:shadow-xl focus:shadow-white/20 border-2 border-purple-200" 
                    : "bg-white/20 text-white border border-white/30 hover:bg-white/30 focus:shadow-lg focus:shadow-white/20"
                }`}
              >
                Todos
              </Button>
              <Button
                variant={filter === "with-courses" ? "default" : "secondary"}
                onClick={() => setFilter("with-courses")}
                className={`rounded-full px-6 py-6 font-medium transition-all duration-300 focus:outline-none focus:ring-0 ${
                  filter === "with-courses" 
                    ? "bg-white text-purple-700 shadow-lg hover:shadow-xl focus:shadow-xl focus:shadow-white/20 border-2 border-purple-200" 
                    : "bg-white/20 text-white border border-white/30 hover:bg-white/30 focus:shadow-lg focus:shadow-white/20"
                }`}
              >
                Com Cursos
              </Button>
              <Button
                variant={filter === "popular" ? "default" : "secondary"}
                onClick={() => setFilter("popular")}
                className={`rounded-full px-6 py-6 font-medium transition-all duration-300 focus:outline-none focus:ring-0 ${
                  filter === "popular" 
                    ? "bg-white text-purple-700 shadow-lg hover:shadow-xl focus:shadow-xl focus:shadow-white/20 border-2 border-purple-200" 
                    : "bg-white/20 text-white border border-white/30 hover:bg-white/30 focus:shadow-lg focus:shadow-white/20"
                }`}
              >
                Populares
              </Button>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-4xl mx-auto">
            {categoriesWithAll.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.id}
                  onClick={() => setSelectedSpecialty(category.id)}
                  className={`cursor-pointer transition-all duration-300 hover:-translate-y-2 group ${
                    selectedSpecialty === category.id ? 'transform -translate-y-2' : ''
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-20 h-20 mx-auto mb-3 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 ${
                    selectedSpecialty === category.id ? 'ring-2 ring-white shadow-xl' : ''
                  }`}>
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: category.color }}
                    >
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <p className={`font-medium text-sm transition-colors duration-300 text-center ${
                    selectedSpecialty === category.id ? 'text-white' : 'text-white/90 group-hover:text-white'
                  }`}>
                    {category.name}
                  </p>
                  <p className="text-xs text-white/70 text-center mt-1">
                    {category.count} {category.count === 1 ? 'mentor' : 'mentores'}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </AuroraBackground>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {selectedSpecialty === "all" ? "Todos os Mentores" : categoriesWithAll.find(c => c.id === selectedSpecialty)?.name}
            </h2>
            <p className="text-gray-600 mt-2">
              Descubra mentores incríveis{searchTerm && ` para "${searchTerm}"`}
            </p>
          </div>
          
          {/* Active Filters */}
          {(selectedSpecialty !== "all" || filter !== "all" || searchTerm) && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Filtros ativos:</span>
              {selectedSpecialty !== "all" && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedSpecialty("all")}>
                  {categoriesWithAll.find(c => c.id === selectedSpecialty)?.name} ×
                </Badge>
              )}
              {filter !== "all" && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setFilter("all")}>
                  {filter === "with-courses" ? "Com Cursos" : "Populares"} ×
                </Badge>
              )}
              {searchTerm && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchTerm("")}>
                  "{searchTerm}" ×
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4 animate-spin">
              <Users className="h-8 w-8 text-white" />
            </div>
            <p className="text-gray-500 text-lg">Carregando mentores incríveis...</p>
          </div>
        )}

        {/* Mentors Grid */}
        {!isLoading && filteredMentors.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
            {filteredMentors.map((mentor, index) => (
              <MentorCard
                key={mentor.id} 
                mentor={mentor}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredMentors.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            {selectedSpecialty !== "all" && !searchTerm && filter === "all" ? (
              <>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Em breve teremos mentores nesta área</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Estamos trabalhando para trazer os melhores mentores de {categoriesWithAll.find(c => c.id === selectedSpecialty)?.name.toLowerCase()}. 
                  Fique atento às novidades!
                </p>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Nenhum mentor encontrado</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Não encontramos mentores que correspondam aos seus critérios de busca. 
                  Tente ajustar os filtros ou buscar por outros termos.
                </p>
              </>
            )}
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedSpecialty("all");
                setFilter("all");
              }}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              Limpar Filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorsPage; 