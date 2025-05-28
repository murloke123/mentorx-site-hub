import React, { useState, useEffect } from "react";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCategories } from "@/hooks/useCategories";
import { useNavigate } from "react-router-dom";

interface Course {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  price?: number;
  discounted_price?: number;
  discount?: number;
  is_paid: boolean;
  category?: string;
  mentor_id?: string;
  mentor_name?: string;
  mentor_avatar?: string;
  mentor?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface CourseCardGridProps {
  course: Course;
}

const CourseCardGrid: React.FC<CourseCardGridProps> = ({ course }) => {
  const { categories } = useCategories();
  const [categoryName, setCategoryName] = useState<string>('Categoria não definida');
  const navigate = useNavigate();

  useEffect(() => {
    if (course.category && categories.length > 0) {
      // Se course.category é um ID, buscar o nome da categoria
      const foundCategory = categories.find(cat => cat.id === course.category);
      if (foundCategory) {
        setCategoryName(foundCategory.name);
      } else {
        // Se não encontrou por ID, pode ser um nome/slug antigo
        setCategoryName(getCourseCategory());
      }
    } else {
      setCategoryName(getCourseCategory());
    }
  }, [course.category, categories]);
  
  const getCourseCategory = () => {
    if (course.category) {
      // Traduzir categorias para português (para compatibilidade com dados antigos)
      const categoryMap: { [key: string]: string } = {
        'personal-development': 'Desenvolvimento Pessoal',
        'programming': 'Programação',
        'finance': 'Finanças',
        'leadership': 'Liderança',
        'digital-marketing': 'Marketing Digital',
        'sales': 'Vendas',
        'business': 'Negócios',
        'design': 'Design',
        'technology': 'Tecnologia',
        'marketing': 'Marketing',
        'entrepreneurship': 'Empreendedorismo'
      };
      return categoryMap[course.category.toLowerCase()] || course.category;
    }
    
    // Categorias baseadas no título (fallback)
    const title = course.title.toLowerCase();
    if (title.includes('marketing') || title.includes('digital')) return 'Marketing Digital';
    if (title.includes('desenvolvimento') || title.includes('programação') || title.includes('code')) return 'Desenvolvimento';
    if (title.includes('finanças') || title.includes('investimento')) return 'Finanças';
    if (title.includes('liderança') || title.includes('gestão')) return 'Liderança';
    if (title.includes('negócios') || title.includes('empreendedorismo')) return 'Negócios';
    if (title.includes('design')) return 'Design';
    if (title.includes('vendas')) return 'Vendas';
    
    return 'Curso Online';
  };

  // Função para obter as iniciais do mentor
  const getMentorInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const mentorName = course.mentor_name || course.mentor?.full_name || 'Mentor';
  const mentorAvatar = course.mentor_avatar || course.mentor?.avatar_url;

  // Função para navegar ao perfil público do mentor
  const handleMentorClick = () => {
    if (course.mentor_id) {
      navigate(`/mentor/publicview/${course.mentor_id}`);
    }
  };

  const cardStyles = {
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    width: '100%',
    maxWidth: '350px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column' as const,
    height: '420px' // Altura reduzida de 480px para 420px
  };

  const cardHoverStyles = {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
  };

  const imageStyles = {
    width: '100%',
    height: '180px',
    objectFit: 'cover' as const,
    display: 'block'
  };

  const contentStyles = {
    padding: '16px',
    flex: '1',
    display: 'flex',
    flexDirection: 'column' as const
  };

  const mentorSectionStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px'
  };

  const mentorAvatarStyles = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: '14px',
    flexShrink: 0,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
    overflow: 'hidden'
  };

  const mentorInfoStyles = {
    flex: 1,
    minWidth: 0 // Para permitir text-overflow
  };

  const mentorNameStyles = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1a202c',
    margin: '0 0 2px 0',
    lineHeight: '1.2',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };

  const mentorCategoryStyles = {
    fontSize: '12px',
    color: '#64748b',
    margin: '0',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };

  const titleStyles = {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a202c',
    margin: '0 0 10px 0',
    lineHeight: '1.3',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    height: '20.8px' // 1 line * 20.8px line height (16px * 1.3)
  };

  const descriptionStyles = {
    fontSize: '13px',
    color: '#64748b',
    lineHeight: '1.4',
    margin: '0',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    height: '54.6px', // 3 lines * 18.2px line height (13px * 1.4)
    wordBreak: 'break-word' as const,
    maxHeight: '54.6px' // Garantia adicional
  };

  const footerStyles = {
    padding: '0 16px 16px 16px',
    marginTop: 'auto'
  };

  const buttonStyles = {
    width: '100%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    height: '36px'
  };

  return (
    <div 
      style={cardStyles}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, cardHoverStyles);
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, cardStyles);
      }}
    >
      <img 
        src={course.image_url} 
        alt={course.title}
        style={imageStyles}
      />
      
      <div style={contentStyles}>
        <div style={mentorSectionStyles}>
          <div 
            style={mentorAvatarStyles}
            onClick={handleMentorClick}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {mentorAvatar ? (
              <img 
                src={mentorAvatar} 
                alt={mentorName}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  transition: 'all 0.3s ease'
                }}
                onError={(e) => {
                  // Fallback para iniciais se a imagem falhar ao carregar
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = getMentorInitials(mentorName);
                    parent.style.display = 'flex';
                    parent.style.alignItems = 'center';
                    parent.style.justifyContent = 'center';
                  }
                }}
              />
            ) : (
              getMentorInitials(mentorName)
            )}
          </div>
          <div style={mentorInfoStyles}>
            <h4 style={mentorNameStyles}>{mentorName}</h4>
            <p style={mentorCategoryStyles}>{categoryName}</p>
          </div>
        </div>

        <h3 style={titleStyles}>{course.title}</h3>
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column' as const, justifyContent: 'flex-start' }}>
          <p style={descriptionStyles}>
            {course.description || "Aprenda com um dos melhores mentores da plataforma e transforme sua carreira profissional."}
          </p>
        </div>
      </div>

      <div style={footerStyles}>
        <button 
          style={buttonStyles}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Ver Detalhes
        </button>
      </div>
    </div>
  );
};

export default CourseCardGrid; 