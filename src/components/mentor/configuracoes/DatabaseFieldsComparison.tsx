
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Define a estrutura de dados para as incompatibilidades
interface FieldMapping {
  supabaseColumn: string; // Nome em português usado no banco
  codeReference: string; // Nome em inglês usado no código
  table: string; // Nome da tabela
  status: "incompatível" | "compatível";
}

// Dados de mapeamento das colunas
const fieldMappings: FieldMapping[] = [
  { table: "cursos", supabaseColumn: "titulo", codeReference: "name/title", status: "incompatível" },
  { table: "cursos", supabaseColumn: "descricao", codeReference: "description", status: "incompatível" },
  { table: "cursos", supabaseColumn: "eh_pago", codeReference: "type === 'paid'", status: "incompatível" },
  { table: "cursos", supabaseColumn: "preco", codeReference: "price", status: "incompatível" },
  { table: "cursos", supabaseColumn: "eh_publico", codeReference: "visibility === 'public'", status: "incompatível" },
  { table: "cursos", supabaseColumn: "url_imagem", codeReference: "image", status: "incompatível" },
  { table: "cursos", supabaseColumn: "foi_publicado", codeReference: "isPublished", status: "incompatível" },
  { table: "modulos", supabaseColumn: "nome_modulo", codeReference: "name", status: "incompatível" },
  { table: "modulos", supabaseColumn: "descricao_modulo", codeReference: "description", status: "incompatível" },
  { table: "conteudos", supabaseColumn: "nome_conteudo", codeReference: "title", status: "incompatível" },
  { table: "conteudos", supabaseColumn: "descricao_conteudo", codeReference: "description", status: "incompatível" },
  { table: "conteudos", supabaseColumn: "tipo_conteudo", codeReference: "type", status: "incompatível" },
  { table: "conteudos", supabaseColumn: "dados_conteudo", codeReference: "content", status: "incompatível" },
  { table: "avaliacoes", supabaseColumn: "nota", codeReference: "rating", status: "incompatível" },
  { table: "avaliacoes", supabaseColumn: "comentario", codeReference: "comment", status: "incompatível" },
  { table: "inscricoes", supabaseColumn: "data_inscricao", codeReference: "enrolledAt", status: "incompatível" },
  { table: "inscricoes", supabaseColumn: "progresso", codeReference: "progress", status: "incompatível" },
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
          Esta página mostra as incompatibilidades entre os nomes de colunas nas tabelas do Supabase 
          (em português) e as referências no código TypeScript (em inglês).
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
                  <TableHead className="w-1/3">Coluna no Supabase (PT-BR)</TableHead>
                  <TableHead className="w-1/3">Referência no Código (EN)</TableHead>
                  <TableHead className="w-1/3">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mappings.map((mapping, index) => (
                  <TableRow key={index} className={mapping.status === "incompatível" ? "bg-red-50" : ""}>
                    <TableCell className="font-mono text-sm">{mapping.supabaseColumn}</TableCell>
                    <TableCell className="font-mono text-sm">{mapping.codeReference}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          mapping.status === "incompatível"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {mapping.status}
                      </span>
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
          <CardTitle>Como resolver esses problemas?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Existem duas abordagens principais para resolver esse problema:</p>
          
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong>Adaptar o código TypeScript:</strong> Modificar todas as referências no código para usar os 
              nomes em português que correspondem às colunas do banco de dados.
            </li>
            <li>
              <strong>Normalizar os dados:</strong> Quando os dados são carregados do banco de dados, 
              mapeá-los para um formato consistente para uso interno no código, e ao salvar, 
              mapeá-los de volta para o formato que o banco de dados espera.
            </li>
          </ol>

          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-amber-800">
              <strong>Nota:</strong> A abordagem mais recomendada é a segunda, pois permite manter uma 
              nomenclatura consistente no código enquanto atende às necessidades do banco de dados. 
              Isso já está sendo feito em algumas partes do seu código, mas precisa ser aplicado de maneira 
              mais consistente.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseFieldsComparison;
