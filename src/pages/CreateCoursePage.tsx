
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import CourseForm from "@/components/mentor/course-form";
import MentorSidebar from "@/components/mentor/MentorSidebar";
import { useToast } from "@/hooks/use-toast";
import { createCourse, CourseFormData } from "@/services/courseService";
import { supabase } from "@/integrations/supabase/client";

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues: CourseFormData = {
    name: "",
    description: "",
    image: "",
    category: "",
    type: "free",
    price: 0,
    currency: "BRL",
    discount: 0,
    visibility: "public",
    isPublished: false,
  };

  const handleSubmit = async (formData: CourseFormData) => {
    setIsSubmitting(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const newCourse = await createCourse(formData, user.id);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['publicCourses'] });
      queryClient.invalidateQueries({ queryKey: ['mentorCourses'] });
      
      toast({
        title: "Curso criado com sucesso!",
        description: "Seu curso foi criado e está disponível para edição.",
      });
      
      // Redirect to course edit page or courses list
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
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default CreateCoursePage;
