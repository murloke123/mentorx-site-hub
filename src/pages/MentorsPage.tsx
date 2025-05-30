import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";
import { getAllPublicMentors } from "@/services/mentorService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { MentorCard } from "@/components/MentorCard";
import { Mentor } from "@/types/mentor";

const MentorsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  // Fetch all public mentors using useState/useEffect like HomePage
  useEffect(() => {
    const loadMentors = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getAllPublicMentors();
        setMentors(data);
        console.log("Mentores carregados:", data.length);
      } catch (err) {
        console.error("Error loading mentors:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMentors();
  }, []);

  // Filtro simples apenas por nome e bio
  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch = mentor.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (mentor.bio || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (mentor.highlight_message || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section com Aurora */}
      <AuroraBackground className="h-[600px] bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600" showRadialGradient={true}>
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
          </div>
        </motion.div>
      </AuroraBackground>

      {/* Results Section - Exactly same structure as HomePage */}
      <section className="py-12 px-4 md:px-8 lg:px-16">
        <div className="container mx-auto">
          {/* Results Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Todos os Mentores
              </h2>
              <p className="text-gray-600 mt-2">
                Descubra mentores incríveis{searchTerm && ` para "${searchTerm}"`}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Exibindo {filteredMentors.length} de {mentors.length} mentores
              </p>
            </div>
            
            {/* Active Filters */}
            {searchTerm && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Filtro ativo:</span>
                <Badge variant="secondary" className="cursor-pointer bg-gray-200 text-gray-800 hover:bg-gray-300" onClick={() => setSearchTerm("")}>
                  "{searchTerm}" ×
                </Badge>
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4 animate-spin">
                <Users className="h-8 w-8 text-white" />
              </div>
              <p className="text-gray-600 text-lg">Carregando mentores incríveis...</p>
            </div>
          )}

          {/* Mentors Grid - Exactly same as HomePage */}
          {!isLoading && filteredMentors.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMentors.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredMentors.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              {searchTerm ? (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Nenhum mentor encontrado</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Não encontramos mentores que correspondam ao termo "{searchTerm}". 
                    Tente buscar por outros termos.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Nenhum mentor disponível</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Não há mentores disponíveis no momento. 
                    Volte em breve para conhecer nossos mentores incríveis!
                  </p>
                </>
              )}
              <Button 
                onClick={() => setSearchTerm("")}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                Limpar Busca
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MentorsPage; 