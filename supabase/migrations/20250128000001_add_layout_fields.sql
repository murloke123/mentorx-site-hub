-- Adicionar novos campos para sistema de layout avançado
ALTER TABLE course_landing_pages 
ADD COLUMN IF NOT EXISTS layout_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS layout_body JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS layout_id VARCHAR(50);

-- Criar índice GIN para otimizar consultas no campo JSONB
CREATE INDEX IF NOT EXISTS idx_course_landing_pages_layout_body 
ON course_landing_pages USING GIN (layout_body);

-- Criar índice para layout_id
CREATE INDEX IF NOT EXISTS idx_course_landing_pages_layout_id 
ON course_landing_pages (layout_id);

-- Comentários para documentação
COMMENT ON COLUMN course_landing_pages.layout_name IS 'Nome do layout selecionado (ex: "Desenvolvimento Pessoal")';
COMMENT ON COLUMN course_landing_pages.layout_body IS 'JSON contendo todos os textos editáveis extraídos da página do layout';
COMMENT ON COLUMN course_landing_pages.layout_id IS 'ID único do layout selecionado (ex: "desenvolvimento_pessoal")'; 