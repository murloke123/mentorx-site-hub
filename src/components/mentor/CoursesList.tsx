import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Filter, PlusCircle, Search, Layers, Edit2, Eye, AlertTriangle } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCourse } from '@/services/courseService';

interface Course {
  id: string;
  titulo: string;
  descricao?: string;
  eh_publico: boolean;
  eh_pago: boolean;
  preco?: number;
  url_imagem?: string;
  inscricoes?: { count: number }[];
  foi_publicado?: boolean;
}

interface CoursesListProps {
  courses: Course[];
  isLoading: boolean;
  totalEnrollments: number;
}

const CoursesList = ({ courses, isLoading, totalEnrollments }: CoursesListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<string | null>(null);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  // Filtrar cursos com base na busca e filtro de visibilidade
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.titulo.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = visibilityFilter === null || 
                        (visibilityFilter === 'public' && course.eh_publico) ||
                        (visibilityFilter === 'private' && !course.eh_publico) ||
                        (visibilityFilter === 'paid' && course.eh_pago) ||
                        (visibilityFilter === 'free' && !course.eh_pago);
                        
    return matchesSearch && matchesFilter;
  });
  
  // Lidar com a mudança de filtro
  const handleFilterChange = (value: string) => {
    if (value === 'all') {
      setVisibilityFilter(null);
    } else {
      setVisibilityFilter(value);
    }
  };

  // Lidar com o clique no botão de criar curso
  const handleCreateCourse = () => {
    navigate('/mentor/cursos/novo');
  };

  // Handler for image loading errors
  const handleImageError = (courseId: string) => {
    setImageLoadErrors(prevErrors => {
      const newErrors = new Set(prevErrors);
      newErrors.add(courseId);
      return newErrors;
    });
    console.warn(`Failed to load image for course ${courseId}. It might be an invalid or inaccessible blob URL.`);
  };

  // Navegar para a página de visualização do curso (CoursePlayerPage)
  const handleViewCourse = (courseId: string) => {
    navigate(`/mentor/cursos/view/${courseId}`);
  };

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handlePublishChange = async (courseId: string, isChecked: boolean) => {
    try {
      await updateCourse(courseId, { foi_publicado: isChecked });
      toast({
        title: "Curso publicado com sucesso!",
        description: isChecked ? "Curso publicado e visível para alunos." : "Curso não publicado.",
      });
      queryClient.invalidateQueries(['courses']);
    } catch (error) {
      toast({
        title: "Erro ao publicar curso",
        description: "Ocorreu um erro ao tentar publicar o curso. Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400 animate-pulse" />
        <p className="mt-2 text-muted-foreground">Carregando seus cursos...</p>
      </div>
    );
  }

  if (filteredCourses.length === 0 && !searchQuery && !visibilityFilter) {
    return (
      <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-xl font-medium text-gray-900">Nenhum curso criado ainda</h3>
        <p className="mt-1 text-sm text-gray-500">Comece a compartilhar seu conhecimento!</p>
        <div className="mt-6">
          <Button onClick={handleCreateCourse}>
            <PlusCircle className="mr-2 h-4 w-4" /> Criar Seu Primeiro Curso
          </Button>
        </div>
      </div>
    );
  }
  
  if (filteredCourses.length === 0 && (searchQuery || visibilityFilter)) {
    return (
      <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
        <Filter className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-xl font-medium text-gray-900">Nenhum curso corresponde à sua busca</h3>
        <p className="mt-1 text-sm text-gray-500">Tente alterar seus filtros ou termo de busca.</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Filtros e Busca */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cursos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Tabs defaultValue="all" className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all" onClick={() => handleFilterChange('all')}>Todos</TabsTrigger>
            <TabsTrigger value="public" onClick={() => handleFilterChange('public')}>Públicos</TabsTrigger>
            <TabsTrigger value="private" onClick={() => handleFilterChange('private')}>Privados</TabsTrigger>
            <TabsTrigger value="paid" onClick={() => handleFilterChange('paid')}>Pagos</TabsTrigger>
            <TabsTrigger value="free" onClick={() => handleFilterChange('free')}>Gratuitos</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Lista de Cursos */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {filteredCourses.map((course) => {
          const hasImageLoadingError = imageLoadErrors.has(course.id);
          const canDisplayImage = course.url_imagem && course.url_imagem.trim() !== '' && !hasImageLoadingError;

          return (
            <Card key={course.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    {canDisplayImage ? (
                      <img 
                        src={course.url_imagem} 
                        alt={course.titulo} 
                        className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                        onError={() => handleImageError(course.id)}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-muted-foreground">
                        {hasImageLoadingError ? 
                          <AlertTriangle className="h-8 w-8 text-destructive" /> : 
                          <BookOpen className="h-8 w-8" />
                        }
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg truncate">{course.titulo}</CardTitle>
                      {hasImageLoadingError && (
                        <p className="text-xs text-destructive mt-1">Erro ao carregar imagem.</p>
                      )}
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant={course.eh_publico ? "outline" : "secondary"}>
                          {course.eh_publico ? 'Público' : 'Privado'}
                        </Badge>
                        <Badge variant={course.eh_pago ? "default" : "outline"}>
                          {course.eh_pago ? `R$${course.preco?.toFixed(2)}` : 'Gratuito'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button 
                      variant="outline" 
                      onClick={() => handleViewCourse(course.id)}
                      className="h-auto py-2 px-4"
                    >
                      <Eye className="mr-3 h-[30px] w-[30px] flex-shrink-0" /> Ver Curso
                    </Button>
                    <Button 
                      variant="default" 
                      asChild 
                    >
                      <Link to={`/mentor/cursos/${course.id}/editar`}>
                        <Edit2 className="mr-2 h-4 w-4" /> Editar
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center justify-between space-x-2 border p-3 rounded-md mb-4">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor={`publish-switch-${course.id}`} className="font-medium">
                      Publicar Curso
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {course.foi_publicado ? "Curso publicado e visível para alunos." : "Curso não publicado."}
                    </span>
                  </div>
                  <Switch
                    id={`publish-switch-${course.id}`}
                    checked={!!course.foi_publicado}
                    onCheckedChange={(isChecked) => handlePublishChange(course.id, isChecked)}
                  />
                </div>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Inscrições</span>
                    <span className="text-sm font-medium">{course.inscricoes?.[0]?.count || 0}</span>
                  </div>
                  <Progress 
                    value={course.inscricoes?.[0]?.count || 0} 
                    max={totalEnrollments > 0 ? totalEnrollments : 10}
                    className="h-2"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  variant="default" 
                  asChild
                >
                  <Link to={`/mentor/cursos/${course.id}/modulos`}>
                    <Layers className="mr-2 h-4 w-4" /> Gerenciar Módulos e Conteúdo
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CoursesList;
