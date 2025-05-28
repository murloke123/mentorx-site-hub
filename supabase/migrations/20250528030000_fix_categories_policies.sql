-- Verificar e corrigir políticas RLS para a tabela categories

-- Remover políticas existentes se houver problemas
DROP POLICY IF EXISTS "Categories são visíveis para todos" ON public.categories;
DROP POLICY IF EXISTS "Apenas admins podem inserir categorias" ON public.categories;
DROP POLICY IF EXISTS "Apenas admins podem atualizar categorias" ON public.categories;
DROP POLICY IF EXISTS "Apenas admins podem deletar categorias" ON public.categories;

-- Recriar políticas mais permissivas para teste
CREATE POLICY "Todos podem ver categorias ativas" ON public.categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins podem ver todas as categorias" ON public.categories
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'mentor')
        )
    );

CREATE POLICY "Admins e mentores podem inserir categorias" ON public.categories
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'mentor')
        )
    );

CREATE POLICY "Admins e mentores podem atualizar categorias" ON public.categories
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'mentor')
        )
    );

CREATE POLICY "Admins e mentores podem deletar categorias" ON public.categories
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'mentor')
        )
    ); 