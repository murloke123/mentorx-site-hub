
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseForm from "@/components/mentor/CourseForm";
import MentorSidebar from "@/components/mentor/MentorSidebar";
import { useToast } from "@/hooks/use-toast";
import { createCourse, CourseFormData } from "@/services/courseService";

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (courseData: CourseFormData) => {
    setIsSubmitting(true);
    
    try {
      await createCourse(courseData);
      
      toast({
        title: "Curso criado com sucesso!",
        description: "Seu curso foi publicado na plataforma.",
      });
      
      // Redirecionar para a página de cursos após a criação
      navigate("/courses");
    } catch (error) {
      console.error("Erro ao criar curso:", error);
      toast({
        title: "Erro ao criar curso",
        description: "Ocorreu um erro ao tentar criar seu curso. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/mentor/dashboard");
  };

  return (
    <div className="flex">
      <MentorSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Criar Novo Curso</h1>
        
        <CourseForm 
          mode="create"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default CreateCoursePage;
