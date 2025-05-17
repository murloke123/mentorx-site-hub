
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
    console.log("LoginPage: Cleaning up auth state");
    
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        console.log("LoginPage: Removing localStorage key:", key);
        localStorage.removeItem(key);
      }
    });
    
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        console.log("LoginPage: Removing sessionStorage key:", key);
        sessionStorage.removeItem(key);
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
        console.log("LoginPage: Starting signup process");
        // Clean up existing auth state
        cleanupAuthState();
        
        // Try to sign out globally first
        try {
          await supabase.auth.signOut({ scope: 'global' });
          console.log("LoginPage: Global sign out completed");
        } catch (err) {
          console.log("LoginPage: Sign out error (expected if not signed in):", err);
        }
        
        console.log("LoginPage: Attempting to sign up with email:", email);
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
        
        console.log("LoginPage: Sign up successful:", data);
        
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
        console.error("LoginPage: Sign up error:", error);
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
        console.log("LoginPage: Starting login process");
        // Clean up existing auth state
        cleanupAuthState();
        
        // Try to sign out globally first
        try {
          await supabase.auth.signOut({ scope: 'global' });
          console.log("LoginPage: Global sign out completed");
        } catch (err) {
          console.log("LoginPage: Sign out error (expected if not signed in):", err);
        }
        
        console.log("LoginPage: Attempting to sign in with email:", email);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        console.log("LoginPage: Login successful:", data?.user?.id);
        
        if (data.user) {
          // Fetch user's role
          console.log("LoginPage: Fetching user role");
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

          if (profileError) {
            console.error("LoginPage: Error fetching profile:", profileError);
            throw profileError;
          }

          console.log("LoginPage: User profile:", profileData);
          
          toast({ title: "Login bem-sucedido!", description: "Redirecionando..." });
          
          // Store session in localStorage to prevent loss during redirect
          localStorage.setItem('mentor_app_session', JSON.stringify(data.session));
          
          // Redirect based on role
          if (profileData?.role === 'mentor') {
            console.log("LoginPage: Redirecting to mentor dashboard");
            navigate('/mentor/dashboard', { replace: true });
          } else if (profileData?.role === 'mentorado') {
            console.log("LoginPage: Redirecting to mentorado dashboard");
            navigate('/mentorado/dashboard', { replace: true });
          } else if (profileData?.role === 'admin') {
            console.log("LoginPage: Redirecting to admin dashboard");
            navigate('/admin/dashboard', { replace: true });
          } else {
            console.log("LoginPage: Role unknown, redirecting to:", from);
            navigate(from, { replace: true });
          }
        } else {
          toast({ 
            title: "Erro de Login", 
            description: "Usuário não encontrado ou credenciais inválidas.", 
            variant: "destructive" 
          });
        }
      } catch (error: any) {
        console.error("LoginPage: Login error:", error);
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
