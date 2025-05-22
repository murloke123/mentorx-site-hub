
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import MentorSidebar from "@/components/mentor/MentorSidebar";
import CoursesList from "@/components/mentor/CoursesList";
import { getMentorCourses, Course } from '@/services/courseService';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

const MeusCursosPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    setIsAuthLoading(true);
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setCurrentSession(initialSession);
      setIsAuthLoading(false);
      if (initialSession?.user?.id) {
        queryClient.invalidateQueries({ queryKey: ['mentorCourses', initialSession.user.id] });
      }
    }).catch((error) => {
      console.error("Error getting initial session:", error);
      setIsAuthLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      const oldUserId = currentSession?.user?.id;
      const newUserId = newSession?.user?.id;
      
      setCurrentSession(newSession);
      setIsAuthLoading(false);

      if (oldUserId !== newUserId) {
        queryClient.invalidateQueries({ queryKey: ['mentorCourses', oldUserId] });
        queryClient.invalidateQueries({ queryKey: ['mentorCourses', newUserId] });
      }
    });

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [queryClient]);

  const userId = currentSession?.user?.id;

  const { data: coursesData = [], isLoading: queryIsLoading, isFetching: queryIsFetching, isError, error } = useQuery<Course[]>({
    queryKey: ['mentorCourses', userId],
    queryFn: () => {
      if (!userId) return Promise.resolve([]);
      return getMentorCourses(userId);
    },
    enabled: !!userId && !isAuthLoading,
    staleTime: 1000 * 60 * 1,
    retry: 1,
  });

  useEffect(() => {
    if (isError && error) {
      console.error("Error fetching mentor courses:", error);
    }
  }, [isError, error]);

  const totalEnrollments = coursesData.reduce((sum, courseItem) => {
    const enrollmentCount = courseItem.enrollments?.[0]?.count;
    return sum + (typeof enrollmentCount === 'number' ? enrollmentCount : 0);
  }, 0);

  const handleCreateCourse = () => {
    navigate('/mentor/cursos/novo');
  };

  let listIsLoading = isAuthLoading;
  if (!isAuthLoading && !!userId) {
    listIsLoading = queryIsLoading || queryIsFetching;
  } else if (!isAuthLoading && !userId) {
    listIsLoading = false;
  }

  return (
    <div className="flex">
      <MentorSidebar />
      <div className="flex-1 p-6">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Meus Cursos</h1>
            <p className="text-muted-foreground">Gerencie seus cursos e acompanhe seu desempenho</p>
          </div>
          <Button onClick={handleCreateCourse}>
            <PlusCircle className="mr-2 h-4 w-4" /> Criar Novo Curso
          </Button>
        </div>
        
        {isError && (
          <div className="text-red-500 p-4 border border-red-500 rounded-md">
            <p>Ocorreu um erro ao carregar seus cursos:</p>
            <p className="text-sm">{error instanceof Error ? error.message : "Tente recarregar a página."}</p>
          </div>
        )}

        <CoursesList 
          courses={coursesData} 
          isLoading={listIsLoading} 
          totalEnrollments={totalEnrollments} 
        />
      </div>
    </div>
  );
};

export default MeusCursosPage;
