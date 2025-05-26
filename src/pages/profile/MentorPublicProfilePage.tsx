
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Youtube, User, GraduationCap, Star, Calendar, Phone, Heart, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import StatsCard from "@/components/mentor/profile/StatsCard";
import TestimonialCard from "@/components/mentor/profile/TestimonialCard";
import CourseCard from "@/components/mentor/profile/CourseCard";
import ContactForm from "@/components/mentor/profile/ContactForm";

const MentorPublicProfilePage = () => {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mentorData, setMentorData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('sobre');
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Fetch mentor data and check if current user is following
  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        if (!mentorId) return;

        // Get mentor profile
        const { data: mentor, error: mentorError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", mentorId)
          .eq("role", "mentor")
          .single();

        if (mentorError) throw mentorError;
        setMentorData(mentor);

        // Check current user and following status
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUser(user);
          
          const { data: followData } = await supabase
            .from("mentor_followers")
            .select("*")
            .eq("mentor_id", mentorId)
            .eq("follower_id", user.id)
            .single();

          setIsFollowing(!!followData);
        }
      } catch (error) {
        console.error("Error fetching mentor data:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar o perfil do mentor."
        });
        navigate("/mentors");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentorData();
  }, [mentorId, navigate, toast]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "Login necessário",
        description: "Você precisa estar logado para seguir um mentor."
      });
      navigate("/login");
      return;
    }

    try {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from("mentor_followers")
          .delete()
          .eq("mentor_id", mentorId)
          .eq("follower_id", currentUser.id);

        if (error) throw error;

        setIsFollowing(false);
        toast({
          title: "Deixou de seguir",
          description: `Você não está mais seguindo ${mentorData?.full_name}.`
        });
      } else {
        // Follow
        const { error } = await supabase
          .from("mentor_followers")
          .insert({
            mentor_id: mentorId,
            follower_id: currentUser.id
          });

        if (error) throw error;

        setIsFollowing(true);
        toast({
          title: "Agora você está seguindo",
          description: `Você está seguindo ${mentorData?.full_name}!`
        });
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível processar sua solicitação."
      });
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Mock data - same as in the editing page
  const stats = [
    { value: "1.250+", label: "Mentorados de Sucesso", icon: "👥" },
    { value: "98%", label: "Taxa de Satisfação", icon: "⭐" },
    { value: "15+", label: "Anos de Experiência", icon: "🎯" },
    { value: "R$ 50M+", label: "Movimentados pelos Alunos", icon: "💰" }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      profession: "Empreendedora Digital",
      content: "A mentoria transformou completamente meu negócio. Em 6 meses consegui aumentar meu faturamento em 300%!",
      rating: 5
    },
    {
      name: "João Santos",
      profession: "Desenvolvedor",
      content: "Graças aos ensinamentos do mentor, consegui minha primeira promoção e dobrei meu salário.",
      rating: 5
    },
    {
      name: "Ana Costa",
      profession: "Consultora Financeira",
      content: "O curso de finanças me deu todas as ferramentas que eu precisava para prosperar no mercado.",
      rating: 5
    }
  ];

  const courses = [
    {
      title: "Finanças Master",
      price: "R$ 497",
      originalPrice: "R$ 797",
      icon: "💰",
      description: "Domine suas finanças e multiplique sua renda",
      badge: "Mais Vendido",
      badgeColor: "bg-green-500"
    },
    {
      title: "Desenvolvimento Pro",
      price: "R$ 397",
      originalPrice: "R$ 597",
      icon: "💻",
      description: "Torne-se um desenvolvedor de elite",
      badge: "Novo",
      badgeColor: "bg-blue-500"
    },
    {
      title: "Mentoria VIP",
      price: "R$ 1.997",
      originalPrice: "R$ 2.997",
      icon: "🚀",
      description: "Acompanhamento personalizado 1:1",
      badge: "Premium",
      badgeColor: "bg-purple-500"
    }
  ];

  if (isLoading) {
    return (
      <div>
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <Spinner className="h-8 w-8" />
        </div>
      </div>
    );
  }

  if (!mentorData) {
    return (
      <div>
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Mentor não encontrado</h1>
            <Button onClick={() => navigate("/mentors")}>
              Ver outros mentores
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative w-full">
          {/* Banner with gradient overlay */}
          <div className="w-full h-[350px] overflow-hidden relative">
            <img 
              src="https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=1500&q=80"
              alt="Banner profile" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30"></div>
            
            {/* Floating Stats */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
                {stats.map((stat, index) => (
                  <StatsCard key={index} {...stat} />
                ))}
              </div>
            </div>
          </div>
          
          {/* Profile Avatar */}
          <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2">
            <div 
              className="w-[130px] h-[130px] md:w-[150px] md:h-[150px] rounded-full overflow-hidden border-4 border-white shadow-xl bg-white"
              style={{
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                animation: 'float 3s ease-in-out infinite'
              }}
            >
              {mentorData.avatar_url ? (
                <img
                  src={mentorData.avatar_url}
                  alt="Profile picture"
                  className="aspect-square h-full w-full object-cover"
                />
              ) : (
                <Avatar className="w-full h-full">
                  <AvatarFallback className="text-2xl">
                    {mentorData.full_name ? mentorData.full_name.charAt(0).toUpperCase() : "?"}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        </div>
        
        {/* Name and CTA section */}
        <div className="mt-24 max-w-5xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {mentorData.full_name}
          </h1>
          {mentorData.highlight_message && (
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
              {mentorData.highlight_message}
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
            <Button
              onClick={handleFollowToggle}
              className={`px-8 py-3 rounded-full shadow-lg transition-all hover:shadow-xl flex items-center gap-2 font-semibold text-lg ${
                isFollowing 
                  ? 'bg-gray-500 hover:bg-gray-600 text-white' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
              }`}
            >
              <Heart className={`h-5 w-5 ${isFollowing ? 'fill-current' : ''}`} />
              {isFollowing ? 'Seguindo' : 'Seguir Mentor'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => scrollToSection('contato')}
              className="px-8 py-3 rounded-full shadow-lg transition-all hover:shadow-xl flex items-center gap-2 font-semibold text-lg"
            >
              <MessageCircle className="h-5 w-5" />
              Entre em Contato
            </Button>
            
            <div className="flex gap-3">
              <a href="#" className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all hover:scale-110 border">
                <Instagram className="h-6 w-6 text-pink-600" />
              </a>
              <a href="#" className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all hover:scale-110 border">
                <Facebook className="h-6 w-6 text-blue-600" />
              </a>
              <a href="#" className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all hover:scale-110 border">
                <Youtube className="h-6 w-6 text-red-600" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Sticky Navigation */}
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="max-w-5xl mx-auto px-4">
            <nav className="flex justify-center space-x-8 py-4">
              {[
                { id: 'sobre', label: 'Sobre', icon: User },
                { id: 'cursos', label: 'Cursos', icon: GraduationCap },
                { id: 'depoimentos', label: 'Depoimentos', icon: Star },
                { id: 'agenda', label: 'Agenda', icon: Calendar },
                { id: 'contato', label: 'Contato', icon: Phone }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      activeSection === item.id
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-16">
          
          {/* Sobre Section */}
          <section id="sobre" className="scroll-mt-24">
            <div className="bg-white rounded-2xl shadow-xl p-8 border">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                Sobre {mentorData.full_name?.split(' ')[0]}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {mentorData.bio && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Minha História</h3>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {mentorData.bio}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Por que seguir {mentorData.full_name?.split(' ')[0]}?
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border-l-4 border-purple-500">
                      <h4 className="font-bold text-lg mb-2">
                        {mentorData.sm_tit1 || "🎯 Resultados Comprovados"}
                      </h4>
                      <p className="text-gray-700">
                        {mentorData.sm_desc1 || "Mais de 1.250 vidas transformadas com metodologias testadas e aprovadas."}
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-l-4 border-green-500">
                      <h4 className="font-bold text-lg mb-2">
                        {mentorData.sm_tit2 || "🚀 Metodologia Exclusiva"}
                      </h4>
                      <p className="text-gray-700">
                        {mentorData.sm_desc2 || "Sistema proprietário desenvolvido ao longo de 15 anos de experiência."}
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border-l-4 border-orange-500">
                      <h4 className="font-bold text-lg mb-2">
                        {mentorData.sm_tit3 || "💰 ROI Garantido"}
                      </h4>
                      <p className="text-gray-700">
                        {mentorData.sm_desc3 || "Investimento retorna em até 90 dias ou seu dinheiro de volta."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cursos Section */}
          <section id="cursos" className="scroll-mt-24">
            <div className="bg-white rounded-2xl shadow-xl p-8 border">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Cursos Disponíveis</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {courses.map((course, index) => (
                  <CourseCard key={index} {...course} />
                ))}
              </div>
            </div>
          </section>

          {/* Depoimentos Section */}
          <section id="depoimentos" className="scroll-mt-24">
            <div className="bg-white rounded-2xl shadow-xl p-8 border">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Depoimentos</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                  <TestimonialCard key={index} {...testimonial} />
                ))}
              </div>
            </div>
          </section>

          {/* Agenda Section */}
          <section id="agenda" className="scroll-mt-24">
            <div className="bg-white rounded-2xl shadow-xl p-8 border">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Agende uma Conversa</h2>
              
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Horários Disponíveis</h3>
                  
                  <div className="space-y-3">
                    {['Segunda a Sexta: 09:00 - 18:00', 'Sábado: 09:00 - 12:00', 'Domingo: Não atendo'].map((schedule, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="h-5 w-5 text-purple-600" />
                        <span>{schedule}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 rounded-lg">
                    Agendar Mentoria
                  </Button>
                </div>
                
                <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4">Calendário do Mês</h3>
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((day) => (
                      <div key={day} className="font-medium text-sm py-2">{day}</div>
                    ))}
                    {Array.from({ length: 31 }, (_, i) => (
                      <div key={i} className={`py-2 text-sm rounded ${
                        (i + 1) % 7 === 0 ? 'bg-red-100' : 'bg-white hover:bg-purple-200 cursor-pointer'
                      }`}>
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contato Section */}
          <section id="contato" className="scroll-mt-24">
            <div className="bg-white rounded-2xl shadow-xl p-8 border">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Entre em Contato</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Formas de Contato</h3>
                  
                  <div className="space-y-4">
                    {mentorData.phone && (
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <Phone className="h-6 w-6 text-green-600" />
                        <div>
                          <p className="font-medium">Telefone/WhatsApp</p>
                          <p className="text-gray-600">{mentorData.phone}</p>
                        </div>
                      </div>
                    )}
                    
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2">
                      <span>💬</span>
                      Chamar no WhatsApp
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Envie uma Mensagem</h3>
                  <ContactForm />
                </div>
              </div>
            </div>
          </section>

          {/* CTA Final */}
          <section className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Pronto para Transformar sua Vida?</h2>
            <p className="text-xl mb-8 opacity-90">
              Junte-se aos seguidores de {mentorData.full_name?.split(' ')[0]} e comece sua jornada de transformação
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-center space-x-8 text-lg">
                <span>✅ Garantia de 30 dias</span>
                <span>✅ Suporte personalizado</span>
                <span>✅ Resultados comprovados</span>
              </div>
            </div>
            
            <Button
              onClick={handleFollowToggle}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-12 py-6 text-xl font-bold rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              {isFollowing ? 'Você está seguindo!' : 'Seguir Agora'}
            </Button>
          </section>
        </div>

        {/* Add CSS animations */}
        <style>{`
          @keyframes float {
            0%, 100% { 
              transform: translateY(0px); 
            }
            50% { 
              transform: translateY(-10px); 
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default MentorPublicProfilePage;
