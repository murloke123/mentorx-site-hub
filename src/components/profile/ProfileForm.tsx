
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Info } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProfileData {
  id: string;
  full_name?: string | null;
  bio?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  email?: string | null;
  role?: string;
  highlight_message?: string | null;
  sm_tit1?: string | null;
  sm_desc1?: string | null;
  sm_tit2?: string | null;
  sm_desc2?: string | null;
  sm_tit3?: string | null;
  sm_desc3?: string | null;
}

const profileSchema = z.object({
  full_name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  bio: z.string().optional().nullable(),
  highlight_message: z.string().max(120, "Máximo de 120 caracteres").optional().nullable(),
  sm_tit1: z.string().optional().nullable(),
  sm_desc1: z.string().optional().nullable(),
  sm_tit2: z.string().optional().nullable(),
  sm_desc2: z.string().optional().nullable(),
  sm_tit3: z.string().optional().nullable(),
  sm_desc3: z.string().optional().nullable(),
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

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profileData?.full_name || "",
      bio: profileData?.bio || "",
      highlight_message: profileData?.highlight_message || "",
      sm_tit1: profileData?.sm_tit1 || "Resultados Comprovados",
      sm_desc1: profileData?.sm_desc1 || "Mais de 1.250 vidas transformadas com metodologias testadas e aprovadas.",
      sm_tit2: profileData?.sm_tit2 || "Metodologia Exclusiva",
      sm_desc2: profileData?.sm_desc2 || "Sistema proprietário desenvolvido ao longo de 15 anos de experiência.",
      sm_tit3: profileData?.sm_tit3 || "ROI Garantido",
      sm_desc3: profileData?.sm_desc3 || "Investimento retorna em até 90 dias ou seu dinheiro de volta.",
    },
  });

  const highlightMessage = form.watch("highlight_message");
  const highlightMessageLength = highlightMessage?.length || 0;

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user?.id) return;

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: data.full_name,
          bio: data.bio,
          highlight_message: data.highlight_message,
          sm_tit1: data.sm_tit1,
          sm_desc1: data.sm_desc1,
          sm_tit2: data.sm_tit2,
          sm_desc2: data.sm_desc2,
          sm_tit3: data.sm_tit3,
          sm_desc3: data.sm_desc3,
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
    <TooltipProvider>
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
            name="highlight_message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Mensagem de Destaque
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-blue-500" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Aqui você pode colocar uma mensagem de destaque para seu público vinculada ao seu perfil</p>
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ex: Mentor especializado em transformar vidas através de finanças e tecnologia"
                    value={field.value || ""}
                    maxLength={120}
                  />
                </FormControl>
                <div className="text-sm text-gray-500 text-right">
                  {highlightMessageLength}/120 caracteres
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Sobre mim
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-blue-500" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-md">
                      <p>Aqui você pode contar um pouco da sua história ou sua trajetória, tente separar os textos corretamente, deixar organizado, aqui que o seu público te conhece melhor, suas experiências de vida, suas conquistas, seu currículo, etc. Traga algo que seja interessante para te conhecerem e porque seria bom te seguir, um motivo por exemplo, para quem te seguir terá algum conteúdo gratuito ou exclusividade para seguidores.</p>
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
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

          <div className="mt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 font-medium">
                💡 <strong>Dica:</strong> Você pode personalizar os títulos e descrições das caixas abaixo para destacar seus principais diferenciais como mentor.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border-l-4 border-purple-500">
                <h3 className="text-lg font-semibold mb-4 text-purple-700">Caixa 1 (Roxa)</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sm_tit1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sm_desc1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-l-4 border-green-500">
                <h3 className="text-lg font-semibold mb-4 text-green-700">Caixa 2 (Verde)</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sm_tit2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sm_desc2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border-l-4 border-orange-500">
                <h3 className="text-lg font-semibold mb-4 text-orange-700">Caixa 3 (Laranja)</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sm_tit3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sm_desc3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </Form>
    </TooltipProvider>
  );
};

export default ProfileForm;
