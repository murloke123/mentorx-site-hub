import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Search, Users, User, Crown, BarChart3, Code, Handshake, Grid3X3 } from "lucide-react";
import { getAllPublicMentors } from "@/services/mentorService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { MentorCard } from "@/components/MentorCard";
import { Mentor } from "@/types/mentor";
import { useCategories } from "@/hooks/useCategories";

const MentorsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const { categories } = useCategories();

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

  // Debug: Log dos dados para entender a estrutura
  useEffect(() => {
    if (mentors.length > 0) {
      console.log("=== DEBUG MENTORS ===");
      console.log("Total de mentores:", mentors.length);
      mentors.forEach((mentor, index) => {
        if (mentor.category) {
          console.log(`Mentor ${index + 1} - ${mentor.full_name}: categoria = ${mentor.category}`);
        }
      });
    }
  }, [mentors]);

  useEffect(() => {
    if (categories.length > 0) {
      console.log("=== DEBUG CATEGORIES ===");
      console.log("Categorias do banco:", categories);
    }
  }, [categories]);

  // Mapeamento inteligente entre categorias fixas e categorias do banco
  const getCategoryMapping = () => {
    const mapping: { [key: string]: string[] } = {};
    
    // Para cada categoria fixa, encontrar correspondências no banco
    const fixedCategories = [
      { id: "personal-development", names: ["desenvolvimento pessoal", "personal development"] },
      { id: "leadership", names: ["liderança", "leadership"] },
      { id: "marketing", names: ["marketing", "digital marketing"] },
      { id: "technology", names: ["tecnologia", "technology", "programação", "programming"] },
      { id: "sales", names: ["vendas", "sales"] }
    ];
    
    fixedCategories.forEach(fixedCat => {
      mapping[fixedCat.id] = [];
      
      // Adicionar IDs de categorias do banco que correspondem
      categories.forEach(dbCat => {
        const dbCatName = dbCat.name.toLowerCase().trim();
        const matches = fixedCat.names.some(name => 
          dbCatName.includes(name.toLowerCase()) || 
          name.toLowerCase().includes(dbCatName)
        );
        
        if (matches) {
          mapping[fixedCat.id].push(dbCat.id);
          console.log(`Mapeamento: ${fixedCat.id} -> ${dbCat.id} (${dbCat.name})`);
        }
      });
      
      // Adicionar nomes alternativos para compatibilidade
      mapping[fixedCat.id].push(...fixedCat.names);
    });
    
    return mapping;
  };

  // Função para verificar se um mentor pertence a uma categoria
  const mentorMatchesCategory = (mentor: any, categoryId: string) => {
    console.log(`\n=== Verificando mentor "${mentor.full_name}" ===`);
    console.log("Dados do mentor:", {
      category: mentor.category,
      category_id: mentor.category_id
    });
    console.log("Filtro procurado:", categoryId);
    
    const categoryMapping = getCategoryMapping();
    const possibleMatches = categoryMapping[categoryId] || [];
    console.log("Possíveis matches:", possibleMatches);
    
    // 1. Verificar por category_id direto
    if (mentor.category_id) {
      console.log("Verificando por category_id...");
      
      if (possibleMatches.includes(mentor.category_id)) {
        console.log(`✅ Match por category_id: ${mentor.category_id}`);
        return true;
      }
    }
    
    // 2. Verificar por campo category (string)
    if (mentor.category) {
      console.log("Verificando por campo category...");
      const mentorCategory = mentor.category.toLowerCase().trim();
      
      const categoryMatch = possibleMatches.some(match => 
        mentorCategory.includes(match.toLowerCase()) || 
        match.toLowerCase().includes(mentorCategory)
      );
      
      if (categoryMatch) {
        console.log(`✅ Match por campo category: ${mentor.category}`);
        return true;
      }
    }
    
    console.log(`❌ Nenhum match encontrado para o mentor "${mentor.full_name}"`);
    return false;
  };

  // Categories with icons (sem mostrar números)
  const categoriesWithAll = [
    { 
      id: "all", 
      name: "Todos os Mentores", 
      color: "#8B5CF6",
      icon: Grid3X3
    },
    { 
      id: "personal-development", 
      name: "Desenvolvimento Pessoal", 
      color: "#8B5CF6",
      icon: User
    },
    { 
      id: "leadership", 
      name: "Liderança", 
      color: "#3B82F6",
      icon: Crown
    },
    { 
      id: "marketing", 
      name: "Marketing", 
      color: "#F59E0B",
      icon: BarChart3
    },
    { 
      id: "technology", 
      name: "Tecnologia", 
      color: "#10B981",
      icon: Code
    },
    { 
      id: "sales", 
      name: "Vendas", 
      color: "#EF4444",
      icon: Handshake
    }
  ];

  // Filtro simples por nome, bio e categoria
  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch = mentor.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (mentor.bio || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (mentor.highlight_message || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesCategory = true;
    if (selectedCategory !== "all") {
      matchesCategory = mentorMatchesCategory(mentor, selectedCategory);
    }
    
    return matchesSearch && matchesCategory;
  });

  // Debug do filtro atual
  useEffect(() => {
    if (selectedCategory !== "all") {
      console.log(`=== FILTRO ATIVO: ${selectedCategory} ===`);
      console.log(`Mentores filtrados: ${filteredMentors.length}`);
      filteredMentors.forEach(mentor => {
        console.log(`- ${mentor.full_name} (categoria: ${mentor.category})`);
      });
    }
  }, [selectedCategory, filteredMentors]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner Section */}
      <div className="relative w-full">
        <div className="w-full h-[600px] overflow-hidden relative">
          <img 
            src="https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=1500&q=80"
            alt="Mentores Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/70 to-blue-600/70"></div>
          
          {/* Aurora Boreal Effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="aurora-container">
              <div className="aurora aurora-1"></div>
              <div className="aurora aurora-2"></div>
              <div className="aurora aurora-3"></div>
            </div>
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-6xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0.0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3,
                  duration: 0.8,
                  ease: "easeInOut",
                }}
                className="relative flex flex-col gap-4 items-center justify-center"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                  Conecte-se com Mentores Excepcionais
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto italic">
                  Encontre o mentor ideal para acelerar seu crescimento pessoal e profissional
                </p>
              </motion.div>
              
              {/* Search Container */}
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

              {/* Categories Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-4xl mx-auto">
                {categoriesWithAll.map((category, index) => {
                  const IconComponent = category.icon;
                  return (
                    <div
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`cursor-pointer transition-all duration-300 hover:-translate-y-2 group ${
                        selectedCategory === category.id ? 'transform -translate-y-2' : ''
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className={`w-20 h-20 mx-auto mb-3 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 ${
                        selectedCategory === category.id ? 'ring-2 ring-white shadow-xl' : ''
                      }`}>
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                          style={{ backgroundColor: category.color }}
                        >
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <p className={`font-medium text-sm transition-colors duration-300 ${
                        selectedCategory === category.id ? 'text-white' : 'text-white/90 group-hover:text-white'
                      }`}>
                        {category.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {selectedCategory === "all" ? "Todos os Mentores" : categoriesWithAll.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-gray-600 mt-2">
              Descubra mentores incríveis{searchTerm && ` para "${searchTerm}"`}
            </p>
          </div>
          
          {/* Active Filters */}
          {(selectedCategory !== "all" || searchTerm) && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Filtros ativos:</span>
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory("all")}>
                  {categoriesWithAll.find(c => c.id === selectedCategory)?.name} ×
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
            <p className="text-gray-600 text-lg">Carregando mentores incríveis...</p>
          </div>
        )}

        {/* Mentors Grid */}
        {!isLoading && filteredMentors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMentors.map((mentor, index) => (
              <div
                key={mentor.id} 
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <MentorCard mentor={mentor} />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredMentors.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            {selectedCategory !== "all" && !searchTerm ? (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Em breve teremos mentores nesta categoria</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Estamos trabalhando para trazer os melhores mentores de {categoriesWithAll.find(c => c.id === selectedCategory)?.name.toLowerCase()}. 
                  Fique atento às novidades!
                </p>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Nenhum mentor encontrado</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Não encontramos mentores que correspondam aos seus critérios de busca. 
                  Tente ajustar os filtros ou buscar por outros termos.
                </p>
              </>
            )}
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              Limpar Filtros
            </Button>
          </div>
        )}
      </div>

      {/* Add CSS animations and Aurora Effect */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-delay {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes aurora {
          0%, 100% { transform: translateX(-100%) translateY(-50%) rotate(0deg); }
          50% { transform: translateX(100%) translateY(-50%) rotate(180deg); }
        }
        
        @keyframes aurora2 {
          0%, 100% { transform: translateX(100%) translateY(-50%) rotate(180deg); }
          50% { transform: translateX(-100%) translateY(-50%) rotate(0deg); }
        }
        
        @keyframes aurora3 {
          0%, 100% { transform: translateX(-50%) translateY(-100%) rotate(90deg); }
          50% { transform: translateX(-50%) translateY(100%) rotate(270deg); }
        }
        
        .aurora-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }
        
        .aurora {
          position: absolute;
          width: 200%;
          height: 100px;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.1), 
            rgba(255, 255, 255, 0.2), 
            rgba(255, 255, 255, 0.1), 
            transparent
          );
          border-radius: 50px;
          filter: blur(20px);
        }
        
        .aurora-1 {
          top: 20%;
          animation: aurora 15s ease-in-out infinite;
          animation-delay: 0s;
        }
        
        .aurora-2 {
          top: 60%;
          animation: aurora2 20s ease-in-out infinite;
          animation-delay: 5s;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.05), 
            rgba(255, 255, 255, 0.15), 
            rgba(255, 255, 255, 0.05), 
            transparent
          );
        }
        
        .aurora-3 {
          left: 50%;
          width: 100px;
          height: 200%;
          animation: aurora3 25s ease-in-out infinite;
          animation-delay: 10s;
          background: linear-gradient(0deg, 
            transparent, 
            rgba(255, 255, 255, 0.03), 
            rgba(255, 255, 255, 0.08), 
            rgba(255, 255, 255, 0.03), 
            transparent
          );
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in-delay 0.8s ease-out 0.3s both;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};

export default MentorsPage; 