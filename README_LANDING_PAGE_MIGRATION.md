# 🚀 Migração Landing Pages - Nova Estrutura de Seções

## 📋 Resumo da Implementação

Esta migração reestruturou completamente o sistema de landing pages, substituindo campos individuais por **10 seções JSONB organizadas**, cada uma com sua própria estrutura específica.

## 🔄 O que foi Alterado

### **Antes:**
```sql
-- Campos antigos (removidos)
headline TEXT
subheadline TEXT  
description TEXT
benefits TEXT[]
testimonials JSONB
cta_text VARCHAR(100)
pricing_text TEXT
bonus_content TEXT
about_mentor TEXT
```

### **Depois:**
```sql
-- 10 novos campos JSONB
sec_hero JSONB
sec_about_course JSONB
sec_about_mentor JSONB
sec_results JSONB
sec_testimonials JSONB
sec_curriculum JSONB
sec_bonus JSONB
sec_pricing JSONB
sec_faq JSONB
sec_final_cta JSONB
```

## 🎯 As 10 Seções

1. **`sec_hero`** - Seção principal com título, CTA, estatísticas
2. **`sec_about_course`** - Descrição do curso, objetivos, público-alvo
3. **`sec_about_mentor`** - Informações do mentor, credenciais
4. **`sec_results`** - Resultados comprovados, estatísticas de sucesso
5. **`sec_testimonials`** - Depoimentos de alunos
6. **`sec_curriculum`** - Conteúdo programático detalhado
7. **`sec_bonus`** - Bônus exclusivos oferecidos
8. **`sec_pricing`** - Preços, formas de pagamento, garantias
9. **`sec_faq`** - Perguntas frequentes
10. **`sec_final_cta`** - Chamada final para ação, urgência

## 🛠️ Como Executar a Migração

### **1. Backup dos Dados**
```sql
-- Executado automaticamente no script
CREATE TABLE course_landing_pages_backup AS 
SELECT * FROM course_landing_pages;
```

### **2. Executar Migração Principal**
```bash
# No Supabase SQL Editor, execute:
migrate_landing_pages_new_structure.sql
```

### **3. Verificar Migração**
```sql
-- Execute o script de teste
-- test_migration.sql
```

## 💻 Como Usar a Nova Funcionalidade

### **Frontend - Edição por Seções**

1. **Acesse:** `/mentor/cursos/{courseId}/landing-page`
2. **Selecione** um modelo de template
3. **Clique** em "Editar Conteúdo"
4. **Edite** cada seção individualmente
5. **Salve** as alterações

### **Programático - Service Layer**

```typescript
// Buscar landing page completa
const landingPage = await getCourseLandingPage(courseId);

// Atualizar uma seção específica
await updateLandingPageSection(landingPageId, {
  sectionType: 'sec_hero',
  data: {
    title: 'Novo título',
    subtitle: 'Novo subtítulo',
    // ... outros campos
  }
});

// Atualizar múltiplas seções
await updateMultipleLandingPageSections(landingPageId, {
  sec_hero: heroData,
  sec_pricing: pricingData
});
```

## 🎨 Exemplo de Estrutura JSON

### **Seção Hero:**
```json
{
  "title": "Domine Marketing Digital em 30 Dias",
  "subtitle": "Aprenda as estratégias mais avançadas",
  "description": "Curso prático e objetivo...",
  "cta_text": "Quero Me Inscrever Agora",
  "course_duration": "30 dias",
  "students_count": "2.500+",
  "rating": "4.9",
  "content_hours": "50h"
}
```

### **Seção FAQ:**
```json
{
  "title": "Dúvidas Frequentes",
  "subtitle": "Tire suas principais dúvidas",
  "faqs": [
    {
      "question": "Como funciona o acesso?",
      "answer": "Você recebe acesso imediato..."
    }
  ]
}
```

## 🔧 Funções Úteis

### **Criar Landing Page com Dados Padrão**
```sql
SELECT create_default_landing_page_sections(
  'course-id-uuid',
  'Nome do Curso',
  497.00
);
```

### **Consultar Dados de Seções**
```sql
SELECT 
  sec_hero->>'title' as hero_title,
  sec_pricing->>'price' as price,
  sec_faq->'faqs' as faq_list
FROM course_landing_pages 
WHERE id = 'landing-page-id';
```

## 🤖 Preparado para IA

A nova estrutura está otimizada para integração com bots de IA:

```typescript
// Bot pode editar seções específicas
const updateHeroWithAI = async (courseId: string, aiContent: any) => {
  await updateLandingPageSection(landingPageId, {
    sectionType: 'sec_hero',
    data: aiContent.heroSection
  });
};
```

## ⚡ Performance

- **Índices GIN** em todos os campos JSONB
- **Consultas otimizadas** por seção
- **Atualizações granulares** (apenas a seção modificada)

## 🔒 Segurança

- **RLS mantido** - mentores só editam suas landing pages
- **Validação de tipos** no frontend
- **Sanitização** de dados de entrada

## 🚨 Pontos de Atenção

1. **Backup automático** criado antes da migração
2. **Compatibilidade mantida** com código antigo via funções deprecated
3. **Rollback possível** através da tabela de backup
4. **Dados migrados** automaticamente da estrutura antiga

## 📱 Interface de Usuário

### **Editor Visual:**
- ✅ Edição por seções
- ✅ Preview em tempo real
- ✅ Validação de campos
- ✅ Salvamento automático
- ✅ Histórico de alterações

### **Funcionalidades:**
- 🎯 **Editor de arrays** (objetivos, benefícios)
- 💬 **Editor de depoimentos** com rating
- 📋 **Editor de módulos** do curso
- 💰 **Editor de preços** com opções de pagamento
- ❓ **Editor de FAQ** dinâmico

## 🎉 Resultado Final

Agora você tem:
- ✅ **10 seções organizadas** e editáveis
- ✅ **Interface visual** para edição
- ✅ **Estrutura flexível** para expansão
- ✅ **Performance otimizada**
- ✅ **Preparado para IA**
- ✅ **Compatibilidade mantida**

## 🔗 Arquivos Modificados

- `migrate_landing_pages_new_structure.sql` - Migração principal
- `src/types/landing-page.ts` - Tipos TypeScript
- `src/services/landingPageService.ts` - Service layer
- `src/components/landing-page/LandingPageEditor.tsx` - Editor visual
- `src/pages/mentor/CourseLandingPage.tsx` - Página principal
- `test_migration.sql` - Scripts de teste

---

**🎯 Próximos Passos:**
1. Execute a migração
2. Teste a interface de edição
3. Configure dados padrão para novos cursos
4. Integre com bot de IA (opcional) 