import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client'; 
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { useCategories } from '@/hooks/useCategories';

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { categories, loading: categoriesLoading } = useCategories();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'mentor' | 'mentorado'>('mentorado');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      // Signup mode
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
        toast({ title: "Erro no Cadastro", description: "Por favor, informe seu nome completo.", variant: "destructive" });
        setLoading(false);
        return;
      }
      
      // Validação obrigatória da categoria para mentores
      if (role === 'mentor' && !categoryId) {
        toast({
          title: "Categoria obrigatória",
          description: "Por favor, selecione a categoria que você mais se identifica.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      try {
        console.log(`Signup attempt with email: ${email}, role: ${role}, categoryId: ${categoryId}`);
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) {
          // Se o erro for de usuário já existente, tentar fazer login
          if (error.message?.includes('already registered') || error.message?.includes('already exists')) {
            console.log("User already exists, switching to login mode");
            toast({
              title: "Usuário já existe",
              description: "Este email já está cadastrado. Redirecionando para login...",
              variant: "destructive",
            });
            setIsSignUp(false);
            return;
          }
          throw error;
        }
        
        if (data.user) {
          console.log("User created successfully:", data.user.id);
          
          // Buscar o nome da categoria selecionada
          let categoryName = null;
          if (role === 'mentor' && categoryId) {
            const selectedCategory = categories.find(cat => cat.id === categoryId);
            categoryName = selectedCategory?.name || null;
            console.log("Selected category:", categoryName, "with ID:", categoryId);
          }

          // Create profile with category information using UPSERT to avoid duplicate key errors
          console.log("Creating profile with data:", {
            id: data.user.id,
            full_name: fullName,
            role: role,
            category: categoryName,
            category_id: role === 'mentor' ? categoryId : null,
          });
          
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .upsert({
              id: data.user.id,
              full_name: fullName,
              role: role,
              category: categoryName,
              category_id: role === 'mentor' ? categoryId : null,
            }, {
              onConflict: 'id'
            })
            .select()
            .single();
          
          if (profileError) {
            console.error("Profile creation error:", profileError);
            throw profileError;
          }
          
          console.log("User profile after signup:", profileData);
          
          toast({
            title: "Cadastro realizado com sucesso!",
            description: "Bem-vindo à plataforma!",
          });
          
          if (profileData?.role === 'mentor') {
            navigate('/mentor/dashboard');
          } else if (profileData?.role === 'mentorado') {
            navigate('/mentorado/dashboard');
          } else {
            navigate('/');
          }
        }
      } catch (error: any) {
        console.error("Signup error:", error);
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
        console.log(`Login attempt with email: ${email}`);
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        if (data.user) {
          console.log("Login successful, user:", data.user.id);
          
          // Fetch user's role to redirect to the appropriate dashboard
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

          if (profileError) {
            console.error("Error fetching user profile:", profileError);
            throw profileError;
          }

          console.log("User role:", profileData?.role);
          
          toast({ title: "Login bem-sucedido!", description: "Redirecionando..." });
          
          // Redirect based on user role
          if (profileData?.role === 'admin') {
            navigate('/admin/dashboard');
          } else if (profileData?.role === 'mentor') {
            navigate('/mentor/dashboard'); 
          } else if (profileData?.role === 'mentorado') {
            navigate('/mentorado/dashboard'); 
          } else {
            navigate('/');
          }
        } else {
          toast({ title: "Erro de Login", description: "Usuário não encontrado ou credenciais inválidas.", variant: "destructive" });
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
            {isSignUp && ( // Campos visíveis apenas no cadastro
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
            
            {/* Campo de Categoria - visível apenas para mentores no cadastro */}
            {isSignUp && role === 'mentor' && (
              <div className="space-y-2">
                <Label htmlFor="category">Qual a categoria que você mais se identifica? *</Label>
                <Select 
                  value={categoryId} 
                  onValueChange={setCategoryId}
                  disabled={loading || categoriesLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={categoriesLoading ? "Carregando categorias..." : "Selecione uma categoria"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
            {/* Campo de Confirmar Senha - visível apenas no modo SignUp (cadastro) */}
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={isSignUp} // Obrigatório apenas no cadastro
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
                // Limpar campos ao alternar
                setFullName('');
                setCategoryId('');
                // Manter email se já digitado ou limpar: setEmail('');
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
