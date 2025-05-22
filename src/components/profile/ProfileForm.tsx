
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Camera, User as UserIcon } from "lucide-react";
import { uploadImage } from "@/utils/uploadImage";
import { Spinner } from "@/components/ui/spinner";

interface ProfileData {
  id: string;
  full_name?: string | null;
  bio?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  email?: string | null;
  role?: string;
}

const profileSchema = z.object({
  full_name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  bio: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: User | null;
  profileData: ProfileData | null;
  onProfileUpdate?: () => void;
}

const ProfileForm = ({ user, profileData, onProfileUpdate }: ProfileFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null | undefined>(
    profileData?.avatar_url
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentAvatarPath, setCurrentAvatarPath] = useState<string | null>(null);

  // Extract path from URL
  const extractPathFromUrl = (url: string | null): string | null => {
    if (!url) return null;
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1].split('?')[0]; // Get filename and remove query params
  };

  // Initialize currentAvatarPath from profileData
  React.useEffect(() => {
    if (profileData?.avatar_url) {
      setCurrentAvatarPath(extractPathFromUrl(profileData.avatar_url));
    }
  }, [profileData]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profileData?.full_name || "",
      bio: profileData?.bio || "",
      phone: profileData?.phone || "",
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setAvatarFile(file);
      
      // Create a preview immediately for better UX
      const objectUrl = URL.createObjectURL(file);
      setAvatarUrl(objectUrl);
      
      // Start upload in background
      setIsUploading(true);
      
      try {
        // Upload new avatar, replacing the existing one if there is a path
        const result = await uploadImage(file, 'avatars', currentAvatarPath);
        
        // Update avatar URL with the new one from storage
        setAvatarUrl(result.url);
        setCurrentAvatarPath(result.path);
        
        // Clean up the temporary object URL
        URL.revokeObjectURL(objectUrl);
      } catch (error) {
        console.error("Error uploading avatar:", error);
        
        // Reset preview if upload fails
        setAvatarUrl(profileData?.avatar_url || null);
        
        toast({
          variant: "destructive",
          title: "Erro ao fazer upload da imagem",
          description: "Verifique se o bucket 'avatars' existe no Supabase.",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user?.id) return;

    setIsLoading(true);

    try {
      // Update profile with new data and avatar URL
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: data.full_name,
          bio: data.bio,
          phone: data.phone,
          avatar_url: avatarUrl,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });

      if (onProfileUpdate) {
        onProfileUpdate();
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar seu perfil. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Meu Perfil</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary/20 flex items-center justify-center bg-muted">
              {avatarUrl ? (
                <div className="relative w-full h-full">
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    key={`avatar-${Date.now()}`} // Force re-render of image
                  />
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Spinner className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
              ) : (
                <UserIcon className="h-16 w-16 text-muted-foreground" />
              )}
            </div>
            <label 
              htmlFor="avatar-upload" 
              className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
            >
              <Camera className="h-4 w-4" />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
          </div>
          
          {profileData?.email && (
            <div className="text-center mb-4">
              <p className="font-medium text-muted-foreground">{profileData.email}</p>
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mt-1">
                {profileData.role === "mentor" ? "Mentor" : 
                 profileData.role === "admin" ? "Administrador" : "Mentorado"}
              </span>
            </div>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Seu nome completo" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biografia</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Conte um pouco sobre você"
                      className="resize-none"
                      rows={5}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Seu telefone"
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading || isUploading}>
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
