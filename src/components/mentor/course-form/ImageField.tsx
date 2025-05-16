
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImageIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { CourseFormData } from "./FormSchema";

interface ImageFieldProps {
  form: UseFormReturn<CourseFormData>;
}

const ImageField = ({ form }: ImageFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="image"
      render={({ field }) => (
        <FormItem className="mb-4">
          <FormLabel>Imagem do Curso*</FormLabel>
          <FormControl>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Input
                id="courseImage"
                type="file"
                className="cursor-pointer"
                onChange={(e) => {
                  // Em uma aplicação real, você faria upload e usaria a URL
                  if (e.target.files && e.target.files[0]) {
                    field.onChange(URL.createObjectURL(e.target.files[0]));
                  }
                }}
              />
              
              {field.value ? (
                <div className="rounded-md border mt-2 overflow-hidden">
                  <img 
                    src={field.value} 
                    alt="Prévia do curso" 
                    className="h-48 w-full object-cover"
                  />
                </div>
              ) : (
                <div className="border rounded-md flex items-center justify-center h-48 bg-muted mt-2">
                  <div className="flex flex-col items-center text-muted-foreground">
                    <ImageIcon className="h-10 w-10 mb-2" />
                    <span>Tamanho sugerido: 1280x720px</span>
                  </div>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ImageField;
