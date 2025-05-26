
import React from "react";

const BadgesSection = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl p-6 border border-gray-700 mt-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-3">
          🏆 Brasões do Mentor
        </h3>
        <p className="text-white leading-relaxed text-sm">
          Após esse mentor conquistar esses <span className="text-white font-semibold">três Brasões</span>, 
          seus seguidores terão <span className="text-white font-semibold">descontos automaticamente</span>. 
          Não deixe para seguir tarde, pois você poderá <span className="text-white font-semibold">perder essa chance</span>!
        </p>
      </div>

      {/* Badges Container */}
      <div className="flex justify-center items-center">
        <div className="relative">
          {/* Badge Image - Aumentado de w-40 h-40 (160px) para w-52 h-52 (~208px) = ~30% maior */}
          <div className="w-52 h-52 mx-auto">
            <img 
              src="/src/img/brasoessemfundo.png"
              alt="Brasões do Mentor"
              className="w-full h-full object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
              style={{ imageRendering: 'crisp-edges' }}
            />
          </div>
          
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-red-500/20 rounded-full blur-xl animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default BadgesSection;
