
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from '@/components/ui/use-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'mentor' | 'mentorado'>('mentorado');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Get the intended destination from the location state or default to '/'
  const from = (location.state as any)?.from?.pathname || '/';

  // Clean up existing auth state before login/signup
  const cleanupAuthState = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      // Sign Up mode
      if (password !== confirmPassword) {
        toast({
          title: "Erro no Cadastro",
          description: "As senhas não coincidem.",
          variant: "destructive",
        });
        setLoading(false);
        return; 
      }
      if (!fullName.trim()) {
        toast({ 
          title: "Erro no Cadastro", 
          description: "Por favor, informe seu nome completo.", 
          variant: "destructive" 
        });
        setLoading(false);
        return;
      }
      try {
        // Clean up existing auth state
        cleanupAuthState();
        
        // Try to sign out globally first
        try {
          await supabase.auth.signOut({ scope: 'global' });
        } catch (err) {
          console.log("Sign out error (expected if not signed in):", err);
        }
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: role, 
            }
          }
        });
        if (error) throw error;
        
        console.log("Sign up successful:", data);
        
        toast({ 
          title: "Cadastro realizado!", 
          description: "Verifique seu email para confirmação, se aplicável. Agora você pode fazer login." 
        });
        setIsSignUp(false);
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setRole('mentorado');
      } catch (error: any) {
        console.error("Sign up error:", error);
        toast({
          title: "Erro no Cadastro",
          description: error.error_description || error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    } else {
      // Login mode
      try {
        // Clean up existing auth state
        cleanupAuthState();
        
        // Try to sign out globally first
        try {
          await supabase.auth.signOut({ scope: 'global' });
        } catch (err) {
          console.log("Sign out error (expected if not signed in):", err);
        }
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        console.log("Login successful:", data?.user?.id);
        
        if (data.user) {
          // Fetch user's role
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

          if (profileError) {
            console.error("Error fetching profile:", profileError);
            throw profileError;
          }

          console.log("User profile:", profileData);
          
          toast({ title: "Login bem-sucedido!", description: "Redirecionando..." });
          
          // Redirect based on role
          if (profileData?.role === 'mentor') {
            console.log("Redirecting to mentor dashboard");
            navigate('/mentor/dashboard');
          } else if (profileData?.role === 'mentorado') {
            console.log("Redirecting to mentorado dashboard");
            navigate('/mentorado/dashboard');
          } else if (profileData?.role === 'admin') {
            console.log("Redirecting to admin dashboard");
            navigate('/admin/dashboard');
          } else {
            console.log("Role unknown, redirecting to:", from);
            navigate(from);
          }
        } else {
          toast({ 
            title: "Erro de Login", 
            description: "Usuário não encontrado ou credenciais inválidas.", 
            variant: "destructive" 
          });
        }
      } catch (error: any) {
        console.error("Login error:", error);
        toast({
          title: "Erro de Login",
          description: error.error_description || error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{isSignUp ? 'Criar Nova Conta' : 'Acessar Plataforma'}</CardTitle>
          <CardDescription>
            {isSignUp ? 'Preencha os campos para se registrar.' : 'Bem-vindo(a) de volta! Faça login para continuar.'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleAuth}>
          <CardContent className="space-y-4">
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Seu nome completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={isSignUp}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Eu sou:</Label>
                  <RadioGroup
                    defaultValue="mentorado"
                    value={role}
                    onValueChange={(value: 'mentor' | 'mentorado') => setRole(value)}
                    className="flex space-x-4"
                    disabled={loading}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mentorado" id="r-mentorado" />
                      <Label htmlFor="r-mentorado">Mentorado</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mentor" id="r-mentor" />
                      <Label htmlFor="r-mentor">Mentor</Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={isSignUp}
                  disabled={loading}
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (isSignUp ? 'Registrando...' : 'Entrando...') : (isSignUp ? 'Registrar' : 'Entrar')}
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setFullName('');
                setPassword('');
                setConfirmPassword('');
                setRole('mentorado'); 
              }}
              disabled={loading}
            >
              {isSignUp ? 'Já tem uma conta? Faça login' : 'Não tem uma conta? Cadastre-se'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
