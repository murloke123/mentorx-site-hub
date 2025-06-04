-- Script de teste para verificar a nova estrutura
-- Execute depois da migração principal

-- 1. Verificar se os novos campos existem
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'course_landing_pages' 
AND column_name LIKE 'sec_%'
ORDER BY column_name;

-- 2. Testar a função de criação de dados padrão
-- (Substitua o UUID abaixo por um course_id real do seu banco)
-- SELECT create_default_landing_page_sections('SEU-COURSE-ID-AQUI', 'Curso de Teste', 497.00);

-- 3. Verificar se os dados foram inseridos corretamente
-- SELECT id, course_id, template_type, 
--        sec_hero->>'title' as hero_title,
--        sec_pricing->>'price' as price
-- FROM course_landing_pages 
-- WHERE course_id = 'SEU-COURSE-ID-AQUI';

-- 4. Testar consulta das seções
-- SELECT 
--   id,
--   course_id,
--   sec_hero->>'title' as hero_title,
--   sec_about_course->>'title' as about_title,
--   sec_pricing->>'price' as price
-- FROM course_landing_pages 
-- LIMIT 5; 