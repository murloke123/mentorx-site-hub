# 📝 Separação de Texto Puro vs HTML - Landing Pages

## 🎯 **Objetivo**

Implementar separação automática entre **texto puro** e **código HTML/estilos** ao salvar conteúdo editado nas páginas de vendas.

## 🔧 **Como Funciona**

### **Antes (Problema)**
```json
{
  "sec_hero": {
    "element_1": {
      "title": "<span class='hero-title-gradient'>Marketing Digital</span>"
    }
  }
}
```

### **Depois (Solução)**
```json
{
  "sec_hero": {
    "element_1": {
      "title": "Marketing Digital"
    },
    "html_content": {
      "element_1": {
        "title": "<span class='hero-title-gradient'>Marketing Digital</span>"
      }
    }
  }
}
```

## 📊 **Estrutura de Dados**

### **`sec_hero` (Texto Puro)**
- **Objetivo**: Armazenar apenas o conteúdo textual
- **Uso**: Analytics, busca, processamento de dados
- **Exemplo**: 
  ```
  "Domine Marketing Digital em 30 Dias"
  ```

### **`sec_hero.html_content` (HTML Completo)**
- **Objetivo**: Armazenar HTML com formatação e estilos
- **Uso**: Renderização na página, preservar formatação
- **Exemplo**: 
  ```html
  "Domine <span class='hero-title-gradient'>Marketing Digital</span> <span class='hero-title-secondary'>em 30 Dias</span>"
  ```

## 🚀 **Implementação**

### **1. Função de Extração**
```typescript
const extractTextOnly = (htmlContent: string): string => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  return tempDiv.textContent || tempDiv.innerText || '';
};
```

### **2. Processo de Salvamento**
1. **Capturar HTML** do elemento editado
2. **Extrair texto puro** usando `extractTextOnly()`
3. **Salvar separadamente**:
   - Texto → `sec_hero.element_1[field]`
   - HTML → `sec_hero.html_content.element_1[field]`

### **3. Logs de Debug**
```javascript
console.log(`📝 Campo ${fieldType}:`);
console.log(`   Texto: "${textContent}"`);
console.log(`   HTML: "${htmlContent}"`);
```

## 📋 **Exemplo Prático**

### **Input (HTML editado)**
```html
<h1 class="hero-title">
  Domine 
  <span class="hero-title-gradient">Marketing Digital</span> 
  <span class="hero-title-secondary">em 30 Dias</span>
</h1>
```

### **Output (Banco de dados)**
```json
{
  "sec_hero": {
    "element_1": {
      "title": "Domine Marketing Digital em 30 Dias"
    },
    "html_content": {
      "element_1": {
        "title": "<h1 class=\"hero-title\">Domine <span class=\"hero-title-gradient\">Marketing Digital</span> <span class=\"hero-title-secondary\">em 30 Dias</span></h1>"
      }
    }
  }
}
```

## 🎯 **Benefícios**

1. **📊 Analytics**: Texto puro para métricas e análises
2. **🔍 Busca**: Busca mais eficiente sem HTML
3. **🎨 Design**: Preserva formatação original
4. **🔄 Flexibilidade**: Permite processar ambos os formatos
5. **📱 APIs**: Texto puro para integrações externas

## 🔄 **Migração Futura**

Quando os campos `sec_*_style` forem criados no banco:

```sql
ALTER TABLE course_landing_pages 
ADD COLUMN sec_hero_style JSONB DEFAULT '{}';
```

O conteúdo será movido de `sec_hero.html_content` para `sec_hero_style`.

## 🧪 **Como Testar**

1. Acesse qualquer página de vendas
2. Ative o **modo de edição**
3. Edite algum texto (ex: título)
4. Clique em **"Salvar Edições"**
5. Verifique o console do navegador
6. Confirme que aparece:
   ```
   📝 Campo title:
      Texto: "Seu texto limpo"
      HTML: "<span class='...'>Seu texto limpo</span>"
   ```

## ✅ **Status**

- [x] Função de extração de texto implementada
- [x] Lógica de salvamento separado funcionando
- [x] Logs de debug adicionados
- [x] Feedback visual para usuário
- [ ] Migração de banco (campos `*_style`)
- [ ] Atualização da lógica de carregamento
- [ ] Testes automatizados 