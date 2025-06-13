-- Adicionar campos de estilo para landing pages
-- Separar conteúdo texto (dados puros) dos estilos HTML

ALTER TABLE course_landing_pages 
ADD COLUMN IF NOT EXISTS sec_hero_style JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS sec_about_course_style JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS sec_about_mentor_style JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS sec_results_style JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS sec_testimonials_style JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS sec_curriculum_style JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS sec_bonus_style JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS sec_pricing_style JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS sec_faq_style JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS sec_final_cta_style JSONB DEFAULT '{}';

-- Comentário: 
-- Os campos sec_* (existentes) = conteúdo texto puro
-- Os campos sec_*_style (novos) = HTML e estilos 