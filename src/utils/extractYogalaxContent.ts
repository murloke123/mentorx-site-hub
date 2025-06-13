// Função para extrair conteúdo textual da página Yogalax
export async function extractYogalaxContent(): Promise<any> {
  try {
    console.log('🔍 Extraindo conteúdo da página Yogalax...');
    
    // Buscar o HTML da página yogalax-master
    const response = await fetch('/layouts/yogalax-master/index.html');
    const html = await response.text();
    
    // Criar um parser DOM
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Função auxiliar para extrair texto limpo
    const extractText = (selector: string): string => {
      const element = doc.querySelector(selector);
      return element?.textContent?.trim() || '';
    };
    
    // Função auxiliar para extrair array de textos
    const extractTextArray = (selector: string): string[] => {
      const elements = doc.querySelectorAll(selector);
      return Array.from(elements).map(el => el.textContent?.trim() || '').filter(text => text);
    };
    
    // Extrair conteúdo estruturado
    const content = {
      // Seção Hero
      hero: {
        brand: extractText('.navbar-brand'),
        title: extractText('.hero-wrap h1'),
        subtitle: extractText('.hero-wrap h2'),
        cta_button: extractText('.hero-wrap .btn-primary'),
        menu_items: extractTextArray('.navbar-nav .nav-link')
      },
      
      // Seção "Why Yoga"
      about: {
        title: extractText('.heading-section h2'),
        description: extractText('.ftco-intro p'),
        benefits: extractTextArray('.do-list li a')
      },
      
      // Seções de serviços
      services: {
        title: 'Healthy Lifestyle',
        items: extractTextArray('.services .text h3').map((title, index) => ({
          title,
          description: extractTextArray('.services .text p')[index] || ''
        }))
      },
      
      // Seção de aulas
      classes: {
        title: extractText('.ftco-section .heading-section h2'),
        subtitle: extractText('.ftco-section .heading-section h3'),
        programs: extractTextArray('.package-program h3').map((title, index) => ({
          title,
          description: extractTextArray('.package-program p')[index] || ''
        }))
      },
      
      // Seção de preços
      pricing: {
        title: 'Membership Cards',
        subtitle: 'Pricing Tables',
        plans: [
          {
            name: 'Year Card',
            price: '$449',
            period: 'For 1 Year',
            features: [
              'Onetime Access To All Club',
              'Group Trainer',
              'Book A Group Class',
              'Fitness Orientation'
            ]
          },
          {
            name: 'Monthly Card',
            price: '$200',
            period: 'For 1 Month',
            features: [
              'Group Classes',
              'Discuss Fitness Goals',
              'Group Trainer',
              'Fitness Orientation'
            ]
          },
          {
            name: 'Weekly Card',
            price: '$85',
            period: 'For 1 Week',
            features: [
              'Group Classes',
              'Discuss Fitness Goals',
              'Group Trainer',
              'Fitness Orientation'
            ]
          }
        ]
      },
      
      // Seção de depoimentos
      testimonials: {
        title: 'Successful Stories',
        subtitle: 'Testimony',
        items: extractTextArray('.testimony-wrap .name').map((name, index) => ({
          name,
          position: extractTextArray('.testimony-wrap .position')[index] || '',
          text: extractTextArray('.testimony-wrap p')[index] || ''
        }))
      },
      
      // Seção de estatísticas
      stats: {
        items: [
          { number: '5000', label: 'Happy Customers' },
          { number: '4560', label: 'Yoga Workshops' },
          { number: '570', label: 'Years of Experience' },
          { number: '900', label: 'Lesson Conducted' }
        ]
      },
      
      // Seção de blog
      blog: {
        title: 'Recent Posts',
        subtitle: 'Blog',
        posts: extractTextArray('.blog-entry h3 a').map((title, index) => ({
          title,
          excerpt: extractTextArray('.blog-entry p')[index] || ''
        }))
      },
      
      // Footer
      footer: {
        brand: 'Yogalax',
        address: extractText('.ftco-footer-widget .location'),
        copyright: extractText('.col-md-12.text-center p')
      }
    };
    
    console.log('✅ Conteúdo extraído com sucesso!');
    console.log('📊 Seções encontradas:', Object.keys(content).length);
    
    return content;
    
  } catch (error) {
    console.error('❌ Erro ao extrair conteúdo Yogalax:', error);
    throw error;
  }
} 