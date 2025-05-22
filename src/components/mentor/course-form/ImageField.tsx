
import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImageIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { CourseFormData } from "./FormSchema";
import { uploadCourseImage } from "@/utils/uploadImage";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";

interface ImageFieldProps {
  form: UseFormReturn<CourseFormData>;
}

const ImageField = ({ form }: ImageFieldProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(form.getValues("image") || null);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      
      // Create a preview immediately for better UX
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
      
      // Get the existing image path from the URL if it exists
      const currentImageUrl = form.getValues("image");
      let existingPath = null;
      
      if (currentImageUrl) {
        // Extract the path from URL - assuming URL structure like https://...{bucket}/{path}
        const urlParts = currentImageUrl.split('/');
        existingPath = urlParts[urlParts.length - 1]; // Get the filename
      }
      
      // Upload new image, replacing the existing one if there is a path
      const result = await uploadCourseImage(file, existingPath);
      form.setValue("image", result.url);
      
      // Update preview with the actual URL from storage
      setPreviewImage(result.url);
      
      // Clean up the temporary object URL
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      // Reset preview if upload fails
      setPreviewImage(form.getValues("image") || null);
      
      toast({
        title: "Erro ao fazer upload da imagem",
        description: "Verifique se o bucket 'courses' existe no Supabase.",
        variant: "destructive"
      });
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
              
              {previewImage ? (
                <div className="rounded-md border mt-2 overflow-hidden relative">
                  <img 
                    src={previewImage} 
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
