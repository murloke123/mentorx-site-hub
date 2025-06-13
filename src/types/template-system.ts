// Novas interfaces para o sistema de templates separado

export interface CleanLandingPageData {
  "attention-tag": string;
  "title": string;
  "description": string;
  "button1": string;
  "button2": string;
  "review": string;
  "floating_card1"?: string;
  "floating_card2"?: string;
  "floating_card3"?: string;
  "floating_card4"?: string;
}

export interface HeroFieldTemplate {
  html: string;
  css: string;
  placeholders: string[];
}

export interface HeroTemplatesConfig {
  "attention-tag": HeroFieldTemplate;
  "title": HeroFieldTemplate;
  "description": HeroFieldTemplate;
  "button1": HeroFieldTemplate;
  "button2": HeroFieldTemplate;
  "review": HeroFieldTemplate;
  "floating_card1"?: HeroFieldTemplate;
  "floating_card2"?: HeroFieldTemplate;
  "floating_card3"?: HeroFieldTemplate;
  "floating_card4"?: HeroFieldTemplate;
}

export interface TemplateSystemConfig {
  hero_templates: HeroTemplatesConfig;
}

// Configuração padrão dos templates
export const DEFAULT_HERO_TEMPLATES: HeroTemplatesConfig = {
  "attention-tag": {
    html: `<div class="badge-content">
      <div class="badge-dot"></div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="badge-icon">
        <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
      </svg>
      <span>{FIRST_TEXT}<span class="description-highlight">{SECOND_TEXT}</span> {THIRD_TEXT}</span>
    </div>
    <div class="badge-content">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="badge-icon">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
      <small>{FOURTH_TEXT}</small>
    </div>`,
    css: `.badge-content { 
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%);
      border: 1px solid rgba(16, 185, 129, 0.2);
      padding: 8px 16px; 
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    .description-highlight { 
      color: #10b981; 
      font-weight: 600; 
    }`,
    placeholders: ["{FIRST_TEXT}", "{SECOND_TEXT}", "{THIRD_TEXT}", "{FOURTH_TEXT}"]
  },
  "title": {
    html: `<h1 class="hero-title">
      <span class="hero-title-gradient">{FIRST_TEXT}</span>
      <span class="hero-title-secondary">{SECOND_TEXT}</span>
    </h1>`,
    css: `.hero-title { 
      font-size: 3rem; 
      font-weight: bold; 
      line-height: 1.1;
      margin-bottom: 1rem;
    } 
    .hero-title-gradient { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero-title-secondary {
      color: #1f2937;
    }`,
    placeholders: ["{FIRST_TEXT}", "{SECOND_TEXT}"]
  },
  "description": {
    html: `<p class="hero-description">
      {FIRST_TEXT}<span class="description-highlight">{SECOND_TEXT}</span> {THIRD_TEXT}<span class="description-highlight-cyan">{FOURTH_TEXT}</span> {FIFTH_TEXT}
    </p>`,
    css: `.hero-description { 
      font-size: 1.2rem; 
      color: #6b7280; 
      line-height: 1.6;
      margin-bottom: 2rem;
    }
    .description-highlight { 
      color: #10b981; 
      font-weight: 600; 
    }
    .description-highlight-cyan { 
      color: #06b6d4; 
      font-weight: 600; 
    }`,
    placeholders: ["{FIRST_TEXT}", "{SECOND_TEXT}", "{THIRD_TEXT}", "{FOURTH_TEXT}", "{FIFTH_TEXT}"]
  },
  "button1": {
    html: `<button class="btn btn-primary hero-btn-primary">
      <span class="btn-text">{BUTTON_TEXT}</span>
      <span class="btn-icon">{ICON_TEXT}</span>
    </button>`,
    css: `.btn-primary { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
      color: white; 
      padding: 14px 28px; 
      border-radius: 12px; 
      font-weight: bold;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }`,
    placeholders: ["{BUTTON_TEXT}", "{ICON_TEXT}"]
  },
  "button2": {
    html: `<button class="btn btn-secondary hero-btn-secondary">
      <span class="btn-text">{BUTTON_TEXT}</span>
      <span class="btn-arrow">{ARROW_TEXT}</span>
    </button>`,
    css: `.btn-secondary { 
      background: transparent; 
      color: #667eea; 
      border: 2px solid #667eea; 
      padding: 12px 24px; 
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
    }
    .btn-secondary:hover {
      background: #667eea;
      color: white;
      transform: translateY(-2px);
    }`,
    placeholders: ["{BUTTON_TEXT}", "{ARROW_TEXT}"]
  },
  "review": {
    html: `<span class="social-text">
      {FIRST_TEXT}<span class="social-highlight">{SECOND_TEXT}</span> {THIRD_TEXT}
    </span>`,
    css: `.social-text { 
      color: #6b7280; 
      font-size: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .social-highlight { 
      color: #667eea; 
      font-weight: bold; 
    }`,
    placeholders: ["{FIRST_TEXT}", "{SECOND_TEXT}", "{THIRD_TEXT}"]
  }
}; 