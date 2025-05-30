import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Filter, PlusCircle, Search, Layers, Edit2, Eye, AlertTriangle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Course } from "@/types";
import { updateCoursePublicationStatus } from "@/services/courseService";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from '@/lib/utils';

interface CoursesListProps {
  courses: Course[];
  isLoading: boolean;
  totalEnrollments: number;
}

const CoursesList = ({ courses, isLoading, totalEnrollments }: CoursesListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<string | null>(null);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set());
  const [isUpdating, setIsUpdating] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Filtrar cursos com base na busca e filtro de visibilidade
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = visibilityFilter === null || 
                        (visibilityFilter === 'public' && course.is_public) ||
                        (visibilityFilter === 'private' && !course.is_public) ||
                        (visibilityFilter === 'paid' && course.is_paid) ||
                        (visibilityFilter === 'free' && !course.is_paid);
                        
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

  const handlePublishChange = async (courseId: string, newStatus: boolean) => {
    try {
      setIsUpdating(prev => new Set([...prev, courseId]));
      await updateCoursePublicationStatus(courseId, newStatus);
      
      toast({
        title: newStatus ? "Curso publicado" : "Curso despublicado",
        description: `O curso foi ${newStatus ? "publicado" : "despublicado"} com sucesso.`,
      });

      // Invalidate the query to refresh the courses list
      queryClient.invalidateQueries({ queryKey: ['mentorCourses'] });
    } catch (error) {
      console.error('Error updating course publication status:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status de publicação do curso.",
      });
    } finally {
      setIsUpdating(prev => {
        const next = new Set(prev);
        next.delete(courseId);
        return next;
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
          const canDisplayImage = course.image_url && course.image_url.trim() !== '' && !hasImageLoadingError;

          return (
            <Card key={course.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    {canDisplayImage ? (
                      <img 
                        src={course.image_url} 
                        alt={course.title} 
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
                      <CardTitle className="text-lg truncate">{course.title}</CardTitle>
                      {hasImageLoadingError && (
                        <p className="text-xs text-destructive mt-1">Erro ao carregar imagem.</p>
                      )}
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant={course.is_public ? "outline" : "secondary"}>
                          {course.is_public ? 'Público' : 'Privado'}
                        </Badge>
                        <Badge variant={course.is_paid ? "default" : "outline"}>
                          {course.is_paid ? `R$${course.price?.toFixed(2)}` : 'Gratuito'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button 
                      variant="outline" 
                      onClick={() => handleViewCourse(course.id)}
                      className="h-auto py-2 px-3"
                      size="sm"
                    >
                      <Eye className="mr-2 h-4 w-4" /> Ver Curso
                    </Button>
                    <Button 
                      variant="default" 
                      asChild
                      size="sm"
                    >
                      <Link to={`/mentor/cursos/${course.id}/editar`}>
                        <Edit2 className="mr-2 h-4 w-4" /> Editar
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Inscrições</span>
                    <span className="text-sm font-medium">{course.enrollments?.[0]?.count || 0}</span>
                  </div>
                  <Progress 
                    value={(course.enrollments?.[0]?.count || 0)}
                    className="w-full h-2" 
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`publish-${course.id}`}
                    checked={course.is_published}
                    onCheckedChange={(checked) => handlePublishChange(course.id, checked)}
                  />
                  <Label htmlFor={`publish-${course.id}`}>
                    {course.is_published ? "Publicado" : "Não Publicado"}
                  </Label>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate(`/mentor/cursos/${course.id}/modulos`)}
                >
                  Gerenciar Módulos e Conteúdos
                </Button>
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => navigate(`/mentor/cursos/${course.id}/landing-page`)}
                >
                  Página de Venda
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
