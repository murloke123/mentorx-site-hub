import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Clock, Users, CheckCircle, Quote, Play, Zap } from 'lucide-react';
import { LandingPageData } from '@/types/landing-page';

interface Template2Props {
  data: LandingPageData;
  courseData?: {
    title: string;
    description: string;
    price: number;
    image: string;
    mentor: {
      name: string;
      avatar: string;
      bio: string;
    };
  };
}

const Template2: React.FC<Template2Props> = ({ data, courseData }) => {
  const defaultData = {
    headline: data.headline || 'Domine as habilidades do futuro',
    subheadline: data.subheadline || 'Um curso revolucionário que vai acelerar sua carreira',
    description: data.description || 'Metodologia inovadora com resultados comprovados em tempo recorde.',
    benefits: data.benefits.length > 0 ? data.benefits : [
      'Aprenda 10x mais rápido',
      'Mentoria individual personalizada',
      'Projeto prático real',
      'Network exclusivo de profissionais'
    ],
    ctaText: data.ctaText || 'Garantir Minha Vaga',
    pricingText: data.pricingText || 'R$ 297,00',
    aboutMentor: data.aboutMentor || 'Especialista reconhecido internacionalmente com resultados extraordinários.',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="animate-pulse absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="animate-pulse absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" style={{ animationDelay: '2s' }}></div>
            <div className="animate-pulse absolute top-1/2 left-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" style={{ animationDelay: '4s' }}></div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              {/* Badge */}
              <Badge className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-2">
                🔥 Curso Mais Procurado
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {defaultData.headline}
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 text-gray-300">
                {defaultData.subheadline}
              </p>
              
              <p className="text-lg mb-10 text-gray-400">
                {defaultData.description}
              </p>

              {/* Stats */}
              <div className="flex gap-8 mb-10">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">2.5K+</div>
                  <div className="text-sm text-gray-400">Alunos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-400">4.9★</div>
                  <div className="text-sm text-gray-400">Avaliação</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">50h</div>
                  <div className="text-sm text-gray-400">Conteúdo</div>
                </div>
              </div>
              
              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-10 py-4 text-lg border-0 shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40 hover:scale-105"
                >
                  <Play className="mr-2 h-5 w-5" />
                  {defaultData.ctaText}
                </Button>
                <div className="text-left">
                  <p className="text-3xl font-bold text-white">{defaultData.pricingText}</p>
                  <p className="text-sm text-gray-400">💳 ou 12x sem juros</p>
                </div>
              </div>
            </div>
            
            {/* Video/Image Section */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-50"></div>
                <div className="relative bg-gray-900 rounded-2xl p-6 border border-gray-700 backdrop-blur-sm">
                  <img 
                    src={courseData?.image || "/api/placeholder/500/350"} 
                    alt="Curso Preview" 
                    className="w-full h-72 object-cover rounded-xl mb-4"
                  />
                  <div className="flex items-center justify-between text-white">
                    <div>
                      <h3 className="font-bold text-lg">{courseData?.title || 'Curso Exclusivo'}</h3>
                      <p className="text-gray-400 text-sm">Acesso imediato</p>
                    </div>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900/50 backdrop-blur-sm border-y border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Por que este curso é diferente?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Metodologia única que combina teoria e prática para resultados extraordinários
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {defaultData.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 group">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{benefit}</h3>
                  <p className="text-gray-400">
                    Benefício detalhado que explica como isso vai impactar positivamente sua jornada
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {data.testimonials.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Transformações reais
              </h2>
              <p className="text-xl text-gray-400">
                Veja os resultados de quem já fez essa jornada
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback className="bg-purple-600 text-white">
                          {testimonial.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-white">{testimonial.name}</p>
                        <p className="text-sm text-gray-400">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Mentor */}
      <section className="py-20 bg-gray-900/50 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-50"></div>
                <Avatar className="relative w-64 h-64 border-4 border-purple-500">
                  <AvatarImage src={courseData?.mentor.avatar} />
                  <AvatarFallback className="text-6xl bg-purple-600 text-white">
                    {courseData?.mentor.name?.charAt(0) || 'M'}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Seu Mentor
              </h2>
              <h3 className="text-2xl font-bold text-purple-400 mb-4">
                {courseData?.mentor.name || 'Nome do Mentor'}
              </h3>
              <p className="text-lg text-gray-300 mb-6">
                {defaultData.aboutMentor}
              </p>
              <p className="text-lg text-gray-400">
                {courseData?.mentor.bio || 'Bio detalhada do mentor...'}
              </p>
              
              <div className="flex gap-4 mt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">10+</div>
                  <div className="text-sm text-gray-400">Anos exp.</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-400">5K+</div>
                  <div className="text-sm text-gray-400">Alunos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">50+</div>
                  <div className="text-sm text-gray-400">Projetos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Sua transformação começa agora
          </h2>
          <p className="text-xl mb-10 text-gray-300">
            ⏰ Últimas vagas disponíveis - Não deixe para depois!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-12 py-6 text-xl border-0 shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40 hover:scale-105"
            >
              🚀 {defaultData.ctaText}
            </Button>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{defaultData.pricingText}</p>
              <p className="text-sm text-gray-400">💎 Acesso vitalício • 🛡️ Garantia de 30 dias</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500">
              © 2024 {courseData?.title || 'Curso'}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Template2; 