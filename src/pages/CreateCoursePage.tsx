
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

  const handleSubmit = async (formData: CourseFormData) => {
    setIsSubmitting(true);
    
    try {
      await createCourse(formData);
      
      toast({
        title: "Curso criado com sucesso!",
        description: "Seu curso foi criado e está pronto para ser configurado.",
      });
      
      navigate("/mentor/cursos");
    } catch (error) {
      console.error("Erro ao criar curso:", error);
      toast({
        title: "Erro ao criar curso",
        description: "Ocorreu um erro ao tentar criar o curso. Tente novamente.",
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
