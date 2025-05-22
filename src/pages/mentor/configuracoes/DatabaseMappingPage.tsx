
import React from "react";
import MentorSidebar from "@/components/mentor/MentorSidebar";
import DatabaseFieldsComparison from "@/components/mentor/configuracoes/DatabaseFieldsComparison";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertTriangle } from "lucide-react";

const DatabaseMappingPage = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <MentorSidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Migração concluída</AlertTitle>
          <AlertDescription>
            A estrutura do banco de dados foi atualizada com sucesso. A tabela "inscricoes" foi renomeada para "enrollments"
            e as colunas foram atualizadas para usar nomes em inglês compatíveis com as definições de tipo no TypeScript.
          </AlertDescription>
        </Alert>
        
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <CheckCircle2 className="h-4 w-4 text-blue-600" />
          <AlertTitle>Compatibilidade</AlertTitle>
          <AlertDescription>
            Todas as consultas ao banco de dados foram atualizadas para refletir a nova estrutura. O código JavaScript agora usa
            consistentemente "enrollments" em vez de "inscricoes" para maior clareza e padronização.
          </AlertDescription>
        </Alert>
        
        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle>Tabelas do Banco de Dados</AlertTitle>
          <AlertDescription>
            <p>Tabelas renomeadas:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>inscricoes → enrollments</li>
            </ul>
            <p className="mt-2">Colunas renomeadas:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>usuario_id → user_id</li>
              <li>curso_id → course_id</li>
              <li>data_inscricao → enrolled_at</li>
              <li>progresso → progress</li>
            </ul>
          </AlertDescription>
        </Alert>
        
        <DatabaseFieldsComparison />
      </div>
    </div>
  );
};

export default DatabaseMappingPage;
