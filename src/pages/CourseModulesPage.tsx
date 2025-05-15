
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";

// Form schema for creating a new module
const moduleFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  content_type: z.string(),
  is_free: z.boolean().default(false),
});

type ModuleFormValues = z.infer<typeof moduleFormSchema>;

// Function to fetch course details
async function getCourse(courseId: string) {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single();
  
  if (error) throw error;
  return data;
}

// Function to fetch course modules
async function getCourseModules(courseId: string) {
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .eq('course_id', courseId)
    .order('module_order', { ascending: true });
  
  if (error) throw error;
  return data;
}

export default function CourseModulesPage() {
  const { id: courseId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch course details
  const { data: course, isLoading: isLoadingCourse } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourse(courseId!),
    enabled: !!courseId,
  });

  // Fetch course modules
  const { data: modules = [], isLoading: isLoadingModules } = useQuery({
    queryKey: ['courseModules', courseId],
    queryFn: () => getCourseModules(courseId!),
    enabled: !!courseId,
  });

  // Form for creating a new module
  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleFormSchema),
    defaultValues: {
      title: "",
      content_type: "text",
      is_free: false,
    },
  });

  // Mutation for creating a new module
  const createModuleMutation = useMutation({
    mutationFn: async (values: ModuleFormValues) => {
      const { data, error } = await supabase
        .from('modules')
        .insert({
          course_id: courseId,
          title: values.title,
          content_type: values.content_type,
          is_free: values.is_free,
          module_order: modules.length,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseModules', courseId] });
      form.reset();
      setIsDialogOpen(false);
      toast({
        title: "Module Created",
        description: "Your new module has been created successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to create module. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  function onSubmit(values: ModuleFormValues) {
    createModuleMutation.mutate(values);
  }

  if (isLoadingCourse) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <p>Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Course Not Found</h2>
          <p className="mt-2 text-gray-600">The requested course could not be found.</p>
          <Button className="mt-4" onClick={() => navigate('/mentor/courses')}>
            Go Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <Link to="/mentor/courses" className="text-blue-600 hover:underline mb-2 block">
            &larr; Back to Courses
          </Link>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-gray-600 mt-1">Manage modules and lessons for this course</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/mentor/courses/${courseId}/edit`}>Edit Course</Link>
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Module
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Module</DialogTitle>
                <DialogDescription>
                  Add a new module to your course. You can add lessons to it later.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Module Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Introduction to the course" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="content_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a content type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="quiz">Quiz</SelectItem>
                            <SelectItem value="assignment">Assignment</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          This determines how the module content will be structured.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      disabled={createModuleMutation.isPending}
                    >
                      {createModuleMutation.isPending ? "Creating..." : "Create Module"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoadingModules ? (
        <div className="text-center py-10">
          <p>Loading modules...</p>
        </div>
      ) : modules.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
          <h2 className="text-xl font-medium mb-2">No Modules Yet</h2>
          <p className="text-gray-600 mb-4">Start creating modules to organize your course content.</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Your First Module
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {modules.map((module, index) => (
            <Card key={module.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex gap-2 items-center">
                      <CardTitle>{module.title}</CardTitle>
                      {module.is_free && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                          Free
                        </span>
                      )}
                    </div>
                    <CardDescription>
                      Content Type: {module.content_type.charAt(0).toUpperCase() + module.content_type.slice(1)}
                    </CardDescription>
                  </div>
                  <div className="text-sm text-gray-500">
                    Module {index + 1}
                  </div>
                </div>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link to={`/mentor/modules/${module.id}/lessons`}>
                    Manage Lessons
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
