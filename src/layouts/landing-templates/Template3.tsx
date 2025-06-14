
import React from 'react';
import { LandingPageData } from '@/types/landing-page';

interface Template3Props {
  data: LandingPageData;
  onDataChange?: (data: Partial<LandingPageData>) => void;
  isEditing?: boolean;
}

export const Template3: React.FC<Template3Props> = ({ 
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
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black/90 backdrop-blur-sm fixed w-full z-50 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-orange-500">LOGO</div>
            <button className="bg-orange-500 hover:bg-orange-600 text-black font-bold px-6 py-2 rounded-full transition-colors">
              {ctaText}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          {isEditing ? (
            <input
              type="text"
              value={headline}
              onChange={(e) => handleTextChange('sec_hero', 'headline', e.target.value)}
              className="text-4xl md:text-6xl font-bold mb-6 text-white bg-transparent border-2 border-orange-500/30 rounded px-4 py-2 w-full text-center"
            />
          ) : (
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-orange-500">{headline.split(' ')[0]}</span> {headline.split(' ').slice(1).join(' ')}
            </h1>
          )}
          
          {isEditing ? (
            <input
              type="text"
              value={subheadline}
              onChange={(e) => handleTextChange('sec_hero', 'subheadline', e.target.value)}
              className="text-xl md:text-2xl mb-8 text-gray-300 bg-transparent border-2 border-orange-500/30 rounded px-4 py-2 w-full text-center"
            />
          ) : (
            <p className="text-xl md:text-2xl mb-8 text-gray-300">{subheadline}</p>
          )}
          
          {isEditing ? (
            <textarea
              value={description}
              onChange={(e) => handleTextChange('sec_hero', 'description', e.target.value)}
              className="text-lg mb-12 text-gray-400 bg-transparent border-2 border-orange-500/30 rounded px-4 py-2 w-full text-center resize-none h-24"
            />
          ) : (
            <p className="text-lg mb-12 text-gray-400">{description}</p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-orange-500 hover:bg-orange-600 text-black font-bold py-4 px-8 rounded-full text-xl transition-all transform hover:scale-105">
              {ctaText}
            </button>
            <button className="border-2 border-orange-500 hover:bg-orange-500 hover:text-black text-orange-500 font-bold py-4 px-8 rounded-full text-xl transition-all">
              Ver Preview
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-500 mb-2">1000+</div>
              <div className="text-gray-400">Alunos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500 mb-2">50+</div>
              <div className="text-gray-400">Horas de Conteúdo</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500 mb-2">95%</div>
              <div className="text-gray-400">Satisfação</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500 mb-2">24/7</div>
              <div className="text-gray-400">Suporte</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-black">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            O que você vai <span className="text-orange-500">dominar</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.length > 0 ? benefits.map((benefit: any, index: number) => (
              <div key={index} className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-orange-500/50 transition-colors">
                <div className="w-12 h-12 bg-orange-500 rounded-full mb-4 flex items-center justify-center">
                  <span className="text-black font-bold">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {benefit.title || `Módulo ${index + 1}`}
                </h3>
                <p className="text-gray-400">
                  {benefit.description || 'Descrição do módulo'}
                </p>
              </div>
            )) : (
              <div className="col-span-3 text-center text-gray-500">
                Nenhum módulo cadastrado
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Mentor Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg h-96 flex items-center justify-center">
              <span className="text-black text-lg font-bold">Foto do Mentor</span>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Quem é o <span className="text-orange-500">Mentor</span>
              </h2>
              {isEditing ? (
                <textarea
                  value={aboutMentor}
                  onChange={(e) => handleTextChange('sec_about', 'content', e.target.value)}
                  className="text-lg text-gray-300 leading-relaxed mb-8 bg-transparent border-2 border-orange-500/30 rounded px-4 py-2 w-full resize-none h-32"
                />
              ) : (
                <p className="text-lg text-gray-300 leading-relaxed mb-8">{aboutMentor}</p>
              )}
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">15+</div>
                  <div className="text-gray-400 text-sm">Anos de Experiência</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">100+</div>
                  <div className="text-gray-400 text-sm">Projetos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">50+</div>
                  <div className="text-gray-400 text-sm">Empresas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Veja o que nossos <span className="text-orange-500">alunos</span> dizem
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.sec_testimonials && Array.isArray(data.sec_testimonials) ? (
              data.sec_testimonials.map((testimonial: any, index: number) => (
                <div key={index} className="bg-black p-6 rounded-lg border border-gray-800">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-orange-500 text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 italic">
                    "{testimonial.content || 'Depoimento do cliente'}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-orange-500 rounded-full mr-4 flex items-center justify-center">
                      <span className="text-black font-bold">
                        {(testimonial.name || 'Cliente')[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">
                        {testimonial.name || 'Nome do Cliente'}
                      </p>
                      <p className="text-gray-400 text-sm">
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
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Invista no seu <span className="text-orange-500">futuro</span>
          </h2>
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-orange-500 rounded-lg shadow-2xl p-8 max-w-md mx-auto">
            <div className="text-5xl font-bold text-orange-500 mb-4">
              {pricingText}
            </div>
            <p className="text-gray-400 mb-6 line-through">De R$ 497,00</p>
            <div className="bg-orange-500 text-black rounded-full px-4 py-2 inline-block mb-6 font-bold">
              OFERTA LIMITADA
            </div>
            <ul className="text-left mb-8 space-y-3">
              <li className="flex items-center">
                <span className="text-orange-500 mr-3 text-xl">✓</span>
                Acesso vitalício ao curso
              </li>
              <li className="flex items-center">
                <span className="text-orange-500 mr-3 text-xl">✓</span>
                Certificado de conclusão
              </li>
              <li className="flex items-center">
                <span className="text-orange-500 mr-3 text-xl">✓</span>
                Comunidade exclusiva
              </li>
              <li className="flex items-center">
                <span className="text-orange-500 mr-3 text-xl">✓</span>
                Suporte direto com mentor
              </li>
            </ul>
            <button className="bg-orange-500 hover:bg-orange-600 text-black font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 w-full mb-4">
              {ctaText}
            </button>
            <p className="text-gray-500 text-sm">
              💳 Parcelamos em até 12x no cartão
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Perguntas <span className="text-orange-500">Frequentes</span>
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Por quanto tempo tenho acesso ao curso?",
                a: "O acesso é vitalício! Você pode assistir quantas vezes quiser, no seu próprio ritmo."
              },
              {
                q: "Preciso de conhecimento prévio?",
                a: "Não! O curso foi pensado para iniciantes e intermediários."
              },
              {
                q: "Tem certificado?",
                a: "Sim! Ao concluir 100% do curso você recebe um certificado de conclusão."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-black border border-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2 text-orange-500">
                  {faq.q}
                </h3>
                <p className="text-gray-300">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-yellow-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-black">
            Não perca essa oportunidade!
          </h2>
          <p className="text-lg mb-8 text-black/80">
            Apenas 48 horas com esse preço especial
          </p>
          <button className="bg-black hover:bg-gray-800 text-white font-bold py-4 px-12 rounded-full text-xl transition-all transform hover:scale-105">
            {ctaText}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-2xl font-bold text-orange-500 mb-4">LOGO</div>
          <p className="text-gray-400 mb-8">
            Transformando carreiras através da educação de qualidade
          </p>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-500 text-sm">
              © 2024 Todos os direitos reservados. Política de Privacidade | Termos de Uso
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
