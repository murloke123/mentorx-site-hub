
import { supabase } from '@/integrations/supabase/client';

export const getAdminProfile = async () => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session?.user) throw new Error('Usuário não autenticado');

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.session.user.id)
    .eq('role', 'admin')
    .single();

  if (error) {
    console.error('Erro ao buscar perfil de administrador:', error);
    throw error;
  }

  return data;
};

export const getAllMentors = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      courses: courses(count),
      followers: mentor_followers(count)
    `)
    .eq('role', 'mentor');

  if (error) {
    console.error('Erro ao buscar mentores:', error);
    throw error;
  }

  return data.map(mentor => ({
    ...mentor,
    courses_count: mentor.courses?.[0]?.count || 0,
    followers_count: mentor.followers?.[0]?.count || 0
  }));
};

export const getAllMentorees = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      enrollments: enrollments(count)
    `)
    .eq('role', 'mentorado');

  if (error) {
    console.error('Erro ao buscar mentorados:', error);
    throw error;
  }

  return data.map(mentoree => ({
    ...mentoree,
    enrollments_count: mentoree.enrollments?.[0]?.count || 0
  }));
};

export const getAllCourses = async () => {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      mentor:mentor_id (
        id,
        full_name
      ),
      enrollments: enrollments(count)
    `);

  if (error) {
    console.error('Erro ao buscar cursos:', error);
    throw error;
  }

  return data.map(course => ({
    ...course,
    mentor_name: course.mentor?.full_name,
    enrollments_count: course.enrollments?.[0]?.count || 0
  }));
};

export const getPlatformStats = async () => {
  // Buscar contagem de mentores
  const { count: mentorsCount, error: mentorsError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'mentor');

  if (mentorsError) {
    console.error('Erro ao contar mentores:', mentorsError);
    throw mentorsError;
  }

  // Buscar contagem de mentorados
  const { count: mentoreesCount, error: mentoreesError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'mentorado');

  if (mentoreesError) {
    console.error('Erro ao contar mentorados:', mentoreesError);
    throw mentoreesError;
  }

  // Buscar contagem de cursos
  const { count: coursesCount, error: coursesError } = await supabase
    .from('courses')
    .select('*', { count: 'exact', head: true });

  if (coursesError) {
    console.error('Erro ao contar cursos:', coursesError);
    throw coursesError;
  }

  // Buscar contagem de matrículas
  const { count: enrollmentsCount, error: enrollmentsError } = await supabase
    .from('enrollments')
    .select('*', { count: 'exact', head: true });

  if (enrollmentsError) {
    console.error('Erro ao contar matrículas:', enrollmentsError);
    throw enrollmentsError;
  }

  return {
    mentorsCount: mentorsCount || 0,
    mentoreesCount: mentoreesCount || 0,
    coursesCount: coursesCount || 0,
    enrollmentsCount: enrollmentsCount || 0
  };
};

export const deleteCourse = async (courseId: string) => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session?.user) throw new Error('Usuário não autenticado');

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.session.user.id)
    .eq('role', 'admin')
    .single();

  if (!adminProfile) {
    throw new Error('Permissão negada: apenas administradores podem excluir cursos');
  }

  // Buscar informações do curso antes de excluir
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single();

  // Excluir o curso
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', courseId);

  if (error) {
    console.error('Erro ao excluir curso:', error);
    throw error;
  }

  // Registrar a ação do administrador
  await supabase
    .from('admin_actions')
    .insert({
      admin_id: session.session.user.id,
      action_type: 'delete',
      target_type: 'course',
      target_id: courseId,
      details: course
    });

  return { success: true };
};

export const deleteUser = async (userId: string) => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session?.user) throw new Error('Usuário não autenticado');

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.session.user.id)
    .eq('role', 'admin')
    .single();

  if (!adminProfile) {
    throw new Error('Permissão negada: apenas administradores podem excluir usuários');
  }

  // Buscar informações do usuário antes de excluir
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (!userProfile) {
    throw new Error('Usuário não encontrado');
  }

  // Não permitir que um administrador exclua a si mesmo
  if (userId === session.session.user.id) {
    throw new Error('Não é possível excluir sua própria conta');
  }

  // Registrar a ação do administrador antes de excluir o usuário
  await supabase
    .from('admin_actions')
    .insert({
      admin_id: session.session.user.id,
      action_type: 'delete',
      target_type: 'user',
      target_id: userId,
      details: userProfile
    });

  // Excluir o usuário do Supabase Auth (isso também excluirá o perfil devido à restrição de chave estrangeira CASCADE)
  // NOTA: Esta operação requer permissões administrativas diretas na API do Supabase
  // Na prática, você precisaria criar uma função de borda (Edge Function) para fazer isso
  // Neste exemplo, estamos apenas simulando a exclusão removendo o perfil
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);

  if (error) {
    console.error('Erro ao excluir usuário:', error);
    throw error;
  }

  return { success: true };
};
