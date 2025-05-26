
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import CourseForm from "@/components/mentor/course-form";
import MentorSidebar from "@/components/mentor/MentorSidebar";
import { useToast } from "@/hooks/use-toast";
import { createCourse, CourseFormData } from "@/services/courseService";

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues: CourseFormData = {
    description: "",
    image_url: "",
    category: "",
    is_public: true,
    is_paid: false,
    price: 0,
    discount: 0,
    discounted_price: 0,
    is_published: false,
  };

  const handleSubmit = async (formData: CourseFormData) => {
    setIsSubmitting(true);
    console.log("Enviando formulário:", formData);
    
    try {
      const newCourse = await createCourse(formData);
      
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
