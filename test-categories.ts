// Teste rápido no console do navegador
import { supabase } from '@/integrations/supabase/client';

// Testar busca de categorias
const testCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true);
  
  console.log('Categorias:', data);
  console.log('Erro:', error);
};

testCategories(); 