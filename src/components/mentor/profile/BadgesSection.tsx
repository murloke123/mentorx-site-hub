
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
          {/* Badge Image with Animation */}
          <div className="w-32 h-32 mx-auto">
            <img 
              src="/lovable-uploads/a3bc62fd-37af-48de-b996-ccf25b010cd1.png"
              alt="Brasão do Mentor"
              className="w-full h-full object-contain animate-spin-slow opacity-90 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
          
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-red-500/20 rounded-full blur-xl animate-pulse"></div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full text-white font-semibold shadow-lg">
          <span className="mr-2">⭐</span>
          Status: Em Progresso
          <span className="ml-2">⭐</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default BadgesSection;
