
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }).max(100, {
    message: "Title must not exceed 100 characters."
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).max(2000, {
    message: "Description must not exceed 2000 characters."
  }),
  is_public: z.boolean().default(true),
  is_paid: z.boolean().default(false),
  price: z.union([
    z.string().min(1, {
      message: "Please enter a valid price."
    }).transform(val => parseFloat(val)),
    z.number().min(0),
  ]).optional().transform(value => {
    if (!value) return null;
    return typeof value === 'string' ? parseFloat(value) : value;
  }),
  image_url: z.string().url({
    message: "Please enter a valid URL for the course image."
  }).optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditCoursePage() {
  const { id: courseId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      is_public: true,
      is_paid: false,
      price: undefined,
      image_url: "",
    },
  });

  const { watch, setValue, reset } = form;
  const isPaid = watch("is_paid");

  // Fetch course data
  useEffect(() => {
    async function fetchCourse() {
      if (!courseId) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("courses")
          .select("*")
          .eq("id", courseId)
          .single();

        if (error) throw error;
        
        if (data) {
          // Reset form with course data
          reset({
            title: data.title,
            description: data.description || "",
            is_public: data.is_public,
            is_paid: data.is_paid,
            price: data.price !== null ? data.price : undefined,
            image_url: data.image_url || "",
          });
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load course data. " + error.message,
          variant: "destructive",
        });
        navigate('/mentor/courses');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourse();
  }, [courseId, navigate, reset]);

  async function onSubmit(values: FormValues) {
    if (!courseId) return;
    
    setIsSubmitting(true);
    
    try {
      // Handle price if course is not paid
      if (!values.is_paid) {
        values.price = null;
      }

      // Update the course in Supabase
      const { error } = await supabase
        .from("courses")
        .update({
          title: values.title,
          description: values.description,
          is_public: values.is_public,
          is_paid: values.is_paid,
          price: values.price,
          image_url: values.image_url || null,
        })
        .eq("id", courseId);

      if (error) {
        throw error;
      }

      toast({
        title: "Course Updated",
        description: "Your course has been updated successfully!",
      });

      // Redirect to the course management page
      navigate(`/mentor/courses/${courseId}`);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to update course. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-3xl">
        <div className="text-center">
          <p>Loading course data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Edit Course</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Complete Web Development Bootcamp" {...field} />
                    </FormControl>
                    <FormDescription>
                      A clear and concise title helps students understand what your course is about.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe what students will learn in this course..." 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Be specific about what you'll teach and what students will achieve.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/course-image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      Add an image URL that represents your course (optional).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="is_public"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Public Course</FormLabel>
                        <FormDescription>
                          Make this course visible to everyone
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="is_paid"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Paid Course</FormLabel>
                        <FormDescription>
                          Charge students to enroll in this course
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              {isPaid && (
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Price ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="29.99" 
                          step="0.01" 
                          min="0" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Set the price students will pay to access your course.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <CardFooter className="flex justify-between px-0">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(`/mentor/courses/${courseId}`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
