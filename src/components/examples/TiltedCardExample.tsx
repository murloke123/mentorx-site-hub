import React from "react";
import { TiltedCard } from "@/components/ui/tilted-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const TiltedCardExample: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {/* Exemplo 1: Card simples */}
      <TiltedCard>
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle>Card com Tilt</CardTitle>
            <CardDescription>
              Este card tem efeito de inclinação no hover
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Passe o mouse sobre este card para ver o efeito de inclinação 3D!</p>
            <Button className="mt-4 w-full">
              Clique aqui
            </Button>
          </CardContent>
        </Card>
      </TiltedCard>

      {/* Exemplo 2: Card com imagem */}
      <TiltedCard tiltDegree={8} hoverScale={1.08}>
        <Card className="border-0 shadow-none">
          <div className="h-48 bg-gradient-to-br from-purple-500 to-blue-500 rounded-t-lg"></div>
          <CardHeader>
            <CardTitle>Card com Imagem</CardTitle>
            <CardDescription>
              Tilt mais acentuado e escala maior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Este card tem configurações personalizadas de tilt e escala.</p>
          </CardContent>
        </Card>
      </TiltedCard>

      {/* Exemplo 3: Card minimalista */}
      <TiltedCard 
        tiltDegree={3} 
        hoverScale={1.02} 
        duration={0.5}
        className="bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">Card Minimalista</h3>
          <p className="text-gray-600 mb-4">
            Efeito sutil com transição mais lenta
          </p>
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </TiltedCard>
    </div>
  );
};

export default TiltedCardExample; 