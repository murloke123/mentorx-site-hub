import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface RouteInfo {
  path: string;
  component: string;
  section: string;
  hasParams: boolean;
  referencedBy?: string[];
}

const RoutesVisualizationPage = () => {
  // Parse routes from App.tsx into a structured format
  const routes: RouteInfo[] = [
    // Rotas Públicas
    { path: "/", component: "HomePage", section: "Público", hasParams: false },
    { path: "/about", component: "AboutPage", section: "Público", hasParams: false },
    { path: "/courses", component: "CoursesPage", section: "Público", hasParams: false, referencedBy: ["Navigation"] },
    { path: "/login", component: "LoginPage", section: "Público", hasParams: false },
    
    // Rotas de Mentor
    { path: "/mentor/dashboard", component: "MentorDashboardPage", section: "Mentor", hasParams: false, referencedBy: ["MentorSidebar"] },
    { path: "/mentor/cursos", component: "MeusCursosPage", section: "Mentor", hasParams: false, referencedBy: ["MentorSidebar", "CoursesList"] },
    { path: "/mentor/cursos/novo", component: "CreateCoursePage", section: "Mentor", hasParams: false, referencedBy: ["CoursesList"] },
    { path: "/mentor/cursos/:id/editar", component: "EditCoursePage", section: "Mentor", hasParams: true, referencedBy: ["CoursesList"] },
    { path: "/mentor/cursos/view/:id", component: "CoursePlayerPage", section: "Mentor", hasParams: true, referencedBy: ["CoursesList"] },
    { path: "/mentor/cursos/:cursoId/modulos", component: "ModulosPage", section: "Mentor", hasParams: true, referencedBy: ["CoursesList", "ConteudosPage"] },
    { path: "/mentor/cursos/:cursoId/modulos/:moduloId", component: "ConteudosPage", section: "Mentor", hasParams: true, referencedBy: ["ModuloList"] },
    { path: "/mentor/followers", component: "MentorFollowersPage", section: "Mentor", hasParams: false, referencedBy: ["MentorSidebar"] },
    { path: "/mentor/mentorados", component: "MentorFollowersPage", section: "Mentor", hasParams: false, referencedBy: ["MentorSidebar"] },
    { path: "/mentor/configuracoes/rotas", component: "RoutesVisualizationPage", section: "Mentor", hasParams: false, referencedBy: ["MentorSidebar"] },
    
    // Rotas de Mentorado
    { path: "/mentorado/dashboard", component: "MentoradoDashboardPage", section: "Mentorado", hasParams: false, referencedBy: ["MentoradoSidebar"] },
    { path: "/mentorado/cursos", component: "NotFound", section: "Mentorado", hasParams: false, referencedBy: ["MentoradoSidebar"] },
    { path: "/mentorado/cursos/:id", component: "NotFound", section: "Mentorado", hasParams: true, referencedBy: ["EnrolledCoursesList"] },
    { path: "/mentorado/calendario", component: "NotFound", section: "Mentorado", hasParams: false, referencedBy: ["MentoradoSidebar"] },
    { path: "/mentorado/configuracoes", component: "NotFound", section: "Mentorado", hasParams: false, referencedBy: ["MentoradoSidebar"] },
    
    // Rotas de Administrador
    { path: "/admin/dashboard", component: "AdminDashboardPage", section: "Admin", hasParams: false, referencedBy: ["AdminSidebar"] },
    { path: "/admin/mentores", component: "AdminMentorsPage", section: "Admin", hasParams: false, referencedBy: ["AdminSidebar"] },
    { path: "/admin/mentors", component: "AdminMentorsPage", section: "Admin", hasParams: false, referencedBy: ["AdminSidebar"] },
    { path: "/admin/mentorados", component: "AdminMentoradosPage", section: "Admin", hasParams: false, referencedBy: ["AdminSidebar"] },
    { path: "/admin/cursos", component: "AdminCoursesPage", section: "Admin", hasParams: false, referencedBy: ["AdminSidebar"] },
    { path: "/admin/relatorios", component: "NotFound", section: "Admin", hasParams: false, referencedBy: ["AdminSidebar"] },
    { path: "/admin/configuracoes", component: "NotFound", section: "Admin", hasParams: false, referencedBy: ["AdminSidebar"] },
    
    // Rotas de Compatibilidade
    { path: "/mentor/courses/new", component: "CreateCoursePage", section: "Legado", hasParams: false },
    { path: "/mentor/courses/:id/edit", component: "EditCoursePage", section: "Legado", hasParams: true },
  ];

  // Group routes by section
  const sections = ["Público", "Mentor", "Mentorado", "Admin", "Legado"];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Visualização de Rotas</h1>
      <p className="text-gray-600 mb-6">Todas as rotas disponíveis na aplicação, organizadas por seção.</p>

      {sections.map((section) => (
        <Card key={section} className="mb-6 p-4">
          <h2 className="text-xl font-semibold mb-4">Rotas {section}</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Caminho</TableHead>
                <TableHead className="w-[200px]">Componente</TableHead>
                <TableHead className="w-[150px]">Status</TableHead>
                <TableHead>Referenciado por</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes
                .filter((route) => route.section === section)
                .map((route, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono">{route.path}</TableCell>
                    <TableCell>{route.component}</TableCell>
                    <TableCell>
                      {route.component === "NotFound" ? (
                        <Badge variant="destructive">Não Implementado</Badge>
                      ) : route.hasParams ? (
                        <Badge variant="secondary">Parâmetros Dinâmicos</Badge>
                      ) : (
                        <Badge variant="default">Ativo</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {route.referencedBy ? (
                        <div className="flex flex-wrap gap-2">
                          {route.referencedBy.map((component, i) => (
                            <Badge key={i} variant="outline" className="bg-gray-50">
                              {component}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">Nenhuma referência direta</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Card>
      ))}
    </div>
  );
};

export default RoutesVisualizationPage; 