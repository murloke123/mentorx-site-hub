#!/bin/bash

echo "Aplicando migração de categorias..."

# Navegar para o diretório do projeto
cd /Users/app/Dev/novorepogit/mentorx-connect-hub

# Aplicar as migrações
npx supabase db push

echo "Migração aplicada com sucesso!"

# Gerar tipos TypeScript atualizados
npx supabase gen types typescript --local > src/types/supabase-categories.ts

echo "Tipos TypeScript gerados!" 