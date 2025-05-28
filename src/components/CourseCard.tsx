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

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
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

  // Função para navegar ao perfil público do mentor
  const handleMentorClick = () => {
    if (course.mentor_id) {
      navigate(`/mentor/publicview/${course.mentor_id}`);
    }
  };

  const renderPrice = () => {
    if (!course.is_paid) {
  return (
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
            <span className="text-2xl font-bold text-green-600">
              GRATUITO
            </span>
            <p className="text-xs text-green-600 font-medium mt-1">
              Acesso vitalício
            </p>
          </div>
        </div>
      );
    }

    if (course.discounted_price && course.price && course.discount && course.discount > 0) {
      return (
        <div className="text-center relative">
          {/* Badge de desconto chamativo */}
          <div className="absolute -top-3 -right-2 z-10">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
              -{course.discount}% OFF
            </div>
          </div>
          
          {/* Container de preços com destaque */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-red-200 rounded-xl p-4 relative overflow-hidden">
            {/* Efeito de brilho */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-1">
                <span className="text-2xl font-bold text-green-600">
                  R$ {course.discounted_price.toFixed(2)}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  R$ {course.price.toFixed(2)}
                  </span>
              </div>
              <p className="text-xs text-red-600 font-semibold">
                🔥 Oferta por tempo limitado!
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (course.price && course.price > 0) {
      return (
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
            <span className="text-2xl font-bold text-blue-600">
              R$ {course.price.toFixed(2)}
            </span>
            <p className="text-xs text-blue-600 font-medium mt-1">
              Acesso vitalício
            </p>
          </div>
        </div>
      );
    }

    // Fallback para cursos sem preço definido
    return (
      <div className="text-center">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
          <span className="text-2xl font-bold text-green-600">
            GRATUITO
          </span>
          <p className="text-xs text-green-600 font-medium mt-1">
            Acesso vitalício
          </p>
        </div>
      </div>
    );
  };

  const mentorName = course.mentor_name || course.mentor?.full_name || 'Mentor';
  const mentorAvatar = course.mentor_avatar || course.mentor?.avatar_url;

  const cardStyles = {
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    maxWidth: '500px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    height: 'auto'
  };

  const cardHoverStyles = {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
  };

  const imageStyles = {
    width: '100%',
    height: '200px',
    objectFit: 'cover' as const,
    display: 'block'
  };

  const contentStyles = {
    padding: '20px',
    flex: '1',
    display: 'flex',
    flexDirection: 'column' as const
  };

  const mentorSectionStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px'
  };

  const mentorAvatarStyles = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: '16px',
    flexShrink: 0,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
    overflow: 'hidden'
  };

  const mentorInfoStyles = {
    flex: 1
  };

  const mentorNameStyles = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a202c',
    margin: '0 0 4px 0',
    lineHeight: '1.2'
  };

  const mentorCategoryStyles = {
    fontSize: '14px',
    color: '#64748b',
    margin: '0'
  };

  const titleStyles = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a202c',
    margin: '0 0 12px 0',
    lineHeight: '1.3',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };

  const descriptionStyles = {
    fontSize: '14px',
    color: '#64748b',
    lineHeight: '1.5',
    margin: '0 0 auto 0',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    height: '63px', // 3 lines * 21px line height
    flex: '1'
  };

  const footerStyles = {
    padding: '0 20px 20px 20px',
    marginTop: 'auto'
  };

  const buttonStyles = {
    width: '100%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    height: '40px'
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
        <p style={descriptionStyles}>
          {course.description || "Aprenda com um dos melhores mentores da plataforma e transforme sua carreira profissional."}
        </p>
      </div>

      <div style={footerStyles}>
        <button 
          style={buttonStyles}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
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

export default CourseCard;
