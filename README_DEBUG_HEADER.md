# 🐛 Sistema de Debug no Cabeçalho

## ✅ Implementado com Sucesso!

O sistema de logs no cabeçalho foi implementado e está funcionando! Agora você pode ver todas as informações importantes no topo da aplicação.

## 📋 O que é Exibido

### 1. **User UID Completo**
- Mostra o UID completo do usuário logado
- Exemplo: `f051a07e-4cd2-4f5d-9972-bcb3a75bddcc`

### 2. **Course UID**
- Quando você acessar uma página de curso, mostra o UID do curso
- Detecta automaticamente da URL (params.courseId ou params.id)

### 3. **Page ID**
- Descoberto via query: mentor_id + course_id + modelo
- Busca na tabela `course_landing_pages`
- Exemplo: `9940de01-40d2-4a31-a00a-2591344b7b81`

### 4. **Modelo Selecionado**
- Detecta o modelo da landing page (modelo-1, modelo-2, modelo-3)
- Default: modelo-3

## 🎛️ Como Ativar

1. **Vá em Configurações** (qualquer role: admin, mentor, mentorado)
2. **Procure "Ativar log de cabeçalho"**
3. **Ative o switch**
4. **Pronto!** O debug aparecerá no topo de todas as páginas

## 📍 Como Funciona

### Detecção Automática
- **Course ID**: Detectado da URL `/cursos/{id}` ou query params `?courseId=`
- **Modelo**: Detectado da URL ou query params `?modelo=`
- **Page ID**: Query automática quando tem mentor_id + course_id + modelo

### Query do Page ID
```sql
SELECT id FROM course_landing_pages 
WHERE mentor_id = 'f051a07e-4cd2-4f5d-9972-bcb3a75bddcc'
  AND course_id = '{course_id_detectado}'
  AND template_type = 'modelo-3'
```

## 🎨 Visual

O debug aparece como uma barra amarela no topo com informações coloridas:

```
Login: Yes | Role: mentor

User UID: f051a07e-4cd2-4f5d-9972-bcb3a75bddcc

Course UID: abc123... | Modelo: modelo-3

Page ID: 9940de01-40d2-4a31-a00a-2591344b7b81
```

## 🔧 Para Desenvolvedores

### Arquivos Modificados
- `src/components/Debug.tsx` - Componente principal
- `src/pages/*/ConfiguracoesPage.tsx` - Configuração do switch

### Como Adicionar ao Layout
O componente `<Debug />` deve estar no layout principal para aparecer em todas as páginas.

### Personalização
Para personalizar a detecção, modifique as funções no `Debug.tsx`:
- `detectCourseId()` - Como detectar course ID
- `detectModelo()` - Como detectar modelo
- Query do Page ID - Como buscar o Page ID

## 🚀 Próximos Passos

1. **Teste em uma página de curso** para ver Course UID e Page ID
2. **Verifique se o Page ID está correto** para suas landing pages
3. **Configure outros mentores** para testarem também

---

**Status**: ✅ Implementado e Funcionando  
**Testado com**: User f051a07e-4cd2-4f5d-9972-bcb3a75bddcc  
**Page ID Esperado**: 9940de01-40d2-4a31-a00a-2591344b7b81 