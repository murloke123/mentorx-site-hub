-- Criar tabela para páginas de venda dos cursos
CREATE TABLE course_landing_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  template_type VARCHAR(20) NOT NULL CHECK (template_type IN ('modelo1', 'modelo2', 'modelo3')),
  
  -- Campos editáveis do template
  headline TEXT,
  subheadline TEXT,
  description TEXT,
  benefits TEXT[], -- Array de benefícios
  testimonials JSONB, -- Depoimentos estruturados
  cta_text VARCHAR(100), -- Texto do botão de ação
  pricing_text TEXT,
  bonus_content TEXT,
  about_mentor TEXT,
  
  -- Metadados
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar campo na tabela courses para referenciar a landing page
ALTER TABLE courses ADD COLUMN landing_page_id UUID REFERENCES course_landing_pages(id);

-- Políticas RLS
ALTER TABLE course_landing_pages ENABLE ROW LEVEL SECURITY;

-- Mentores só podem gerenciar suas próprias landing pages
CREATE POLICY "Mentores podem gerenciar suas landing pages" 
ON course_landing_pages 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM courses 
    WHERE courses.id = course_landing_pages.course_id 
    AND courses.mentor_id = auth.uid()
  )
);

-- Permitir visualização pública das landing pages ativas
CREATE POLICY "Visualização pública de landing pages ativas"
ON course_landing_pages
FOR SELECT
USING (is_active = true);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_course_landing_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER course_landing_pages_updated_at
  BEFORE UPDATE ON course_landing_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_course_landing_pages_updated_at(); 