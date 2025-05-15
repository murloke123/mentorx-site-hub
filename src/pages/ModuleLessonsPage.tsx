
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
import { Textarea } from '@/components/ui/textarea';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, File, Video, FileText, Image } from "lucide-react";

// Form schema for creating a new lesson
const lessonFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  type: z.enum(["text", "video", "pdf", "image"]),
  content: z.string().optional(),
  file_url: z.string().optional(),
});

type LessonFormValues = z.infer<typeof lessonFormSchema>;

// Function to fetch module details
async function getModule(moduleId: string) {
  const { data, error } = await supabase
    .from('modules')
    .select('*, courses(*)')
    .eq('id', moduleId)
    .single();
  
  if (error) throw error;
  return data;
}

// Function to fetch module lessons
async function getModuleLessons(moduleId: string) {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('module_id', moduleId)
    .order('lesson_order', { ascending: true });
  
  if (error) throw error;
  return data;
}

// Helper function to get the appropriate icon for a lesson type
const getLessonIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return <File className="h-4 w-4" />;
    case 'video':
      return <Video className="h-4 w-4" />;
    case 'text':
      return <FileText className="h-4 w-4" />;
    case 'image':
      return <Image className="h-4 w-4" />;
    default:
      return <File className="h-4 w-4" />;
  }
};

export default function ModuleLessonsPage() {
  const { id: moduleId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('text');
  
  // Fetch module details
  const { data: module, isLoading: isLoadingModule } = useQuery({
    queryKey: ['module', moduleId],
    queryFn: () => getModule(moduleId!),
    enabled: !!moduleId,
  });

  // Fetch module lessons
  const { data: lessons = [], isLoading: isLoadingLessons } = useQuery({
    queryKey: ['moduleLessons', moduleId],
    queryFn: () => getModuleLessons(moduleId!),
    enabled: !!moduleId,
  });

  // Form for creating a new lesson
  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: {
      title: "",
      type: "text",
      content: "",
      file_url: "",
    },
  });

  // Reset content or file_url when type changes
  const watchType = form.watch("type");
  
  // Update form values when type changes
  const onTabChange = (value: string) => {
    setActiveTab(value);
    form.setValue("type", value as "text" | "video" | "pdf" | "image");
    
    // Reset fields based on new type
    if (value === 'text') {
      form.setValue("file_url", "");
    } else {
      form.setValue("content", "");
    }
  };

  // Mutation for creating a new lesson
  const createLessonMutation = useMutation({
    mutationFn: async (values: LessonFormValues) => {
      const { data, error } = await supabase
        .from('lessons')
        .insert({
          module_id: moduleId,
          title: values.title,
          type: values.type,
          content: values.type === 'text' ? values.content : null,
          file_url: values.type !== 'text' ? values.file_url : null,
          lesson_order: lessons.length,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moduleLessons', moduleId] });
      form.reset({
        title: "",
        type: activeTab as "text" | "video" | "pdf" | "image",
        content: "",
        file_url: "",
      });
      setIsDialogOpen(false);
      toast({
        title: "Lesson Created",
        description: "Your new lesson has been created successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to create lesson. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  function onSubmit(values: LessonFormValues) {
    createLessonMutation.mutate(values);
  }

  if (isLoadingModule) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <p>Loading module details...</p>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Module Not Found</h2>
          <p className="mt-2 text-gray-600">The requested module could not be found.</p>
          <Button className="mt-4" onClick={() => navigate('/mentor/courses')}>
            Go Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link to={`/mentor/courses/${module.course_id}`} className="text-blue-600 hover:underline mb-2 block">
          &larr; Back to {module.courses.title}
        </Link>
        <h1 className="text-3xl font-bold">{module.title}</h1>
        <p className="text-gray-600 mt-1">Manage lessons for this module</p>
      </div>

      <div className="flex justify-end mb-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Lesson
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Lesson</DialogTitle>
              <DialogDescription>
                Add a new lesson to your module.
              </DialogDescription>
            </DialogHeader>
            <Tabs value={activeTab} onValueChange={onTabChange} className="mt-2">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="text">Text</TabsTrigger>
                <TabsTrigger value="video">Video</TabsTrigger>
                <TabsTrigger value="pdf">PDF</TabsTrigger>
                <TabsTrigger value="image">Image</TabsTrigger>
              </TabsList>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lesson Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Introduction to React" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <TabsContent value="text">
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter lesson content here..." 
                              className="min-h-[200px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Use text formatting to make your content more engaging.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  {["video", "pdf", "image"].map((type) => (
                    <TabsContent key={type} value={type}>
                      <FormField
                        control={form.control}
                        name="file_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{type.charAt(0).toUpperCase() + type.slice(1)} URL</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder={`Enter ${type} URL...`} 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              {type === 'video' 
                                ? 'Enter a YouTube or Vimeo URL.' 
                                : `Enter a URL to your ${type} file.`}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  ))}
                  
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      disabled={createLessonMutation.isPending}
                    >
                      {createLessonMutation.isPending ? "Creating..." : "Create Lesson"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {isLoadingLessons ? (
        <div className="text-center py-10">
          <p>Loading lessons...</p>
        </div>
      ) : lessons.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
          <h2 className="text-xl font-medium mb-2">No Lessons Yet</h2>
          <p className="text-gray-600 mb-4">Start creating lessons to fill your module with content.</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Your First Lesson
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {lessons.map((lesson, index) => (
            <Card key={lesson.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-full">
                      {getLessonIcon(lesson.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{lesson.title}</CardTitle>
                      <CardDescription>
                        {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)} lesson
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Lesson {index + 1}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                {lesson.type === 'text' && lesson.content ? (
                  <div className="text-sm bg-muted p-2 rounded max-h-20 overflow-hidden">
                    {lesson.content.length > 150 
                      ? `${lesson.content.substring(0, 150)}...` 
                      : lesson.content}
                  </div>
                ) : lesson.file_url && (
                  <div className="text-sm text-blue-600 truncate">
                    {lesson.file_url}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm">
                    Preview
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
