-- Limpar tabela course_landing_pages conforme solicitado
-- Remover campos desnecessários e manter apenas layout_name e layout_body

-- 1. Primeiro, fazer backup dos dados importantes
CREATE TABLE IF NOT EXISTS course_landing_pages_backup_cleanup AS 
SELECT * FROM course_landing_pages;

-- 2. Remover campos que começam com "sec_"
ALTER TABLE course_landing_pages 
DROP COLUMN IF EXISTS sec_hero,
DROP COLUMN IF EXISTS sec_about_course,
DROP COLUMN IF EXISTS sec_about_mentor,
DROP COLUMN IF EXISTS sec_results,
DROP COLUMN IF EXISTS sec_testimonials,
DROP COLUMN IF EXISTS sec_curriculum,
DROP COLUMN IF EXISTS sec_bonus,
DROP COLUMN IF EXISTS sec_pricing,
DROP COLUMN IF EXISTS sec_faq,
DROP COLUMN IF EXISTS sec_final_cta,
DROP COLUMN IF EXISTS sec_hero_style,
DROP COLUMN IF EXISTS sec_about_course_style,
DROP COLUMN IF EXISTS sec_about_mentor_style,
DROP COLUMN IF EXISTS sec_results_style,
DROP COLUMN IF EXISTS sec_testimonials_style,
DROP COLUMN IF EXISTS sec_curriculum_style,
DROP COLUMN IF EXISTS sec_bonus_style,
DROP COLUMN IF EXISTS sec_pricing_style,
DROP COLUMN IF EXISTS sec_faq_style,
DROP COLUMN IF EXISTS sec_final_cta_style;

-- 3. Remover template_type
ALTER TABLE course_landing_pages 
DROP COLUMN IF EXISTS template_type;

-- 4. Remover campos antigos desnecessários
ALTER TABLE course_landing_pages 
DROP COLUMN IF EXISTS headline,
DROP COLUMN IF EXISTS subheadline,
DROP COLUMN IF EXISTS description,
DROP COLUMN IF EXISTS benefits,
DROP COLUMN IF EXISTS testimonials,
DROP COLUMN IF EXISTS cta_text,
DROP COLUMN IF EXISTS pricing_text,
DROP COLUMN IF EXISTS bonus_content,
DROP COLUMN IF EXISTS about_mentor,
DROP COLUMN IF EXISTS layout_id;

-- 5. Verificar se layout_name e layout_body existem, se não, criar
ALTER TABLE course_landing_pages 
ADD COLUMN IF NOT EXISTS layout_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS layout_body JSONB DEFAULT '{}';

-- 6. Remover índices antigos que podem não existir mais
DROP INDEX IF EXISTS idx_course_landing_pages_layout_id;

-- 7. Garantir índice para layout_body
CREATE INDEX IF NOT EXISTS idx_course_landing_pages_layout_body 
ON course_landing_pages USING GIN (layout_body);

-- 8. Atualizar comentários
COMMENT ON COLUMN course_landing_pages.layout_name IS 'Nome do layout selecionado (ex: "Desenvolvimento Pessoal")';
COMMENT ON COLUMN course_landing_pages.layout_body IS 'JSON contendo todos os textos editáveis extraídos da página do layout';

-- 9. Verificar estrutura final
COMMENT ON TABLE course_landing_pages IS 'Tabela limpa - contém apenas: id, course_id, layout_name, layout_body, is_active, created_at, updated_at';
