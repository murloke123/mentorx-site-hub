
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CourseCard from "@/components/CourseCard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { getPublicCourses } from "@/services/courseService";

const CoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // "all", "free", "paid"

  // Fetch public courses
  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ['publicCourses'],
    queryFn: getPublicCourses
  });

  // Debug logging
  console.log('CoursesPage - Courses:', courses);
  console.log('CoursesPage - Loading:', isLoading);
  console.log('CoursesPage - Error:', error);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    if (filter === "free") return matchesSearch && !course.is_paid;
    if (filter === "paid") return matchesSearch && course.is_paid;
    return matchesSearch;
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Cursos Disponíveis</h1>
        <p className="text-gray-600">
          Explore cursos criados pelos melhores mentores da plataforma
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            type="text" 
            placeholder="Buscar cursos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os cursos</SelectItem>
              <SelectItem value="free">Cursos gratuitos</SelectItem>
              <SelectItem value="paid">Cursos pagos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold">Categorias:</h2>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-primary/5">Marketing</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary/5">Finanças</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary/5">Desenvolvimento</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary/5">Carreira</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary/5">Liderança</Badge>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Carregando cursos...
          </p>
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Nenhum curso encontrado com os filtros atuais.
          </p>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
