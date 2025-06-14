
import React from 'react';
import { LandingPageData } from '@/types/landing-page';

interface Template2Props {
  data: LandingPageData;
  onDataChange?: (data: Partial<LandingPageData>) => void;
  isEditing?: boolean;
}

export const Template2: React.FC<Template2Props> = ({ 
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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-gray-800">Logo</div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              {ctaText}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            {isEditing ? (
              <input
                type="text"
                value={headline}
                onChange={(e) => handleTextChange('sec_hero', 'headline', e.target.value)}
                className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 border-2 border-gray-300 rounded px-4 py-2 w-full"
              />
            ) : (
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">{headline}</h1>
            )}
            
            {isEditing ? (
              <input
                type="text"
                value={subheadline}
                onChange={(e) => handleTextChange('sec_hero', 'subheadline', e.target.value)}
                className="text-xl mb-8 text-gray-600 border-2 border-gray-300 rounded px-4 py-2 w-full"
              />
            ) : (
              <p className="text-xl mb-8 text-gray-600">{subheadline}</p>
            )}
            
            {isEditing ? (
              <textarea
                value={description}
                onChange={(e) => handleTextChange('sec_hero', 'description', e.target.value)}
                className="text-lg mb-8 text-gray-700 border-2 border-gray-300 rounded px-4 py-2 w-full resize-none h-24"
              />
            ) : (
              <p className="text-lg mb-8 text-gray-700">{description}</p>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">
                {ctaText}
              </button>
              <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold py-4 px-8 rounded-lg text-lg transition-colors">
                Saiba Mais
              </button>
            </div>
          </div>
          <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
            <span className="text-gray-500 text-lg">Imagem do Curso</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Por que escolher este curso?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.length > 0 ? benefits.map((benefit: any, index: number) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-blue-600 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-white text-xl">✓</span>
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

      {/* About Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <span className="text-gray-500 text-lg">Foto do Mentor</span>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                Sobre o Mentor
              </h2>
              {isEditing ? (
                <textarea
                  value={aboutMentor}
                  onChange={(e) => handleTextChange('sec_about', 'content', e.target.value)}
                  className="text-lg text-gray-700 leading-relaxed mb-8 border-2 border-gray-300 rounded px-4 py-2 w-full resize-none h-32"
                />
              ) : (
                <p className="text-lg text-gray-700 leading-relaxed mb-8">{aboutMentor}</p>
              )}
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                Ver Mais
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            O que nossos alunos dizem
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {data.sec_testimonials && Array.isArray(data.sec_testimonials) ? (
              data.sec_testimonials.map((testimonial: any, index: number) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    "{testimonial.content || 'Depoimento do cliente'}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-600 rounded-full mr-3 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {(testimonial.name || 'Cliente')[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {testimonial.name || 'Nome do Cliente'}
                      </p>
                      <p className="text-gray-600 text-xs">
                        {testimonial.role || 'Profissão'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500">
                Nenhum depoimento cadastrado
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">
            Comece hoje mesmo
          </h2>
          <div className="bg-white border-2 border-blue-600 rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <div className="text-4xl font-bold text-blue-600 mb-4">
              {pricingText}
            </div>
            <p className="text-gray-600 mb-6">Pagamento único • Acesso vitalício</p>
            <ul className="text-left mb-8 space-y-2">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Acesso completo ao curso
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Certificado de conclusão
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Suporte por 30 dias
              </li>
            </ul>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors w-full">
              {ctaText}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-2xl font-bold mb-4">Logo</div>
          <p className="text-gray-400 mb-8">
            Transforme sua carreira com nossos cursos especializados
          </p>
          <div className="border-t border-gray-700 pt-8">
            <p className="text-gray-400 text-sm">
              © 2024 Todos os direitos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
