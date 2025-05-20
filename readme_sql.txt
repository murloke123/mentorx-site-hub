
# Supabase Database Documentation

## Project ID
erfuinkfouijxgfkxhhn

## Tables

### admin_actions
```sql
CREATE TABLE public.admin_actions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id uuid NOT NULL REFERENCES auth.users(id),
  action_type text NOT NULL,
  target_id uuid NOT NULL,
  target_type text NOT NULL,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

### conteudos
```sql
CREATE TABLE public.conteudos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  modulo_id uuid NOT NULL REFERENCES public.modulos(id),
  nome_conteudo text NOT NULL,
  descricao_conteudo text,
  tipo_conteudo text NOT NULL,
  dados_conteudo jsonb,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

### courses
```sql
CREATE TABLE public.courses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id uuid NOT NULL REFERENCES auth.users(id),
  title text NOT NULL,
  description text,
  is_paid boolean NOT NULL DEFAULT false,
  is_public boolean NOT NULL DEFAULT true,
  price numeric,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);
```

### enrollments
```sql
CREATE TABLE public.enrollments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  course_id uuid NOT NULL REFERENCES public.courses(id),
  progress jsonb,
  enrolled_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);
```

### lessons
```sql
CREATE TABLE public.lessons (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id uuid NOT NULL REFERENCES public.modules(id),
  title text NOT NULL,
  type text NOT NULL,
  content text,
  file_url text,
  video_url text,
  is_published boolean DEFAULT true,
  lesson_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

### mentor_followers
```sql
CREATE TABLE public.mentor_followers (
  mentor_id uuid NOT NULL REFERENCES auth.users(id),
  follower_id uuid NOT NULL REFERENCES auth.users(id),
  followed_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (mentor_id, follower_id)
);
```

### modules
```sql
CREATE TABLE public.modules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id uuid NOT NULL REFERENCES public.courses(id),
  title text NOT NULL,
  description text,
  content_type text NOT NULL,
  content_data jsonb,
  module_order integer NOT NULL DEFAULT 0,
  is_free boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);
```

### modulos
```sql
CREATE TABLE public.modulos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  curso_id uuid NOT NULL REFERENCES public.courses(id),
  nome_modulo text NOT NULL,
  descricao_modulo text,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

### profiles
```sql
CREATE TABLE public.profiles (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  bio text,
  role text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);
```

### conteudo_concluido (Supabase error shows this table doesn't exist yet)
```sql
CREATE TABLE public.conteudo_concluido (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  curso_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  modulo_id uuid NOT NULL REFERENCES public.modulos(id) ON DELETE CASCADE,
  conteudo_id uuid NOT NULL REFERENCES public.conteudos(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  
  -- Garantir que um usuário não possa marcar o mesmo conteúdo como concluído múltiplas vezes
  CONSTRAINT unique_user_content_completion UNIQUE (user_id, conteudo_id)
);
```

## Functions

### handle_updated_at
```sql
CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$function$
```

### handle_new_user
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  user_role TEXT;
BEGIN
  -- Define o papel padrão como 'mentorado'.
  -- Você precisará de lógica adicional no frontend/backend para definir 'mentor' ou 'admin' durante o signup específico.
  user_role := 'mentorado';
  IF NEW.raw_user_meta_data ? 'role' THEN
    user_role := NEW.raw_user_meta_data->>'role';
  END IF;

  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url', user_role);
  RETURN NEW;
END;
$function$
```

## Row Level Security (RLS) Policies

### conteudo_concluido
```sql
-- Permitir que usuários autenticados insiram registros para si mesmos.
CREATE POLICY "Allow authenticated users to insert their own completions"
ON public.conteudo_concluido
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Permitir que usuários autenticados leiam seus próprios registros de conclusão.
CREATE POLICY "Allow authenticated users to select their own completions"
ON public.conteudo_concluido
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Permitir que usuários autenticados excluam seus próprios registros de conclusão.
CREATE POLICY "Allow authenticated users to delete their own completions"
ON public.conteudo_concluido
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

## Indexes
```sql
-- Índices para otimizar consultas comuns na tabela conteudo_concluido
CREATE INDEX idx_conteudo_concluido_user_curso ON public.conteudo_concluido(user_id, curso_id);
CREATE INDEX idx_conteudo_concluido_user_conteudo ON public.conteudo_concluido(user_id, conteudo_id);
```

## Database Relationships

### Foreign Keys
- admin_actions.admin_id → profiles.id
- conteudos.modulo_id → modulos.id
- courses.mentor_id → profiles.id
- enrollments.user_id → profiles.id
- enrollments.course_id → courses.id
- lessons.module_id → modules.id
- mentor_followers.mentor_id → profiles.id
- mentor_followers.follower_id → profiles.id
- modules.course_id → courses.id
- modulos.curso_id → courses.id
- profiles.id → auth.users.id
- conteudo_concluido.user_id → auth.users.id
- conteudo_concluido.curso_id → courses.id
- conteudo_concluido.modulo_id → modulos.id
- conteudo_concluido.conteudo_id → conteudos.id

## Notes
1. This documentation will be updated whenever schema changes occur.
2. The database still uses the "courses" table instead of "cursos" in production.
3. There appears to be a pending migration for the "conteudo_concluido" table that hasn't been successfully applied yet.
