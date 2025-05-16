
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CourseForm from "@/components/mentor/course-form";
import MentorSidebar from "@/components/mentor/MentorSidebar";
import { useToast } from "@/hooks/use-toast";
import { getCourseById, updateCourse, CourseFormData } from "@/services/courseService";
import { Skeleton } from "@/components/ui/skeleton";

const EditCoursePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [courseData, setCourseData] = useState<CourseFormData | null>(null);

  useEffect(() => {
    const loadCourse = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await getCourseById(id);
        setCourseData(data);
      } catch (error) {
        console.error("Erro ao carregar curso:", error);
        toast({
          title: "Erro ao carregar curso",
          description: "Não foi possível obter os dados do curso.",
          variant: "destructive",
        });
        navigate("/mentor/cursos");
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, [id, navigate, toast]);

  const handleSubmit = async (formData: CourseFormData) => {
    if (!id) return;
    
    setIsSubmitting(true);
    
    try {
      await updateCourse(id, formData);
      
      toast({
        title: "Curso atualizado com sucesso!",
        description: "As alterações foram salvas.",
      });
      
      navigate("/mentor/cursos");
    } catch (error) {
      console.error("Erro ao atualizar curso:", error);
      toast({
        title: "Erro ao atualizar curso",
        description: "Ocorreu um erro ao tentar salvar as alterações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/mentor/cursos");
  };

  return (
    <div className="flex">
      <MentorSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Editar Curso</h1>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-2/3" />
          </div>
        ) : courseData ? (
          <CourseForm 
            mode="edit"
            initialData={courseData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        ) : (
          <div className="text-center py-10">
            <p className="text-lg text-red-500">
              Curso não encontrado ou você não tem permissão para editá-lo.
            </p>
            <button 
              onClick={() => navigate("/mentor/cursos")}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
            >
              Voltar para Meus Cursos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditCoursePage;
