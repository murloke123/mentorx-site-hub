
import React from "react";

const BadgesSection = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl p-8 border border-gray-700 mt-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-4">
          🏆 Brasões do Mentor
        </h3>
        <p className="text-gray-300 leading-relaxed text-lg">
          Após esse mentor conquistar esses <span className="text-yellow-400 font-semibold">três Brasões</span>, 
          seus seguidores terão <span className="text-green-400 font-semibold">descontos automaticamente</span>. 
          Não deixe para seguir tarde, pois você poderá <span className="text-red-400 font-semibold">perder essa chance</span>!
        </p>
      </div>

      {/* Badges Container */}
      <div className="flex justify-center items-center">
        <div className="relative">
          {/* Badge Image */}
          <div className="w-48 h-48 mx-auto">
            <img 
              src="/lovable-uploads/5b41e98a-039f-436b-9369-0dcc44155aa6.png"
              alt="Brasão do Mentor"
              className="w-full h-full object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
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
