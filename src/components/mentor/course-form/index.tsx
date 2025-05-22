
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";

import { formSchema, defaultValues, CourseFormData } from "./FormSchema";
import BasicInfoFields from "./BasicInfoFields";
import VisibilityField from "./VisibilityField";
import ImageField from "./ImageField";
import CourseTypeField from "./CourseTypeField";
import PricingFields from "./PricingFields";

interface CourseFormProps {
  mode: "create" | "edit";
  initialData?: CourseFormData;
  onSubmit: (data: CourseFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const CourseForm = ({
  mode = "create",
  initialData = defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CourseFormProps) => {
  const [courseType, setCourseType] = useState<"free" | "paid">(initialData.type);
  
  const form = useForm<CourseFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const handleFormSubmit = (data: CourseFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <BasicInfoFields form={form} />
            <VisibilityField form={form} />
            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Publicar Curso</FormLabel>
                    <FormDescription>
                      Marque para tornar o curso visível para alunos na plataforma. Lembre-se: o curso precisa ter módulos e conteúdo para ser publicado.
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
            <ImageField form={form} />
            <CourseTypeField 
              form={form} 
              onTypeChange={(value) => setCourseType(value)} 
            />
            
            {courseType === "paid" && <PricingFields form={form} />}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : mode === "create" ? "Criar Curso" : "Salvar Alterações"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CourseForm;
