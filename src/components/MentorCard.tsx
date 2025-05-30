import React, { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MessageCircle, User, Mail, Phone } from "lucide-react";
import { Mentor } from "@/types/mentor";
import { useNavigate } from "react-router-dom";

interface MentorCardProps {
  mentor: Mentor;
  index?: number;
}

// Função para remover tags HTML e renderizar texto limpo
const stripHtmlTags = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

// Função para truncar texto em aproximadamente 5 linhas (cerca de 300 caracteres)
const truncateText = (text: string, maxLength: number = 300) => {
  if (text.length <= maxLength) return text;
  
  // Encontra o último espaço antes do limite para não cortar palavras
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
};

export const MentorCard: React.FC<MentorCardProps> = ({ mentor, index = 0 }) => {
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);

  const handleViewProfile = () => {
    navigate(`/mentor/publicview/${mentor.id}`);
  };

  const handleContact = () => {
    if (mentor.phone) {
      window.open(`https://wa.me/${mentor.phone.replace(/\D/g, '')}`, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      className="w-full max-w-sm mx-auto h-96"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={handleViewProfile}
    >
      <div className="relative w-full h-full [perspective:1000px] cursor-pointer">
        <motion.div
          className="relative w-full h-full [transform-style:preserve-3d]"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Frente do Card */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-white rounded-xl shadow-xl border overflow-hidden">
            {/* Header com gradiente */}
            <div className="relative bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 overflow-hidden" style={{ height: '110px' }}>
              <div className="absolute inset-0 bg-black/10" style={{ height: '110px' }}></div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
            </div>

            {/* Avatar */}
            <div className="relative flex justify-center" style={{ marginTop: '-50px' }}>
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                  <AvatarImage 
                    src={mentor.avatar_url || undefined} 
                    alt={mentor.full_name || "Mentor"}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xl font-bold">
                    {mentor.full_name?.charAt(0) || "M"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
            </div>

            {/* Conteúdo da Frente */}
            <div className="p-6 pt-4 text-center">
              {/* Nome e Badge */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {mentor.full_name || "Mentor"}
                </h3>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                  <Star className="w-3 h-3 mr-1" />
                  Mentor Verificado
                </Badge>
              </div>

              {/* Highlight Message */}
              {mentor.highlight_message && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded-lg mb-4 border-l-4 border-purple-500">
                  <p className="text-sm text-gray-700 italic">
                    "{mentor.highlight_message}"
                  </p>
                </div>
              )}

              {/* Especialidades */}
              {(mentor.sm_tit1 || mentor.sm_tit2 || mentor.sm_tit3) && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Especialidades:</h4>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {mentor.sm_tit1 && (
                      <Badge variant="outline" className="text-xs">
                        {mentor.sm_tit1}
                      </Badge>
                    )}
                    {mentor.sm_tit2 && (
                      <Badge variant="outline" className="text-xs">
                        {mentor.sm_tit2}
                      </Badge>
                    )}
                    {mentor.sm_tit3 && (
                      <Badge variant="outline" className="text-xs">
                        {mentor.sm_tit3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Indicação para virar o card */}
              <div className="mt-auto pt-4">
                <p className="text-xs text-gray-500 italic">Passe o mouse para saber mais</p>
              </div>
            </div>
          </div>

          {/* Verso do Card */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white rounded-xl shadow-xl border overflow-hidden">
            <div className="p-6 h-full flex flex-col">
              {/* Header do verso com foto */}
              <div className="text-center mb-4">
                <Avatar className="w-16 h-16 mx-auto mb-3 border-2 border-purple-200">
                  <AvatarImage 
                    src={mentor.avatar_url || undefined} 
                    alt={mentor.full_name || "Mentor"}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-lg font-bold">
                    {mentor.full_name?.charAt(0) || "M"}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-bold text-gray-800">
                  Sobre {mentor.full_name?.split(' ')[0] || "o Mentor"}
                </h3>
              </div>

              {/* Bio com borda */}
              <div className="flex-1 mb-4">
                {mentor.bio ? (
                  <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="text-sm text-gray-700 leading-relaxed">
                      <p className="whitespace-pre-line">{truncateText(stripHtmlTags(mentor.bio))}</p>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="text-sm text-gray-500 italic text-center">
                      Este mentor ainda não adicionou uma biografia.
                    </div>
                  </div>
                )}
              </div>

              {/* Call to action */}
              <div className="text-center mb-4">
                <p className="text-xs text-gray-600 mb-2">
                  Clique no card para ver o perfil completo
                </p>
              </div>

              {/* Botões de ação */}
              <div className="flex gap-2">
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewProfile();
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                  size="sm"
                >
                  <User className="w-4 h-4 mr-2" />
                  Ver Perfil Completo
                </Button>
                {mentor.phone && (
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContact();
                    }}
                    variant="outline"
                    size="sm"
                    className="border-purple-200 text-purple-600 hover:bg-purple-50"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MentorCard;
