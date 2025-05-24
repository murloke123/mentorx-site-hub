
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCourse } from '@/services/courseService';
import { supabase } from '@/integrations/supabase/client';
import CourseForm from '@/components/mentor/course-form';
import { CourseFormData, defaultValues } from '@/components/mentor/course-form/FormSchema';
import MentorSidebar from '@/components/mentor/MentorSidebar';

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: CourseFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Você precisa estar autenticado para criar um curso.");
      }
      
      const newCourse = await createCourse({...formData}, user.id);
      navigate(`/mentor/cursos/${newCourse.id}/modulos`);
    } catch (err: any) {
      console.error('Erro ao criar curso:', err);
      setError(err.message || "Ocorreu um erro ao criar o curso. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/mentor/cursos");
  };

  return (
    <div className="flex min-h-screen">
      <MentorSidebar />
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Criar Novo Curso</h1>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
              <h3 className="font-medium">Erro</h3>
              <p>{error}</p>
            </div>
          )}
          
          <CourseForm 
            mode="create"
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            initialValues={defaultValues}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateCoursePage;
