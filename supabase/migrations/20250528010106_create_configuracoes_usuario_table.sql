-- Criar tabela de configurações do usuário
CREATE TABLE IF NOT EXISTS configuracoes_usuario (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    nome_usuario TEXT NOT NULL,
    perfil_usuario TEXT NOT NULL,
    tipo_log TEXT NOT NULL,
    ativo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_configuracoes_usuario_user_id ON configuracoes_usuario(user_id);
CREATE INDEX IF NOT EXISTS idx_configuracoes_usuario_tipo_log ON configuracoes_usuario(tipo_log);

-- Criar política RLS (Row Level Security)
ALTER TABLE configuracoes_usuario ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam apenas suas próprias configurações
CREATE POLICY "Users can view own settings" ON configuracoes_usuario
    FOR SELECT USING (auth.uid() = user_id);

-- Política para permitir que usuários insiram suas próprias configurações
CREATE POLICY "Users can insert own settings" ON configuracoes_usuario
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para permitir que usuários atualizem suas próprias configurações
CREATE POLICY "Users can update own settings" ON configuracoes_usuario
    FOR UPDATE USING (auth.uid() = user_id);

-- Política para permitir que usuários deletem suas próprias configurações
CREATE POLICY "Users can delete own settings" ON configuracoes_usuario
    FOR DELETE USING (auth.uid() = user_id);

-- Função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_configuracoes_usuario_updated_at
    BEFORE UPDATE ON configuracoes_usuario
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
