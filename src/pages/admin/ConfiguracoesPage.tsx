
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const AdminConfiguracoesPage = () => {
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    // Platform settings
    platformName: "MentorX",
    supportEmail: "suporte@mentorx.com",
    
    // Feature toggles
    enablePublicProfiles: true,
    enableMentorChat: true,
    requireEmailVerification: false,
    allowFreeTrials: true
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
  };
  
  const handleToggleChange = (field: string) => {
    setSettings({
      ...settings,
      [field]: !settings[field as keyof typeof settings]
    });
  };
  
  const handleSave = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Configurações salvas",
        description: "As configurações da plataforma foram atualizadas com sucesso."
      });
    }, 1000);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Configurações da Plataforma</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platformName">Nome da Plataforma</Label>
              <Input 
                id="platformName" 
                name="platformName"
                value={settings.platformName} 
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Email de Suporte</Label>
              <Input 
                id="supportEmail" 
                name="supportEmail"
                type="email"
                value={settings.supportEmail} 
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recursos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Perfis Públicos</h4>
                <p className="text-sm text-muted-foreground">
                  Permitir que perfis de mentores sejam visíveis publicamente
                </p>
              </div>
              <Switch 
                checked={settings.enablePublicProfiles} 
                onCheckedChange={() => handleToggleChange('enablePublicProfiles')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Chat com Mentores</h4>
                <p className="text-sm text-muted-foreground">
                  Habilitar funcionalidade de chat entre mentorados e mentores
                </p>
              </div>
              <Switch 
                checked={settings.enableMentorChat} 
                onCheckedChange={() => handleToggleChange('enableMentorChat')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Verificação de Email</h4>
                <p className="text-sm text-muted-foreground">
                  Exigir verificação de email antes de permitir login
                </p>
              </div>
              <Switch 
                checked={settings.requireEmailVerification} 
                onCheckedChange={() => handleToggleChange('requireEmailVerification')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Testes Gratuitos</h4>
                <p className="text-sm text-muted-foreground">
                  Permitir teste gratuito para cursos pagos
                </p>
              </div>
              <Switch 
                checked={settings.allowFreeTrials} 
                onCheckedChange={() => handleToggleChange('allowFreeTrials')}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  );
};

export default AdminConfiguracoesPage;
