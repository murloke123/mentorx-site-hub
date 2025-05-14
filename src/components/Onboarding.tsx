
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface OnboardingProps {
  open: boolean;
  onComplete: () => void;
}

const Onboarding = ({ open, onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"mentor" | "mentee" | null>(null);
  const [userInfo, setUserInfo] = useState({
    name: "",
    bio: "",
    areas: [] as string[],
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-xl">
                Passo 1: Escolha seu perfil
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6">
              <div 
                className={`border rounded-lg p-6 text-center cursor-pointer transition-all ${
                  role === "mentor" ? "border-primary bg-primary/5" : "hover:bg-gray-50"
                }`}
                onClick={() => setRole("mentor")}
              >
                <div className="text-3xl mb-2">👨‍🏫</div>
                <h3 className="font-medium text-lg mb-2">Mentor</h3>
                <p className="text-sm text-gray-600">
                  Quero compartilhar meu conhecimento e mentorar outras pessoas
                </p>
              </div>
              <div 
                className={`border rounded-lg p-6 text-center cursor-pointer transition-all ${
                  role === "mentee" ? "border-primary bg-primary/5" : "hover:bg-gray-50"
                }`}
                onClick={() => setRole("mentee")}
              >
                <div className="text-3xl mb-2">📚</div>
                <h3 className="font-medium text-lg mb-2">Mentorado</h3>
                <p className="text-sm text-gray-600">
                  Quero aprender e ser mentorado por especialistas
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleNext} disabled={!role}>
                Próximo
              </Button>
            </DialogFooter>
          </>
        );
      case 2:
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-xl">
                Passo 2: Complete seu perfil
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input 
                  id="name" 
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                  placeholder="Seu nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  value={userInfo.bio}
                  onChange={(e) => setUserInfo({...userInfo, bio: e.target.value})}
                  placeholder="Conte um pouco sobre você, sua experiência e interesses"
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="areas">Áreas de interesse (separadas por vírgula)</Label>
                <Input
                  id="areas"
                  placeholder="Ex: Marketing Digital, Finanças, Desenvolvimento Pessoal"
                  onChange={(e) => setUserInfo({
                    ...userInfo, 
                    areas: e.target.value.split(",").map(area => area.trim()).filter(Boolean)
                  })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleNext}>
                Próximo
              </Button>
            </DialogFooter>
          </>
        );
      case 3:
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-xl">
                Passo 3: {role === "mentor" ? "Configure sua presença" : "Escolha seus interesses"}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              {role === "mentor" ? (
                <div className="space-y-4">
                  <p className="text-center text-gray-600">
                    Como mentor, você pode:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="mr-2 bg-primary/10 rounded-full p-1 text-xs">✓</div>
                      <span>Criar cursos gratuitos ou pagos</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 bg-primary/10 rounded-full p-1 text-xs">✓</div>
                      <span>Publicar vídeos, PDFs e conteúdos digitais</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 bg-primary/10 rounded-full p-1 text-xs">✓</div>
                      <span>Definir horários disponíveis para sessões individuais</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 bg-primary/10 rounded-full p-1 text-xs">✓</div>
                      <span>Configurar tempo de duração das reuniões</span>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-center text-gray-600">
                    Como mentorado, você pode:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="mr-2 bg-primary/10 rounded-full p-1 text-xs">✓</div>
                      <span>Acessar cursos pagos ou gratuitos</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 bg-primary/10 rounded-full p-1 text-xs">✓</div>
                      <span>Visualizar agenda disponível dos mentores</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 bg-primary/10 rounded-full p-1 text-xs">✓</div>
                      <span>Reservar sessões com comentário opcional</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 bg-primary/10 rounded-full p-1 text-xs">✓</div>
                      <span>Receber notificações de suas sessões</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleNext}>
                Próximo
              </Button>
            </DialogFooter>
          </>
        );
      case 4:
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-xl">
                Passo 4: Tudo pronto!
              </DialogTitle>
            </DialogHeader>
            <div className="py-4 text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-lg font-medium mb-2">
                Parabéns, seu perfil está configurado!
              </h3>
              <p className="text-gray-600 mb-6">
                Agora você pode começar a interagir, aprender e evoluir na plataforma MentorX.
              </p>
            </div>
            <DialogFooter>
              <Button onClick={onComplete}>
                Começar a Usar
              </Button>
            </DialogFooter>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    i <= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {i}
                </div>
                {i < 4 && (
                  <div 
                    className={`h-[2px] w-12 ${
                      i < step ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
};

export default Onboarding;
