-- Adicionar campo layout_images para armazenar configurações de imagens
ALTER TABLE course_landing_pages 
ADD COLUMN layout_images JSON DEFAULT '{}';

-- Comentário explicativo
COMMENT ON COLUMN course_landing_pages.layout_images IS 'Armazena configurações de imagens do layout: {image_tag: {url, width, height}}'; 