
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MentoradoConfiguracoesPage = () => {
  const [profile, setProfile] = useState({
    full_name: "",
    bio: "",
    avatar_url: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (data) {
          setProfile({
            full_name: data.full_name || "",
            bio: data.bio || "",
            avatar_url: data.avatar_url || ""
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, []);
  
  const handleSave = async () => {
    try {
      setSaving(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro",
          description: "Usuário não encontrado",
          variant: "destructive"
        });
        return;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          bio: profile.bio,
          avatar_url: profile.avatar_url,
          updated_at: new Date()
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Perfil atualizado",
        description: "Suas configurações foram salvas com sucesso"
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar suas configurações",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className="p-8">Carregando configurações...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Configurações</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nome Completo</Label>
              <Input 
                id="full_name" 
                name="full_name"
                value={profile.full_name} 
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="avatar_url">URL da Foto de Perfil</Label>
              <Input 
                id="avatar_url" 
                name="avatar_url"
                value={profile.avatar_url} 
                onChange={handleChange}
                placeholder="https://exemplo.com/imagem.jpg"
              />
              {profile.avatar_url && (
                <div className="mt-2">
                  <img 
                    src={profile.avatar_url} 
                    alt="Avatar Preview" 
                    className="w-20 h-20 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Avatar";
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Biografia</Label>
              <Textarea 
                id="bio" 
                name="bio"
                value={profile.bio} 
                onChange={handleChange}
                rows={4}
                placeholder="Conte um pouco sobre você..."
              />
            </div>
            
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                value="" 
                disabled
                placeholder="seu@email.com"
              />
              <p className="text-xs text-muted-foreground">
                Para mudar seu email, entre em contato com o suporte.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Button variant="outline" className="w-full">
                Alterar Senha
              </Button>
            </div>
            
            <div className="pt-4 border-t">
              <Button variant="destructive">
                Excluir Conta
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MentoradoConfiguracoesPage;
