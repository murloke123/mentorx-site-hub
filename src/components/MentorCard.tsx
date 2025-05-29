import React from "react";
import { motion } from "framer-motion";
import { TiltedCard } from "@/components/ui/tilted-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Users, Star, MessageCircle } from "lucide-react";
import { Mentor } from "@/types/mentor";
import { useNavigate } from "react-router-dom";

interface MentorCardProps {
  mentor: Mentor;
  index?: number;
}

export const MentorCard: React.FC<MentorCardProps> = ({ mentor, index = 0 }) => {
  const navigate = useNavigate();

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
      className="w-full max-w-sm mx-auto"
    >
      <TiltedCard 
        className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
        tiltDegree={8}
        hoverScale={1.03}
        duration={0.4}
      >
        {/* Header com gradiente */}
        <div className="relative h-32 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
        </div>

        {/* Avatar */}
        <div className="relative -mt-16 flex justify-center">
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

        {/* Conteúdo */}
        <div className="p-6 pt-4">
          {/* Nome e Badge */}
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {mentor.full_name || "Mentor"}
            </h3>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
              <Star className="w-3 h-3 mr-1" />
              Mentor Verificado
            </Badge>
          </div>

          {/* Bio */}
          {mentor.bio && (
            <p className="text-gray-600 text-sm text-center mb-4 line-clamp-3">
              {mentor.bio}
            </p>
          )}

          {/* Highlight Message */}
          {mentor.highlight_message && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded-lg mb-4 border-l-4 border-purple-500">
              <p className="text-sm text-gray-700 italic">
                "{mentor.highlight_message}"
              </p>
            </div>
          )}

          {/* Estatísticas */}
          <div className="flex justify-center gap-6 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mb-1">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm font-semibold text-gray-800">
                {mentor.courses_count || 0}
              </p>
              <p className="text-xs text-gray-500">Cursos</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mb-1">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm font-semibold text-gray-800">
                {mentor.followers_count || 0}
              </p>
              <p className="text-xs text-gray-500">Seguidores</p>
            </div>
          </div>

          {/* Especialidades */}
          {(mentor.sm_tit1 || mentor.sm_tit2 || mentor.sm_tit3) && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Especialidades:</h4>
              <div className="flex flex-wrap gap-1">
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

          {/* Botões de ação */}
          <div className="flex gap-2">
            <Button 
              onClick={handleViewProfile}
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
              size="sm"
            >
              Ver Perfil
            </Button>
            {mentor.phone && (
              <Button 
                onClick={handleContact}
                variant="outline"
                size="sm"
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Efeito de brilho no hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none transform -skew-x-12 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000"></div>
      </TiltedCard>
    </motion.div>
  );
};

export default MentorCard;
