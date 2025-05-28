-- Criar tabela de categorias
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7), -- Para cores hex como #FF5733
    icon VARCHAR(50), -- Nome do ícone
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Inserir categorias padrão
INSERT INTO public.categories (name, description, color, icon) VALUES
('Desenvolvimento Pessoal', 'Cursos focados no crescimento e desenvolvimento pessoal', '#8B5CF6', 'User'),
('Marketing', 'Estratégias e técnicas de marketing digital e tradicional', '#F59E0B', 'TrendingUp'),
('Tecnologia', 'Programação, desenvolvimento e tecnologias emergentes', '#10B981', 'Code'),
('Vendas', 'Técnicas de vendas e relacionamento com clientes', '#EF4444', 'DollarSign'),
('Liderança', 'Desenvolvimento de habilidades de liderança e gestão', '#3B82F6', 'Users'),
('Finanças', 'Educação financeira e investimentos', '#F97316', 'PiggyBank');

-- Criar índices
CREATE INDEX idx_categories_name ON public.categories(name);
CREATE INDEX idx_categories_active ON public.categories(is_active);

-- Habilitar RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Categories são visíveis para todos" ON public.categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Apenas admins podem inserir categorias" ON public.categories
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Apenas admins podem atualizar categorias" ON public.categories
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Apenas admins podem deletar categorias" ON public.categories
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON public.categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Adicionar coluna category_id na tabela cursos (se não existir)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cursos' AND column_name = 'category_id') THEN
        ALTER TABLE public.cursos ADD COLUMN category_id UUID REFERENCES public.categories(id);
        CREATE INDEX idx_cursos_category_id ON public.cursos(category_id);
    END IF;
END $$; 