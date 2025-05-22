
import React from "react";
import MentorSidebar from "@/components/mentor/MentorSidebar";
import DatabaseFieldsComparison from "@/components/mentor/configuracoes/DatabaseFieldsComparison";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

const DatabaseMappingPage = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <MentorSidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Migração concluída</AlertTitle>
          <AlertDescription>
            A estrutura do banco de dados foi atualizada com sucesso. Agora todas as colunas usam nomes em inglês, 
            compatíveis com as definições de tipo no TypeScript. Alguns ajustes foram feitos no código para corrigir 
            referências às tabelas renomeadas.
          </AlertDescription>
        </Alert>
        
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <CheckCircle2 className="h-4 w-4 text-blue-600" />
          <AlertTitle>Importante</AlertTitle>
          <AlertDescription>
            Note que a tabela 'inscricoes' ainda manteve seu nome original em vez de ser renomeada para 'enrollments'.
            Todas as consultas ao banco de dados foram atualizadas para refletir essa diferença.
          </AlertDescription>
        </Alert>
        
        <DatabaseFieldsComparison />
      </div>
    </div>
  );
};

export default DatabaseMappingPage;
