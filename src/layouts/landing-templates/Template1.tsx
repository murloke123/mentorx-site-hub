import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Clock, Users, CheckCircle, Quote } from 'lucide-react';
import { LandingPageData } from '@/types/landing-page';

interface Template1Props {
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

const Template1: React.FC<Template1Props> = ({ data, courseData }) => {
  const defaultData = {
    headline: data.headline || 'Transforme sua carreira com este curso incrível',
    subheadline: data.subheadline || 'Aprenda as habilidades mais demandadas do mercado',
    description: data.description || 'Este curso vai te ensinar tudo que você precisa saber para se destacar na sua área.',
    benefits: data.benefits.length > 0 ? data.benefits : [
      'Acesso vitalício ao conteúdo',
      'Certificado de conclusão',
      'Suporte direto com o mentor',
      'Comunidade exclusiva de alunos'
    ],
    ctaText: data.ctaText || 'Inscrever-se Agora',
    pricingText: data.pricingText || 'Por apenas R$ 197,00',
    aboutMentor: data.aboutMentor || 'Especialista com mais de 10 anos de experiência na área.',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {courseData?.title || 'Nome do Curso'}
            </h1>
            <Badge variant="secondary">Curso Online</Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {defaultData.headline}
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                {defaultData.subheadline}
              </p>
              <p className="text-lg mb-8 text-blue-50">
                {defaultData.description}
              </p>
              
              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <Button 
                  size="lg" 
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 text-lg"
                >
                  {defaultData.ctaText}
                </Button>
                <div className="text-center sm:text-left">
                  <p className="text-2xl font-bold">{defaultData.pricingText}</p>
                  <p className="text-sm text-blue-200">ou 12x de R$ 19,90</p>
                </div>
              </div>
            </div>
            
            {/* Course Image */}
            <div className="flex justify-center">
              <div className="bg-white rounded-lg shadow-2xl p-2 max-w-md w-full">
                <img 
                  src={courseData?.image || "/api/placeholder/400/300"} 
                  alt="Curso" 
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="p-4">
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                    <Clock className="w-4 h-4" />
                    <span>40 horas de conteúdo</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                    <Users className="w-4 h-4" />
                    <span>+500 alunos matriculados</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>4.9/5 (120 avaliações)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              O que você vai ganhar com este curso?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Invista no seu futuro e transforme sua carreira com conhecimentos práticos e atualizados
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {defaultData.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <p className="text-lg text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {data.testimonials.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                O que nossos alunos dizem
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="bg-white">
                  <CardContent className="p-6">
                    <Quote className="w-8 h-8 text-gray-400 mb-4" />
                    <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
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

      {/* About Mentor Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Conheça seu Mentor
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                {defaultData.aboutMentor}
              </p>
              <p className="text-lg text-gray-700">
                {courseData?.mentor.bio || 'Bio do mentor aqui...'}
              </p>
            </div>
            <div className="flex justify-center">
              <div className="text-center">
                <Avatar className="w-32 h-32 mx-auto mb-4">
                  <AvatarImage src={courseData?.mentor.avatar} />
                  <AvatarFallback className="text-2xl">
                    {courseData?.mentor.name?.charAt(0) || 'M'}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold text-gray-900">
                  {courseData?.mentor.name || 'Nome do Mentor'}
                </h3>
                <p className="text-gray-600">Especialista e Mentor</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para transformar sua carreira?
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Não perca esta oportunidade única de aprender com os melhores
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
            <Button 
              size="lg" 
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-12 py-4 text-xl"
            >
              {defaultData.ctaText}
            </Button>
            <div className="text-center">
              <p className="text-2xl font-bold">{defaultData.pricingText}</p>
              <p className="text-sm text-purple-200">Acesso imediato • Garantia de 7 dias</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2024 {courseData?.title || 'Curso'}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Template1; 