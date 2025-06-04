-- MIGRATION: Reestruturação da tabela course_landing_pages
-- Data: 2024
-- Descrição: Remove campos antigos e adiciona 10 campos JSONB para as seções

-- 1. BACKUP DOS DADOS EXISTENTES (opcional, para recuperação)
CREATE TABLE IF NOT EXISTS course_landing_pages_backup AS 
SELECT * FROM course_landing_pages;

-- 2. REMOVER CAMPOS ANTIGOS
ALTER TABLE course_landing_pages 
DROP COLUMN IF EXISTS headline,
DROP COLUMN IF EXISTS subheadline,
DROP COLUMN IF EXISTS description,
DROP COLUMN IF EXISTS benefits,
DROP COLUMN IF EXISTS testimonials,
DROP COLUMN IF EXISTS cta_text,
DROP COLUMN IF EXISTS pricing_text,
DROP COLUMN IF EXISTS bonus_content,
DROP COLUMN IF EXISTS about_mentor;

-- 3. ADICIONAR OS 10 NOVOS CAMPOS JSONB
ALTER TABLE course_landing_pages 
ADD COLUMN sec_hero JSONB DEFAULT '{}',
ADD COLUMN sec_about_course JSONB DEFAULT '{}',
ADD COLUMN sec_about_mentor JSONB DEFAULT '{}',
ADD COLUMN sec_results JSONB DEFAULT '{}',
ADD COLUMN sec_testimonials JSONB DEFAULT '{}',
ADD COLUMN sec_curriculum JSONB DEFAULT '{}',
ADD COLUMN sec_bonus JSONB DEFAULT '{}',
ADD COLUMN sec_pricing JSONB DEFAULT '{}',
ADD COLUMN sec_faq JSONB DEFAULT '{}',
ADD COLUMN sec_final_cta JSONB DEFAULT '{}';

-- 4. FUNÇÃO PARA POPULAR LANDING PAGE COM DADOS PADRÃO
CREATE OR REPLACE FUNCTION create_default_landing_page_sections(
  course_id_param UUID,
  course_title TEXT DEFAULT 'Transforme sua Carreira',
  course_price DECIMAL DEFAULT 497.00
)
RETURNS UUID AS $$
DECLARE
  landing_page_id UUID;
BEGIN
  -- Buscar ou criar landing page
  SELECT id INTO landing_page_id 
  FROM course_landing_pages 
  WHERE course_id = course_id_param AND is_active = true
  LIMIT 1;

  -- Se não existir, criar uma nova
  IF landing_page_id IS NULL THEN
    INSERT INTO course_landing_pages (
      course_id, 
      template_type, 
      is_active
    ) VALUES (
      course_id_param, 
      'modelo1', 
      true
    ) RETURNING id INTO landing_page_id;
  END IF;

  -- Atualizar com dados padrão
  UPDATE course_landing_pages 
  SET 
    sec_hero = jsonb_build_object(
      'title', course_title || ' em 30 Dias',
      'subtitle', 'Aprenda as habilidades mais demandadas do mercado',
      'description', 'Curso prático e objetivo para profissionais que querem resultados reais',
      'cta_text', 'Quero Me Inscrever Agora',
      'course_duration', '30 dias',
      'students_count', '500+',
      'rating', '4.9',
      'content_hours', '40h',
      'background_image', '',
      'video_url', ''
    ),
    
    sec_about_course = jsonb_build_object(
      'title', 'Sobre o Curso',
      'description', 'Este curso foi desenvolvido para profissionais que desejam se destacar em sua área de atuação',
      'objectives', ARRAY[
        'Dominar habilidades práticas essenciais',
        'Aplicar conhecimento no mundo real',
        'Acelerar crescimento profissional',
        'Desenvolver expertise reconhecida'
      ],
      'target_audience', ARRAY[
        'Profissionais em início de carreira',
        'Pessoas em transição profissional',
        'Empreendedores e freelancers',
        'Estudantes da área'
      ],
      'prerequisites', 'Nenhum conhecimento prévio necessário',
      'certificate', true,
      'methodology', 'Aprenda na prática com projetos reais'
    ),
    
    sec_about_mentor = jsonb_build_object(
      'title', 'Conheça seu Mentor',
      'mentor_name', 'Especialista da Área',
      'description', 'Profissional experiente e reconhecido no mercado',
      'bio', 'Com anos de experiência prática, nosso mentor vai te guiar passo a passo para o sucesso',
      'credentials', ARRAY[
        'Especialização na área',
        'Experiência comprovada',
        'Resultados entregues'
      ],
      'achievements', ARRAY[
        'Mais de 1000 alunos formados',
        'Projetos de sucesso entregues',
        'Reconhecimento no mercado'
      ],
      'photo_url', '',
      'social_links', jsonb_build_object(
        'linkedin', '',
        'instagram', ''
      ),
      'experience_years', 10
    ),
    
    sec_results = jsonb_build_object(
      'title', 'Resultados Comprovados',
      'subtitle', 'Veja os números que comprovam a eficácia do método',
      'statistics', jsonb_build_array(
        jsonb_build_object('metric', 'Alunos formados', 'value', '1.000+', 'description', 'Profissionais capacitados'),
        jsonb_build_object('metric', 'Taxa de sucesso', 'value', '95%', 'description', 'Dos alunos aplicam o método'),
        jsonb_build_object('metric', 'Satisfação', 'value', '4.9/5', 'description', 'Avaliação média dos alunos'),
        jsonb_build_object('metric', 'Certificados', 'value', '800+', 'description', 'Certificados emitidos')
      ),
      'case_studies', jsonb_build_array(
        jsonb_build_object(
          'student_name', 'Ana Silva',
          'before', 'Profissional júnior',
          'after', 'Especialista reconhecida',
          'time', '6 meses'
        )
      )
    ),
    
    sec_testimonials = jsonb_build_object(
      'title', 'O que nossos alunos dizem',
      'subtitle', 'Transformações reais de quem aplicou o método',
      'testimonials', jsonb_build_array(
        jsonb_build_object(
          'id', '1',
          'name', 'Maria Santos',
          'role', 'Profissional da área',
          'content', 'O curso transformou completamente minha forma de trabalhar. Recomendo demais!',
          'avatar', '',
          'rating', 5,
          'company', 'Empresa XYZ',
          'result', 'Crescimento profissional'
        ),
        jsonb_build_object(
          'id', '2',
          'name', 'João Oliveira',
          'role', 'Especialista',
          'content', 'Método prático e objetivo. Consegui aplicar tudo no meu trabalho.',
          'avatar', '',
          'rating', 5,
          'company', 'Consultoria ABC',
          'result', 'Melhores resultados'
        )
      )
    ),
    
    sec_curriculum = jsonb_build_object(
      'title', 'Conteúdo Programático',
      'subtitle', 'O que você vai aprender passo a passo',
      'total_modules', 4,
      'total_lessons', 24,
      'total_hours', '40h',
      'modules', jsonb_build_array(
        jsonb_build_object(
          'module_number', 1,
          'title', 'Fundamentos',
          'description', 'Base sólida para começar com o pé direito',
          'duration', '10h',
          'lessons', ARRAY['Introdução', 'Conceitos básicos', 'Primeiros passos', 'Exercícios práticos']
        ),
        jsonb_build_object(
          'module_number', 2,
          'title', 'Desenvolvimento',
          'description', 'Aprofundando os conhecimentos',
          'duration', '12h',
          'lessons', ARRAY['Técnicas avançadas', 'Estratégias práticas', 'Casos de uso', 'Projetos guiados']
        ),
        jsonb_build_object(
          'module_number', 3,
          'title', 'Aplicação Prática',
          'description', 'Colocando em prática o aprendizado',
          'duration', '12h',
          'lessons', ARRAY['Projeto real', 'Implementação', 'Otimização', 'Resultados']
        ),
        jsonb_build_object(
          'module_number', 4,
          'title', 'Especialização',
          'description', 'Tornando-se um especialista',
          'duration', '6h',
          'lessons', ARRAY['Técnicas avançadas', 'Tendências do mercado', 'Networking', 'Próximos passos']
        )
      )
    ),
    
    sec_bonus = jsonb_build_object(
      'title', 'Bônus Exclusivos',
      'subtitle', 'Materiais extras para acelerar seus resultados',
      'total_bonus_value', 'R$ 897',
      'bonus_items', jsonb_build_array(
        jsonb_build_object(
          'title', 'E-book Completo',
          'description', 'Guia prático com templates e checklists',
          'value', 'R$ 297',
          'format', 'PDF',
          'image_url', ''
        ),
        jsonb_build_object(
          'title', 'Planilhas de Trabalho',
          'description', 'Organize seus projetos como um profissional',
          'value', 'R$ 197',
          'format', 'Excel',
          'image_url', ''
        ),
        jsonb_build_object(
          'title', 'Acesso ao Grupo VIP',
          'description', 'Comunidade exclusiva de alunos',
          'value', 'R$ 197',
          'format', 'Telegram',
          'image_url', ''
        ),
        jsonb_build_object(
          'title', 'Sessão de Mentoria',
          'description', '30 minutos individuais com o mentor',
          'value', 'R$ 200',
          'format', 'Videochamada',
          'image_url', ''
        )
      )
    ),
    
    sec_pricing = jsonb_build_object(
      'title', 'Investimento',
      'subtitle', 'Transforme sua carreira com um investimento que se paga sozinho',
      'price', course_price,
      'original_price', course_price * 2,
      'discount_percentage', 50,
      'currency', 'BRL',
      'payment_options', jsonb_build_array(
        jsonb_build_object(
          'type', 'pix',
          'price', course_price * 0.9,
          'discount_text', '10% OFF no PIX',
          'installments', 1
        ),
        jsonb_build_object(
          'type', 'card',
          'price', course_price,
          'installments', 12,
          'price_per_installment', course_price / 12,
          'discount_text', '12x sem juros'
        )
      ),
      'guarantee', jsonb_build_object(
        'days', 7,
        'description', 'Garantia incondicional de 7 dias. Se não ficar satisfeito, devolvemos 100% do seu dinheiro'
      ),
      'comparison', jsonb_build_object(
        'course_value', 'R$ ' || course_price,
        'bonus_value', 'R$ 897',
        'total_value', 'R$ ' || (course_price + 897),
        'you_pay', 'R$ ' || course_price
      )
    ),
    
    sec_faq = jsonb_build_object(
      'title', 'Dúvidas Frequentes',
      'subtitle', 'Tire suas principais dúvidas sobre o curso',
      'faqs', jsonb_build_array(
        jsonb_build_object(
          'question', 'Como funciona o acesso ao curso?',
          'answer', 'Você recebe acesso imediato à plataforma após a confirmação do pagamento. O conteúdo fica disponível 24h por dia.'
        ),
        jsonb_build_object(
          'question', 'Por quanto tempo tenho acesso?',
          'answer', 'O acesso é por tempo indeterminado! Você pode assistir quantas vezes quiser, no seu ritmo.'
        ),
        jsonb_build_object(
          'question', 'Preciso de conhecimento prévio?',
          'answer', 'Não! O curso foi desenvolvido do básico ao avançado. Qualquer pessoa pode fazer.'
        ),
        jsonb_build_object(
          'question', 'Tem certificado?',
          'answer', 'Sim! Ao concluir o curso você recebe um certificado de conclusão.'
        ),
        jsonb_build_object(
          'question', 'E se eu não gostar do curso?',
          'answer', 'Oferecemos garantia de 7 dias. Se não ficar satisfeito, devolvemos 100% do valor.'
        ),
        jsonb_build_object(
          'question', 'Como funciona o suporte?',
          'answer', 'Você tem acesso ao grupo exclusivo de alunos e suporte direto com nossa equipe.'
        )
      )
    ),
    
    sec_final_cta = jsonb_build_object(
      'title', 'Não deixe sua carreira estagnar',
      'subtitle', 'Esta é sua oportunidade de transformação',
      'urgency_message', '⚠️ Oferta por tempo limitado',
      'final_message', 'Milhares de profissionais já transformaram suas carreiras. Agora é a sua vez de fazer parte deste grupo.',
      'cta_text', 'Garantir Minha Transformação Agora',
      'secondary_cta', 'Ainda tenho dúvidas',
      'timer_enabled', false,
      'timer_deadline', '',
      'scarcity', jsonb_build_object(
        'enabled', false,
        'remaining_spots', 50,
        'message', 'Apenas {remaining_spots} vagas restantes'
      ),
      'risk_reversal', 'Lembre-se: você tem 7 dias de garantia total. Sem riscos!',
      'contact_info', jsonb_build_object(
        'whatsapp', '',
        'email', 'suporte@mentorx.com'
      )
    )
    
  WHERE id = landing_page_id;

  RETURN landing_page_id;
END;
$$ LANGUAGE plpgsql;

-- 5. FUNÇÃO PARA MIGRAR DADOS EXISTENTES (se houver backup)
CREATE OR REPLACE FUNCTION migrate_old_landing_pages_data()
RETURNS void AS $$
DECLARE
  rec RECORD;
BEGIN
  -- Se existe backup, migrar dados
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'course_landing_pages_backup') THEN
    FOR rec IN SELECT * FROM course_landing_pages_backup LOOP
      -- Criar dados padrão usando informações do backup
      PERFORM create_default_landing_page_sections(
        rec.course_id,
        COALESCE(rec.headline, 'Transforme sua Carreira'),
        497.00
      );
      
      -- Atualizar com dados específicos do backup
      UPDATE course_landing_pages 
      SET 
        sec_hero = sec_hero || jsonb_build_object(
          'title', COALESCE(rec.headline, sec_hero->>'title'),
          'subtitle', COALESCE(rec.subheadline, sec_hero->>'subtitle'),
          'description', COALESCE(rec.description, sec_hero->>'description'),
          'cta_text', COALESCE(rec.cta_text, sec_hero->>'cta_text')
        ),
        sec_about_mentor = sec_about_mentor || jsonb_build_object(
          'description', COALESCE(rec.about_mentor, sec_about_mentor->>'description')
        ),
        sec_pricing = sec_pricing || jsonb_build_object(
          'custom_text', COALESCE(rec.pricing_text, '')
        ),
        sec_bonus = sec_bonus || jsonb_build_object(
          'custom_content', COALESCE(rec.bonus_content, '')
        ),
        sec_testimonials = CASE 
          WHEN rec.testimonials IS NOT NULL THEN 
            sec_testimonials || jsonb_build_object('testimonials', rec.testimonials)
          ELSE sec_testimonials
        END
      WHERE course_id = rec.course_id AND is_active = true;
    END LOOP;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 6. EXECUTAR MIGRAÇÃO (comentado por segurança)
-- SELECT migrate_old_landing_pages_data();

-- 7. ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_course_landing_pages_sections 
ON course_landing_pages USING GIN (
  sec_hero, sec_about_course, sec_about_mentor, sec_results, sec_testimonials,
  sec_curriculum, sec_bonus, sec_pricing, sec_faq, sec_final_cta
);

-- 8. COMENTÁRIOS NA TABELA
COMMENT ON COLUMN course_landing_pages.sec_hero IS 'Seção Hero/Principal com título, subtítulo, CTA';
COMMENT ON COLUMN course_landing_pages.sec_about_course IS 'Seção Sobre o Curso com objetivos e descrição';
COMMENT ON COLUMN course_landing_pages.sec_about_mentor IS 'Seção do Mentor com bio e credenciais';
COMMENT ON COLUMN course_landing_pages.sec_results IS 'Seção de Resultados Comprovados com estatísticas';
COMMENT ON COLUMN course_landing_pages.sec_testimonials IS 'Seção de Depoimentos de alunos';
COMMENT ON COLUMN course_landing_pages.sec_curriculum IS 'Seção do Conteúdo Programático com módulos';
COMMENT ON COLUMN course_landing_pages.sec_bonus IS 'Seção de Bônus Exclusivos';
COMMENT ON COLUMN course_landing_pages.sec_pricing IS 'Seção de Preços e formas de pagamento';
COMMENT ON COLUMN course_landing_pages.sec_faq IS 'Seção de Perguntas Frequentes';
COMMENT ON COLUMN course_landing_pages.sec_final_cta IS 'Seção Final de Chamada para Ação'; 