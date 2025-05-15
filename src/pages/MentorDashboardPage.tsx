import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { Users, BookOpen, DollarSign, PlusCircle, Edit3, Trash2, Eye } from 'lucide-react'; // Ícones

// --- Dados Mockados (Substituir com dados reais do Supabase depois) ---
const mockMentorStats = {
  followers: 15,
  coursesCreated: 3,
  totalEnrollments: 48,
  totalRevenue: 1250.75, // Exemplo se houver cursos pagos
};

const mockMentorCourses = [
  {
    id: 'course1',
    title: 'Introdução ao Desenvolvimento Web Moderno',
    enrollments: 25,
    modules: 5,
    progressPreview: [ // Exemplo de progresso de alguns alunos
      { studentName: 'Mentorado Alfa', progress: 60 },
      { studentName: 'Mentorado Beta', progress: 100 },
      { studentName: 'Mentorado Gama', progress: 20 },
    ],
    isPublic: true,
    isPaid: false,
  },
  {
    id: 'course2',
    title: 'Design Thinking para Inovadores',
    enrollments: 10,
    modules: 8,
    progressPreview: [
      { studentName: 'Mentorado Delta', progress: 80 },
    ],
    isPublic: true,
    isPaid: true,
    price: 49.90,
  },
  {
    id: 'course3',
    title: 'Masterclass de Produtividade Pessoal',
    enrollments: 13,
    modules: 4,
    progressPreview: [],
    isPublic: false, // Exemplo de curso privado
    isPaid: true,
    price: 29.99,
  },
];
// --- Fim dos Dados Mockados ---

const MentorDashboardPage = () => {
  // No futuro, você usará hooks como useEffect e useState para buscar dados do Supabase
  // Ex: const [stats, setStats] = useState(null);
  // Ex: const [courses, setCourses] = useState([]);

  // const { user } = supabase.auth.getUser(); // Para pegar o ID do mentor logado

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard do Mentor</h1>
        <p className="text-gray-600">Bem-vindo(a) de volta! Gerencie seus cursos e mentorados.</p>
      </div>

      {/* Seção de Estatísticas */}
      <section className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seguidores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMentorStats.followers}</div>
            <p className="text-xs text-muted-foreground">Pessoas que seguem seu perfil</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos Criados</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMentorStats.coursesCreated}</div>
            <p className="text-xs text-muted-foreground">Total de cursos na plataforma</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMentorStats.totalEnrollments}</div>
            <p className="text-xs text-muted-foreground">Matrículas em todos os seus cursos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita (Exemplo)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {mockMentorStats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Baseado em cursos pagos</p>
          </CardContent>
        </Card>
      </section>

      {/* Seção de Cursos */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Meus Cursos</h2>
          <Link to="/mentor/courses/new"> {/* Rota para criar novo curso */}
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Criar Novo Curso
            </Button>
          </Link>
        </div>

        {mockMentorCourses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {mockMentorCourses.map((course) => (
              <Card key={course.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>
                        {course.enrollments} aluno(s) • {course.modules} módulos • {course.isPublic ? 'Público' : 'Privado'} {course.isPaid ? `• R$${course.price?.toFixed(2)}` : '• Gratuito'}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                       {/* Links/Botões para ações do curso */}
                       <Link to={`/mentor/courses/${course.id}/edit`}>
                        <Button variant="outline" size="icon" title="Editar Curso">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link to={`/mentor/courses/${course.id}/students`}>
                        <Button variant="outline" size="icon" title="Ver Alunos">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      {/* <Button variant="destructive" size="icon" title="Excluir Curso" onClick={() => alert('Implementar exclusão')}>
                        <Trash2 className="h-4 w-4" />
                      </Button> */}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground mb-2">Progresso de alguns alunos (exemplo):</p>
                  {course.progressPreview.length > 0 ? (
                    <ul className="space-y-2">
                      {course.progressPreview.slice(0, 2).map((student, index) => ( // Mostrar apenas 2 para não poluir
                        <li key={index} className="text-sm">
                          <div className="flex justify-between mb-1">
                            <span>{student.studentName}</span>
                            <span>{student.progress}%</span>
                          </div>
                          <Progress value={student.progress} className="h-2" />
                        </li>
                      ))}
                       {course.progressPreview.length > 2 && <li className="text-xs text-muted-foreground text-center">E mais...</li>}
                    </ul>
                  ) : (
                    <p className="text-sm text-center text-gray-500 italic">Nenhum aluno iniciou este curso ainda.</p>
                  )}
                </CardContent>
                <div className="p-6 pt-0"> 
                  <Link to={`/courses/${course.id}`} className="w-full"> {/* Link para a página pública do curso */}
                    <Button variant="outline" className="w-full">Ver Página do Curso</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-xl font-medium text-gray-900">Nenhum curso criado ainda</h3>
            <p className="mt-1 text-sm text-gray-500">Comece a compartilhar seu conhecimento!</p>
            <div className="mt-6">
              <Link to="/mentor/courses/new">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> Criar Seu Primeiro Curso
                </Button>
              </Link>
            </div>
          </div>
        )}
      </section>
      {/* Você pode adicionar mais seções aqui, como "Próximas Mentorias Agendadas", "Notificações", etc. */}
    </div>
  );
};

export default MentorDashboardPage;
