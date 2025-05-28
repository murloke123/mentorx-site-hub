import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import CourseCardGrid from "@/components/CourseCardGrid";
import { Input } from "@/components/ui/input";
import { Search, BookOpen } from "lucide-react";
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

  // Categories with dynamic data from database
  const categoriesWithAll = [
    { 
      id: "all", 
      name: "Todos os Cursos", 
      color: "#8B5CF6",
      count: courses.length 
    },
    ...categories.map(category => ({
      id: category.id,
      name: category.name,
      color: category.color || "#8B5CF6",
      count: Math.floor(courses.length * 0.2) // Placeholder - você pode implementar contagem real
    }))
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesCategory = true;
    if (selectedCategory !== "all") {
      // Implementar filtro por categoria quando os cursos tiverem category_id
      matchesCategory = true;
    }
    
    let matchesFilter = true;
    if (filter === "free") matchesFilter = !course.is_paid;
    if (filter === "paid") matchesFilter = course.is_paid;
    
    return matchesSearch && matchesCategory && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner Section */}
      <div className="relative w-full">
        <div className="w-full h-[500px] overflow-hidden relative">
          <img 
            src="https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=1500&q=80"
            alt="Cursos Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/40 to-blue-600/40"></div>
          
          {/* Search Bar in Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-4xl mx-auto px-4">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
                Descubra Seu Próximo
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Curso Incrível
                </span>
              </h1>
              <p className="text-xl text-white/90 mb-8 animate-fade-in-delay">
                Explore mais de {courses.length} cursos criados pelos melhores mentores
              </p>
              
              {/* Enhanced Search Bar */}
              <div className="relative max-w-2xl mx-auto animate-slide-up">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                  <Input 
                    type="text" 
                    placeholder="O que você quer aprender hoje?" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-4 text-lg rounded-full border-0 shadow-2xl bg-white/95 backdrop-blur-sm focus:bg-white transition-all duration-300 hover:shadow-3xl"
                  />
                </div>
                
                {/* Filter Pills */}
                <div className="flex justify-center gap-3 mt-4">
                  <Button
                    variant={filter === "all" ? "default" : "secondary"}
                    onClick={() => setFilter("all")}
                    className="rounded-full px-6 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-300"
                  >
                    Todos
                  </Button>
                  <Button
                    variant={filter === "free" ? "default" : "secondary"}
                    onClick={() => setFilter("free")}
                    className="rounded-full px-6 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-300"
                  >
                    Gratuitos
                  </Button>
                  <Button
                    variant={filter === "paid" ? "default" : "secondary"}
                    onClick={() => setFilter("paid")}
                    className="rounded-full px-6 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-300"
                  >
                    Premium
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="relative -mt-20 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categoriesWithAll.map((category, index) => {
              return (
                <div
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg hover:shadow-xl 
                    transition-all duration-300 hover:scale-105 cursor-pointer group
                    ${selectedCategory === category.id ? 'ring-2 ring-purple-500 bg-white' : ''}
                    animate-slide-up
                  `}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div 
                    className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: category.color }}
                  >
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm">{category.name}</h3>
                  <p className="text-xs text-gray-600">{category.count} cursos</p>
                </div>
              );
            })}
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
              {filteredCourses.length} curso{filteredCourses.length !== 1 ? 's' : ''} encontrado{filteredCourses.length !== 1 ? 's' : ''}
              {searchTerm && ` para "${searchTerm}"`}
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
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Nenhum curso encontrado</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Não encontramos cursos que correspondam aos seus critérios de busca. 
              Tente ajustar os filtros ou buscar por outros termos.
            </p>
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

      {/* Add CSS animations */}
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
