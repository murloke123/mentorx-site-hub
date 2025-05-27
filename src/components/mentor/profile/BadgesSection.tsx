import React from "react";

const BadgesSection = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl p-6 border border-gray-700 mt-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h4 className="text-xl font-bold text-white mb-3">
          🏆 Brasões do Mentor
        </h4>
        <p className="text-white leading-relaxed text-sm">
          Após esse mentor conquistar esses <span className="text-white font-semibold">três Brasões</span>, 
          seus seguidores terão <span className="text-white font-semibold">descontos automaticamente</span>. 
          <br /> Não deixe para seguir tarde, pois você poderá <span className="text-white font-semibold">perder essa chance</span>!
        </p>
      </div>

      {/* Badges Container */}
      <div className="flex justify-center items-center">
        <div className="relative">
          {/* Badge Image - Aumentado mais 20% (de w-40 h-40 para w-48 h-48) */}
          <div className="w-48 h-48 mx-auto">
            <img 
              src="/src/img/brasoessemfundo.png"
              alt="Brasões do Mentor"
              className="w-full h-full object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
              style={{ 
                imageRendering: 'crisp-edges',
                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
                transform: 'perspective(1000px) rotateX(5deg)'
              }}
            />
          </div>
          
          {/* Reflection Effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default BadgesSection;
