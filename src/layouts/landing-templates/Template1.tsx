
import React from 'react';
import { LandingPageData } from '@/types/landing-page';

interface Template1Props {
  data: LandingPageData;
  onDataChange?: (data: Partial<LandingPageData>) => void;
  isEditing?: boolean;
}

export const Template1: React.FC<Template1Props> = ({ 
  data, 
  onDataChange, 
  isEditing = false 
}) => {
  // Use default values if data properties don't exist
  const headline = data.sec_hero?.headline || data.layout_body?.sec_hero?.headline || 'Título Principal';
  const subheadline = data.sec_hero?.subheadline || data.layout_body?.sec_hero?.subheadline || 'Subtítulo';
  const description = data.sec_hero?.description || data.layout_body?.sec_hero?.description || 'Descrição do curso';
  const benefits = data.sec_benefits?.items || data.layout_body?.sec_benefits?.items || [];
  
  const ctaText = data.sec_cta?.text || data.layout_body?.sec_cta?.text || 'Inscrever-se Agora';
  const pricingText = data.sec_pricing?.price || data.layout_body?.sec_pricing?.price || 'R$ 97,00';
  const aboutMentor = data.sec_about?.content || data.layout_body?.sec_about?.content || 'Sobre o mentor';

  const handleTextChange = (section: string, field: string, value: string) => {
    if (onDataChange) {
      onDataChange({
        layout_body: {
          ...data.layout_body,
          [section]: {
            ...data.layout_body?.[section],
            [field]: value
          }
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          {isEditing ? (
            <input
              type="text"
              value={headline}
              onChange={(e) => handleTextChange('sec_hero', 'headline', e.target.value)}
              className="text-4xl md:text-6xl font-bold mb-6 bg-transparent border-2 border-white/30 rounded px-4 py-2 w-full text-center"
            />
          ) : (
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{headline}</h1>
          )}
          
          {isEditing ? (
            <input
              type="text"
              value={subheadline}
              onChange={(e) => handleTextChange('sec_hero', 'subheadline', e.target.value)}
              className="text-xl md:text-2xl mb-8 bg-transparent border-2 border-white/30 rounded px-4 py-2 w-full text-center"
            />
          ) : (
            <p className="text-xl md:text-2xl mb-8">{subheadline}</p>
          )}
          
          {isEditing ? (
            <textarea
              value={description}
              onChange={(e) => handleTextChange('sec_hero', 'description', e.target.value)}
              className="text-lg mb-12 bg-transparent border-2 border-white/30 rounded px-4 py-2 w-full text-center resize-none h-24"
            />
          ) : (
            <p className="text-lg mb-12">{description}</p>
          )}
          
          <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-8 rounded-full text-xl transition-colors">
            {ctaText}
          </button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            O que você vai aprender
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.length > 0 ? benefits.map((benefit: any, index: number) => (
              <div key={index} className="text-center p-6 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {benefit.title || `Benefício ${index + 1}`}
                </h3>
                <p className="text-gray-600">
                  {benefit.description || 'Descrição do benefício'}
                </p>
              </div>
            )) : (
              <div className="col-span-3 text-center text-gray-500">
                Nenhum benefício cadastrado
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">
            Investimento
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <div className="text-4xl font-bold text-purple-600 mb-4">
              {pricingText}
            </div>
            <p className="text-gray-600 mb-6">Acesso vitalício</p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors w-full">
              {ctaText}
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Depoimentos
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {data.sec_testimonials && Array.isArray(data.sec_testimonials) ? (
              data.sec_testimonials.map((testimonial: any, index: number) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 mb-4 italic">
                    "{testimonial.content || 'Depoimento do cliente'}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-600 rounded-full mr-4 flex items-center justify-center">
                      <span className="text-white font-bold">
                        {(testimonial.name || 'Cliente')[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {testimonial.name || 'Nome do Cliente'}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {testimonial.role || 'Profissão'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-gray-500">
                Nenhum depoimento cadastrado
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Mentor Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Sobre o Mentor
          </h2>
          {isEditing ? (
            <textarea
              value={aboutMentor}
              onChange={(e) => handleTextChange('sec_about', 'content', e.target.value)}
              className="text-lg bg-transparent border-2 border-white/30 rounded px-4 py-2 w-full text-center resize-none h-32"
            />
          ) : (
            <p className="text-lg leading-relaxed">{aboutMentor}</p>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-yellow-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-black">
            Pronto para começar?
          </h2>
          <button className="bg-black hover:bg-gray-800 text-white font-bold py-4 px-12 rounded-full text-xl transition-colors">
            {ctaText}
          </button>
        </div>
      </section>
    </div>
  );
};
