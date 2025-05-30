import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import CourseCardGrid from "@/components/CourseCardGrid";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, User, Crown, BarChart3, Code, Handshake, Grid3X3 } from "lucide-react";
import { getPublicCourses } from "@/services/courseService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCategories } from "@/hooks/useCategories";

const CoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filter, setFilter] = useState("all"); // "all", "free", "paid"

  const { categories } = useCategories();

  // Fetch public courses
  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ['publicCourses'],
    queryFn: getPublicCourses
  });

  // Debug: Log dos dados para entender a estrutura
  useEffect(() => {
    if (courses.length > 0) {
      console.log("=== DEBUG COURSES ===");
      console.log("Total de cursos:", courses.length);
      courses.forEach((course, index) => {
        console.log(`Curso ${index + 1}:`, {
          title: course.title,
          category: course.category,
          category_id: course.category_id,
          category_info: course.category_info,
          category_type: typeof course.category
        });
      });
    }
  }, [courses]);

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

  // Função para verificar se um curso pertence a uma categoria
  const courseMatchesCategory = (course: any, categoryId: string) => {
    console.log(`\n=== Verificando curso "${course.title}" ===`);
    console.log("Dados do curso:", {
      category: course.category,
      category_id: course.category_id,
      category_info: course.category_info
    });
    console.log("Filtro procurado:", categoryId);
    
    const categoryMapping = getCategoryMapping();
    const possibleMatches = categoryMapping[categoryId] || [];
    console.log("Possíveis matches:", possibleMatches);
    
    // 1. Verificar por category_info (join com tabela categories)
    if (course.category_info) {
      console.log("Verificando por category_info...");
      
      // Verificar ID direto
      if (possibleMatches.includes(course.category_info.id)) {
        console.log(`✅ Match por category_info.id: ${course.category_info.name}`);
        return true;
      }
      
      // Verificar nome da categoria
      const categoryInfoName = course.category_info.name.toLowerCase().trim();
      const nameMatch = possibleMatches.some(match => 
        categoryInfoName.includes(match.toLowerCase()) || 
        match.toLowerCase().includes(categoryInfoName)
      );
      
      if (nameMatch) {
        console.log(`✅ Match por category_info.name: ${course.category_info.name}`);
        return true;
      }
    }
    
    // 2. Verificar por category_id direto
    if (course.category_id) {
      console.log("Verificando por category_id...");
      
      if (possibleMatches.includes(course.category_id)) {
        console.log(`✅ Match por category_id: ${course.category_id}`);
        return true;
      }
    }
    
    // 3. Verificar por campo category (string legacy)
    if (course.category) {
      console.log("Verificando por campo category (legacy)...");
      const courseCategory = course.category.toLowerCase().trim();
      
      const legacyMatch = possibleMatches.some(match => 
        courseCategory.includes(match.toLowerCase()) || 
        match.toLowerCase().includes(courseCategory)
      );
      
      if (legacyMatch) {
        console.log(`✅ Match por campo category: ${course.category}`);
        return true;
      }
    }
    
    console.log(`❌ Nenhum match encontrado para o curso "${course.title}"`);
    return false;
  };

  // Categories with dynamic counts from actual data
  const categoriesWithAll = [
    { 
      id: "all", 
      name: "Todos os Cursos", 
      color: "#8B5CF6",
      icon: Grid3X3,
      count: courses.length 
    },
    { 
      id: "personal-development", 
      name: "Desenvolvimento Pessoal", 
      color: "#8B5CF6",
      icon: User,
      count: courses.filter(course => courseMatchesCategory(course, "personal-development")).length
    },
    { 
      id: "leadership", 
      name: "Liderança", 
      color: "#3B82F6",
      icon: Crown,
      count: courses.filter(course => courseMatchesCategory(course, "leadership")).length
    },
    { 
      id: "marketing", 
      name: "Marketing", 
      color: "#F59E0B",
      icon: BarChart3,
      count: courses.filter(course => courseMatchesCategory(course, "marketing")).length
    },
    { 
      id: "technology", 
      name: "Tecnologia", 
      color: "#10B981",
      icon: Code,
      count: courses.filter(course => courseMatchesCategory(course, "technology")).length
    },
    { 
      id: "sales", 
      name: "Vendas", 
      color: "#EF4444",
      icon: Handshake,
      count: courses.filter(course => courseMatchesCategory(course, "sales")).length
    }
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesCategory = true;
    if (selectedCategory !== "all") {
      matchesCategory = courseMatchesCategory(course, selectedCategory);
    }
    
    let matchesFilter = true;
    if (filter === "free") matchesFilter = !course.is_paid;
    if (filter === "paid") matchesFilter = course.is_paid;
    
    return matchesSearch && matchesCategory && matchesFilter;
  });

  // Debug do filtro atual
  useEffect(() => {
    if (selectedCategory !== "all") {
      console.log(`=== FILTRO ATIVO: ${selectedCategory} ===`);
      console.log(`Cursos filtrados: ${filteredCourses.length}`);
      filteredCourses.forEach(course => {
        console.log(`- ${course.title} (categoria: ${course.category})`);
  });
    }
  }, [selectedCategory, filteredCourses]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner Section */}
      <div className="relative w-full">
        <div className="w-full h-[600px] overflow-hidden relative">
          <img 
            src="https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=1500&q=80"
            alt="Cursos Banner" 
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
                  Domine novas habilidades com especialistas
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto italic">
                  Aprenda com quem realmente entende do assunto
                </p>
              </motion.div>
              
              {/* Search and Filter Container */}
              <div className="flex flex-col lg:flex-row items-center justify-center gap-6 max-w-5xl mx-auto mb-16">
                {/* Search Input */}
                <div className="relative flex-1 max-w-2xl w-full">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
          <Input 
            type="text" 
                    placeholder="O que você quer aprender hoje?" 
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
                    variant={filter === "free" ? "default" : "secondary"}
                    onClick={() => setFilter("free")}
                    className={`rounded-full px-6 py-6 font-medium transition-all duration-300 focus:outline-none focus:ring-0 ${
                      filter === "free" 
                        ? "bg-white text-purple-700 shadow-lg hover:shadow-xl focus:shadow-xl focus:shadow-white/20 border-2 border-purple-200" 
                        : "bg-white/20 text-white border border-white/30 hover:bg-white/30 focus:shadow-lg focus:shadow-white/20"
                    }`}
                  >
                    Gratuitos
                  </Button>
                  <Button
                    variant={filter === "paid" ? "default" : "secondary"}
                    onClick={() => setFilter("paid")}
                    className={`rounded-full px-6 py-6 font-medium transition-all duration-300 focus:outline-none focus:ring-0 ${
                      filter === "paid" 
                        ? "bg-white text-purple-700 shadow-lg hover:shadow-xl focus:shadow-xl focus:shadow-white/20 border-2 border-purple-200" 
                        : "bg-white/20 text-white border border-white/30 hover:bg-white/30 focus:shadow-lg focus:shadow-white/20"
                    }`}
                  >
                    Premium
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
              {selectedCategory === "all" ? "Todos os Cursos" : categoriesWithAll.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-gray-600 mt-2">
              Segue nossa lista de cursos{searchTerm && ` para "${searchTerm}"`}
            </p>
          </div>
          
          {/* Active Filters */}
          {(selectedCategory !== "all" || filter !== "all" || searchTerm) && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Filtros ativos:</span>
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory("all")}>
                  {categoriesWithAll.find(c => c.id === selectedCategory)?.name} ×
                </Badge>
              )}
              {filter !== "all" && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setFilter("all")}>
                  {filter === "free" ? "Gratuitos" : "Premium"} ×
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
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <p className="text-gray-500 text-lg">Carregando cursos incríveis...</p>
          </div>
        )}

        {/* Courses Grid */}
        {!isLoading && filteredCourses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
            {filteredCourses.map((course, index) => (
              <div
              key={course.id} 
                className="animate-fade-in-up w-full max-w-[350px]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CourseCardGrid course={course} />
              </div>
          ))}
        </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredCourses.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            {selectedCategory !== "all" && !searchTerm && filter === "all" ? (
              <>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Em breve teremos cursos com esse tópico</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Estamos trabalhando para trazer os melhores cursos de {categoriesWithAll.find(c => c.id === selectedCategory)?.name.toLowerCase()}. 
                  Fique atento às novidades!
                </p>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Nenhum curso encontrado</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Não encontramos cursos que correspondam aos seus critérios de busca. 
                  Tente ajustar os filtros ou buscar por outros termos.
          </p>
              </>
            )}
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setFilter("all");
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

export default CoursesPage;
