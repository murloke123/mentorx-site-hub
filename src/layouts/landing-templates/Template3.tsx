import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Clock, Users, CheckCircle, Quote, Crown, Award, Shield } from 'lucide-react';
import { LandingPageData } from '@/types/landing-page';

interface Template3Props {
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

const Template3: React.FC<Template3Props> = ({ data, courseData }) => {
  const defaultData = {
    headline: data.headline || 'Curso Premium para Líderes Visionários',
    subheadline: data.subheadline || 'Uma experiência de aprendizado exclusiva e transformadora',
    description: data.description || 'Para profissionais que buscam excelência e resultados extraordinários.',
    benefits: data.benefits.length > 0 ? data.benefits : [
      'Acesso vitalício ao conteúdo premium',
      'Mentoria individual com especialista',
      'Certificação profissional reconhecida',
      'Comunidade exclusiva de executivos'
    ],
    ctaText: data.ctaText || 'Reservar Minha Vaga VIP',
    pricingText: data.pricingText || 'R$ 1.997,00',
    aboutMentor: data.aboutMentor || 'Líder de mercado com track record comprovado em grandes corporações.',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Premium Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Premium Masterclass</h1>
                <p className="text-sm text-gray-600">Experiência Exclusiva</p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white border-0 px-4 py-2">
              ✨ Acesso Limitado
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Elegant Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-amber-50"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-5">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-amber-200 rounded-full mb-8">
                <Crown className="h-4 w-4 text-amber-600" />
                <span className="text-amber-800 font-semibold text-sm">Experiência Premium</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight text-gray-900">
                {defaultData.headline}
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 text-gray-700 leading-relaxed">
                {defaultData.subheadline}
              </p>
              
              <p className="text-lg mb-10 text-gray-600 leading-relaxed">
                {defaultData.description}
              </p>

              {/* Premium Features */}
              <div className="grid grid-cols-3 gap-6 mb-10">
                <div className="text-center p-4 bg-white rounded-xl shadow-sm border">
                  <Award className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-600">Aprovação</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-sm border">
                  <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">VIP</div>
                  <div className="text-sm text-gray-600">Suporte</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-sm border">
                  <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">5.0</div>
                  <div className="text-sm text-gray-600">Avaliação</div>
                </div>
              </div>
              
              {/* Premium CTA */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-bold px-10 py-4 text-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
                >
                  <Crown className="mr-2 h-5 w-5" />
                  {defaultData.ctaText}
                </Button>
                <div className="text-left">
                  <p className="text-3xl font-bold text-gray-900">{defaultData.pricingText}</p>
                  <p className="text-sm text-gray-600">💎 ou 12x de R$ 199,00</p>
                  <p className="text-xs text-green-600 font-semibold">✅ Garantia de satisfação</p>
                </div>
              </div>
            </div>
            
            {/* Premium Course Preview */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl blur-xl opacity-20"></div>
                <Card className="relative bg-white border-2 border-gray-100 shadow-2xl">
                  <CardContent className="p-8">
                    <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl mb-6 overflow-hidden">
                      <img 
                        src={courseData?.image || "/api/placeholder/500/300"} 
                        alt="Course Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-xl text-gray-900">
                          {courseData?.title || 'Masterclass Premium'}
                        </h3>
                        <Badge className="bg-amber-100 text-amber-800 border-amber-200">Premium</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <Clock className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                          <p className="text-sm font-semibold text-gray-900">60h</p>
                          <p className="text-xs text-gray-600">Conteúdo</p>
                        </div>
                        <div>
                          <Users className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                          <p className="text-sm font-semibold text-gray-900">100</p>
                          <p className="text-xs text-gray-600">Executivos</p>
                        </div>
                        <div>
                          <Star className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
                          <p className="text-sm font-semibold text-gray-900">5.0</p>
                          <p className="text-xs text-gray-600">Rating</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Benefits */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full mb-6">
              <Crown className="h-4 w-4 text-amber-600" />
              <span className="text-amber-800 font-semibold text-sm">Benefícios Exclusivos</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Uma experiência sem precedentes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Investimento estratégico para líderes que buscam resultados excepcionais
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {defaultData.benefits.map((benefit, index) => (
              <Card key={index} className="border-2 border-gray-100 hover:border-amber-200 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit}</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Benefício premium desenvolvido especificamente para maximizar seu retorno sobre investimento
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Testimonials */}
      {data.testimonials.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Resultados de nossos executivos
              </h2>
              <p className="text-xl text-gray-600">
                Transformações reais de líderes como você
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="border-2 border-gray-100 hover:border-gray-200 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-2 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-gray-300 mb-4" />
                    <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12 border-2 border-gray-200">
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback className="bg-gray-100 text-gray-600">
                          {testimonial.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Premium Mentor Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full mb-6">
                <Crown className="h-4 w-4 text-amber-600" />
                <span className="text-amber-800 font-semibold text-sm">Seu Mentor Premium</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Aprenda com o melhor
              </h2>
              <h3 className="text-2xl font-bold text-amber-600 mb-6">
                {courseData?.mentor.name || 'Nome do Mentor'}
              </h3>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                {defaultData.aboutMentor}
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                {courseData?.mentor.bio || 'Bio detalhada do mentor...'}
              </p>
              
              {/* Mentor Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white rounded-xl shadow-sm border">
                  <div className="text-3xl font-bold text-gray-900">15+</div>
                  <div className="text-sm text-gray-600">Anos de experiência</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-sm border">
                  <div className="text-3xl font-bold text-gray-900">1000+</div>
                  <div className="text-sm text-gray-600">Executivos treinados</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl shadow-sm border">
                  <div className="text-3xl font-bold text-gray-900">50+</div>
                  <div className="text-sm text-gray-600">Empresas parceiras</div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-8 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full blur-2xl opacity-20"></div>
                <div className="relative bg-white p-8 rounded-2xl shadow-2xl border-2 border-gray-100">
                  <Avatar className="w-64 h-64 mx-auto border-4 border-amber-200">
                    <AvatarImage src={courseData?.mentor.avatar} />
                    <AvatarFallback className="text-6xl bg-amber-100 text-amber-600">
                      {courseData?.mentor.name?.charAt(0) || 'M'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center mt-6">
                    <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white border-0">
                      ⭐ Mentor Premium
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Final CTA */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-amber-600/10"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400/20 rounded-full mb-8">
            <Crown className="h-4 w-4 text-amber-400" />
            <span className="text-amber-300 font-semibold text-sm">Experiência Exclusiva</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            Transforme sua liderança hoje
          </h2>
          <p className="text-xl mb-12 text-gray-300">
            ⏳ Apenas 50 vagas disponíveis - Reserve a sua agora
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 items-center justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-gray-900 font-bold px-12 py-6 text-xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              👑 {defaultData.ctaText}
            </Button>
            <div className="text-center">
              <p className="text-4xl font-bold text-white">{defaultData.pricingText}</p>
              <p className="text-sm text-gray-400">💎 Investimento Premium • 🛡️ Garantia Total</p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="bg-gray-50 border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="h-5 w-5 text-amber-600" />
              <span className="font-bold text-gray-900">Premium Experience</span>
            </div>
            <p className="text-gray-600">
              © 2024 {courseData?.title || 'Curso Premium'}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Template3; 