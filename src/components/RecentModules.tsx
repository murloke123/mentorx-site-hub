
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit3, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getMentorModules, Module } from "@/services/mentorService";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const RecentModules = () => {
  const { data: modules, isLoading } = useQuery({
    queryKey: ['mentorModules'],
    queryFn: () => getMentorModules(5),
  });

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Recent Modules</CardTitle>
          <CardDescription>
            Your latest course modules
          </CardDescription>
        </div>
        <Button size="sm" variant="outline" asChild>
          <Link to="/mentor/modules/new">
            <Plus className="mr-1 h-4 w-4" /> Add New
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center p-6">
            <p className="text-muted-foreground">Loading modules...</p>
          </div>
        ) : modules && modules.length > 0 ? (
          <div>
            {modules.map((module) => (
              <div 
                key={module.id} 
                className="flex items-center justify-between border-b p-4 last:border-0 hover:bg-muted/50"
              >
                <div className="space-y-1">
                  <p className="font-medium leading-none">{module.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {module.cursos ? module.cursos.title : 'Curso não encontrado'} • {formatDate(module.created_at)}
                  </p>
                </div>
                <div className="flex space-x-1">
                  <Button size="icon" variant="ghost" asChild>
                    <Link to={`/mentor/modules/${module.id}/lessons`}>
                      <Plus className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="icon" variant="ghost" asChild>
                    <Link to={`/mentor/modules/${module.id}/edit`}>
                      <Edit3 className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="icon" variant="ghost" asChild>
                    <Link to={`/mentor/modules/${module.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6">
            <p className="mb-2 text-muted-foreground">No modules created yet</p>
            <Button size="sm" asChild>
              <Link to="/mentor/courses/new">
                <Plus className="mr-1 h-4 w-4" /> Create Your First Course
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentModules;
