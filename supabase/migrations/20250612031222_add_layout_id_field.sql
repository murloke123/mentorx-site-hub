-- Adicionar campo layout_id para identificar layouts selecionados
ALTER TABLE course_landing_pages 
ADD COLUMN IF NOT EXISTS layout_id VARCHAR(50);

-- Criar índice para layout_id
CREATE INDEX IF NOT EXISTS idx_course_landing_pages_layout_id 
ON course_landing_pages (layout_id);

-- Comentário para documentação
COMMENT ON COLUMN course_landing_pages.layout_id IS 'ID único do layout selecionado (ex: "desenvolvimento_pessoal")';
