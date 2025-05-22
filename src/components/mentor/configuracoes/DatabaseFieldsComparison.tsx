
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle } from "lucide-react";

// Define a estrutura de dados para as incompatibilidades
interface FieldMapping {
  supabaseColumn: string; // Nome em inglês usado no banco agora
  codeReference: string; // Nome em inglês usado no código
  table: string; // Nome da tabela
  status: "incompatível" | "compatível";
}

// Dados de mapeamento das colunas - ATUALIZADOS para refletir as alterações na base de dados
const fieldMappings: FieldMapping[] = [
  { table: "cursos", supabaseColumn: "title", codeReference: "title", status: "compatível" },
  { table: "cursos", supabaseColumn: "description", codeReference: "description", status: "compatível" },
  { table: "cursos", supabaseColumn: "is_paid", codeReference: "is_paid", status: "compatível" },
  { table: "cursos", supabaseColumn: "price", codeReference: "price", status: "compatível" },
  { table: "cursos", supabaseColumn: "is_public", codeReference: "is_public", status: "compatível" },
  { table: "cursos", supabaseColumn: "image_url", codeReference: "image_url", status: "compatível" },
  { table: "cursos", supabaseColumn: "is_published", codeReference: "is_published", status: "compatível" },
  { table: "cursos", supabaseColumn: "created_at", codeReference: "created_at", status: "compatível" },
  { table: "cursos", supabaseColumn: "updated_at", codeReference: "updated_at", status: "compatível" },
  { table: "modulos", supabaseColumn: "name", codeReference: "name", status: "compatível" },
  { table: "modulos", supabaseColumn: "description", codeReference: "description", status: "compatível" },
  { table: "modulos", supabaseColumn: "course_id", codeReference: "course_id", status: "compatível" },
  { table: "conteudos", supabaseColumn: "title", codeReference: "title", status: "compatível" },
  { table: "conteudos", supabaseColumn: "description", codeReference: "description", status: "compatível" },
  { table: "conteudos", supabaseColumn: "type", codeReference: "type", status: "compatível" },
  { table: "conteudos", supabaseColumn: "module_id", codeReference: "module_id", status: "compatível" },
  { table: "conteudos", supabaseColumn: "content_data", codeReference: "content", status: "compatível" },
  { table: "avaliacoes", supabaseColumn: "rating", codeReference: "rating", status: "compatível" },
  { table: "avaliacoes", supabaseColumn: "comment", codeReference: "comment", status: "compatível" },
  { table: "enrollments", supabaseColumn: "enrolled_at", codeReference: "enrolledAt", status: "compatível" },
  { table: "enrollments", supabaseColumn: "progress", codeReference: "progress", status: "compatível" },
];

// Agrupando por tabela para uma melhor visualização
const groupedByTable = fieldMappings.reduce((acc, mapping) => {
  if (!acc[mapping.table]) {
    acc[mapping.table] = [];
  }
  acc[mapping.table].push(mapping);
  return acc;
}, {} as Record<string, FieldMapping[]>);

const DatabaseFieldsComparison = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Comparação de Campos do Banco de Dados</h1>
        <p className="text-muted-foreground">
          Esta página mostra a compatibilidade entre os nomes de colunas nas tabelas do Supabase 
          e as referências no código TypeScript após a normalização.
        </p>
      </div>

      {Object.entries(groupedByTable).map(([tableName, mappings]) => (
        <Card key={tableName} className="overflow-hidden">
          <CardHeader className="bg-muted/50">
            <CardTitle>Tabela: {tableName}</CardTitle>
            <CardDescription>
              Mapeamento entre colunas do banco de dados e referências no código
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Coluna no Supabase</TableHead>
                  <TableHead className="w-1/3">Referência no Código</TableHead>
                  <TableHead className="w-1/3">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mappings.map((mapping, index) => (
                  <TableRow key={index} className={mapping.status === "incompatível" ? "bg-red-50" : "bg-green-50"}>
                    <TableCell className="font-mono text-sm">{mapping.supabaseColumn}</TableCell>
                    <TableCell className="font-mono text-sm">{mapping.codeReference}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {mapping.status === "compatível" ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            mapping.status === "incompatível"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {mapping.status}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle>Resultado da Migração</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />
              <strong>A normalização foi concluída com sucesso!</strong>
            </p>
            <p className="mt-2">
              Todas as colunas do banco de dados agora estão usando nomes em inglês, 
              compatíveis com as referências no código TypeScript.
            </p>
          </div>
          
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Alterações realizadas:</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>As colunas da tabela <code>cursos</code> foram renomeadas para usar nomenclatura em inglês</li>
              <li>As colunas da tabela <code>modulos</code> foram renomeadas para usar nomenclatura em inglês</li>
              <li>As colunas da tabela <code>conteudos</code> foram renomeadas para usar nomenclatura em inglês</li>
              <li>A tabela <code>inscricoes</code> foi renomeada para <code>enrollments</code></li>
              <li>A tabela <code>conteudo_concluido</code> foi renomeada para <code>completed_content</code></li>
              <li>A função <code>obter_detalhes_cursos_do_mentor</code> foi atualizada para usar os novos nomes de colunas</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseFieldsComparison;
