
import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImageIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { CourseFormData } from "./FormSchema";
import { uploadCourseImage } from "@/utils/uploadImage";
import { Spinner } from "@/components/ui/spinner";

interface ImageFieldProps {
  form: UseFormReturn<CourseFormData>;
}

const ImageField = ({ form }: ImageFieldProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const imageUrl = await uploadCourseImage(file);
      form.setValue("image", imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      form.setError("image", {
        type: "manual",
        message: "Erro ao fazer upload da imagem. Tente novamente."
      });
    } finally {
      setIsUploading(false);
    }
  };

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
                accept="image/*"
                className="cursor-pointer"
                disabled={isUploading}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageUpload(e.target.files[0]);
                  }
                }}
              />
              
              {field.value ? (
                <div className="rounded-md border mt-2 overflow-hidden relative">
                  <img 
                    src={field.value} 
                    alt="Prévia do curso" 
                    className="h-48 w-full object-cover"
                  />
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Spinner className="w-8 h-8" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="border rounded-md flex items-center justify-center h-48 bg-muted mt-2">
                  <div className="flex flex-col items-center text-muted-foreground">
                    {isUploading ? (
                      <>
                        <Spinner className="w-8 h-8 mb-2" />
                        <span>Fazendo upload...</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-10 w-10 mb-2" />
                        <span>Tamanho sugerido: 1280x720px</span>
                      </>
                    )}
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
