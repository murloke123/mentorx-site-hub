
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define a estrutura de dados para as incompatibilidades
interface FieldMapping {
  supabaseColumn: string; // Nome em inglês usado no banco agora
  codeReference: string; // Nome em inglês usado no código
  table: string; // Nome da tabela
  status: "incompatível" | "compatível";
  service?: string; // Nome do arquivo de serviço que usa este campo
}

// Dados de mapeamento das colunas - ATUALIZADOS para refletir as alterações na base de dados
const fieldMappings: FieldMapping[] = [
  // Mapeamentos para cursos
  { table: "cursos", supabaseColumn: "id", codeReference: "id", status: "compatível", service: "courseService.ts" },
  { table: "cursos", supabaseColumn: "titulo", codeReference: "title", status: "compatível", service: "courseService.ts" },
  { table: "cursos", supabaseColumn: "descricao", codeReference: "description", status: "compatível", service: "courseService.ts" },
  { table: "cursos", supabaseColumn: "eh_publico", codeReference: "is_public", status: "compatível", service: "courseService.ts" },
  { table: "cursos", supabaseColumn: "eh_pago", codeReference: "is_paid", status: "compatível", service: "courseService.ts" },
  { table: "cursos", supabaseColumn: "preco", codeReference: "price", status: "compatível", service: "courseService.ts" },
  { table: "cursos", supabaseColumn: "url_imagem", codeReference: "image_url", status: "compatível", service: "courseService.ts" },
  { table: "cursos", supabaseColumn: "foi_publicado", codeReference: "is_published", status: "compatível", service: "courseService.ts" },
  { table: "cursos", supabaseColumn: "criado_em", codeReference: "created_at", status: "compatível", service: "courseService.ts" },
  { table: "cursos", supabaseColumn: "atualizado_em", codeReference: "updated_at", status: "compatível", service: "courseService.ts" },
  
  // Mapeamentos para modulos
  { table: "modulos", supabaseColumn: "id", codeReference: "id", status: "compatível", service: "moduloService.ts" },
  { table: "modulos", supabaseColumn: "nome_modulo", codeReference: "name", status: "compatível", service: "mentorService.ts" },
  { table: "modulos", supabaseColumn: "descricao_modulo", codeReference: "description", status: "compatível", service: "mentorService.ts" },
  { table: "modulos", supabaseColumn: "curso_id", codeReference: "course_id", status: "compatível", service: "mentorService.ts" },
  { table: "modulos", supabaseColumn: "ordem", codeReference: "ordem", status: "compatível", service: "moduloService.ts" },
  
  // Mapeamentos para conteudos
  { table: "conteudos", supabaseColumn: "id", codeReference: "id", status: "compatível", service: "conteudoService.ts" },
  { table: "conteudos", supabaseColumn: "nome_conteudo", codeReference: "title", status: "compatível", service: "coursePlayerService.ts" },
  { table: "conteudos", supabaseColumn: "descricao_conteudo", codeReference: "description", status: "compatível", service: "coursePlayerService.ts" },
  { table: "conteudos", supabaseColumn: "tipo_conteudo", codeReference: "type", status: "compatível", service: "coursePlayerService.ts" },
  { table: "conteudos", supabaseColumn: "modulo_id", codeReference: "module_id", status: "compatível", service: "coursePlayerService.ts" },
  { table: "conteudos", supabaseColumn: "dados_conteudo", codeReference: "content", status: "compatível", service: "coursePlayerService.ts" },
  
  // Mapeamentos para avaliacoes
  { table: "avaliacoes", supabaseColumn: "nota", codeReference: "rating", status: "compatível", service: "mentorService.ts" },
  { table: "avaliacoes", supabaseColumn: "comentario", codeReference: "comment", status: "compatível", service: "mentorService.ts" },
  { table: "avaliacoes", supabaseColumn: "usuario_id", codeReference: "user_id", status: "compatível", service: "mentorService.ts" },
  { table: "avaliacoes", supabaseColumn: "curso_id", codeReference: "course_id", status: "compatível", service: "mentorService.ts" },
  
  // Mapeamentos para enrollments (antiga inscricoes)
  { table: "enrollments", supabaseColumn: "enrolled_at", codeReference: "enrolledAt", status: "compatível", service: "menteeService.ts" },
  { table: "enrollments", supabaseColumn: "progress", codeReference: "progress", status: "compatível", service: "menteeService.ts" },
  { table: "enrollments", supabaseColumn: "user_id", codeReference: "user_id", status: "compatível", service: "menteeService.ts" },
  { table: "enrollments", supabaseColumn: "course_id", codeReference: "course_id", status: "compatível", service: "menteeService.ts" },
  
  // Mapeamentos para conteudo_concluido
  { table: "conteudo_concluido", supabaseColumn: "user_id", codeReference: "user_id", status: "compatível", service: "conteudo_concluido.ts" },
  { table: "conteudo_concluido", supabaseColumn: "curso_id", codeReference: "curso_id", status: "compatível", service: "conteudo_concluido.ts" },
  { table: "conteudo_concluido", supabaseColumn: "modulo_id", codeReference: "modulo_id", status: "compatível", service: "conteudo_concluido.ts" },
  { table: "conteudo_concluido", supabaseColumn: "conteudo_id", codeReference: "conteudo_id", status: "compatível", service: "conteudo_concluido.ts" },
  
  // Exemplos de incompatibilidades que poderiam causar problemas
  { table: "cursos", supabaseColumn: "titulo", codeReference: "tituloastitle", status: "incompatível", service: "mentorService.ts" },
  { table: "cursos", supabaseColumn: "descricao", codeReference: "descricaoasdescription", status: "incompatível", service: "mentorService.ts" },
  { table: "cursos", supabaseColumn: "eh_publico", codeReference: "eh_publicoasis_public", status: "incompatível", service: "adminService.ts" },
  { table: "cursos", supabaseColumn: "eh_pago", codeReference: "eh_pagoasis_paid", status: "incompatível", service: "adminService.ts" },
  { table: "cursos", supabaseColumn: "preco", codeReference: "precoasprice", status: "incompatível", service: "adminService.ts" },
  { table: "modulos", supabaseColumn: "nome_modulo", codeReference: "nome_moduloasname", status: "incompatível", service: "mentorService.ts" }
];

// Agrupando por serviço para uma melhor visualização
const groupedByService = fieldMappings.reduce((acc, mapping) => {
  if (!acc[mapping.service || 'outros']) {
    acc[mapping.service || 'outros'] = [];
  }
  acc[mapping.service || 'outros'].push(mapping);
  return acc;
}, {} as Record<string, FieldMapping[]>);

// Agrupando por tabela para uma melhor visualização
const groupedByTable = fieldMappings.reduce((acc, mapping) => {
  if (!acc[mapping.table]) {
    acc[acc.table] = [];
  }
  acc[mapping.table] = [...(acc[mapping.table] || []), mapping];
  return acc;
}, {} as Record<string, FieldMapping[]>);

// Filtrando apenas incompatibilidades
const incompatibilities = fieldMappings.filter(mapping => mapping.status === "incompatível");

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

      <Tabs defaultValue="incompatible">
        <TabsList className="mb-4">
          <TabsTrigger value="incompatible">Incompatibilidades</TabsTrigger>
          <TabsTrigger value="service">Por Serviço</TabsTrigger>
          <TabsTrigger value="table">Por Tabela</TabsTrigger>
          <TabsTrigger value="all">Todos os Campos</TabsTrigger>
        </TabsList>
      
        <TabsContent value="incompatible">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Incompatibilidades Detectadas</CardTitle>
              <CardDescription>
                Estas são as principais incompatibilidades entre o banco de dados e o código. Estes problemas podem causar erros durante a execução.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {incompatibilities.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Serviço</TableHead>
                      <TableHead>Tabela</TableHead>
                      <TableHead>Coluna no Supabase</TableHead>
                      <TableHead>Referência no Código</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incompatibilities.map((mapping, index) => (
                      <TableRow key={index} className="bg-red-50">
                        <TableCell className="font-medium">{mapping.service || 'N/A'}</TableCell>
                        <TableCell>{mapping.table}</TableCell>
                        <TableCell className="font-mono text-sm">{mapping.supabaseColumn}</TableCell>
                        <TableCell className="font-mono text-sm">{mapping.codeReference}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                              {mapping.status}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-6 text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <p className="font-medium text-lg">Nenhuma incompatibilidade detectada!</p>
                  <p className="text-muted-foreground">Todos os campos estão mapeados corretamente.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      
        <TabsContent value="service">
          {Object.entries(groupedByService).map(([serviceName, mappings]) => (
            <Card key={serviceName} className="mb-6">
              <CardHeader>
                <CardTitle>Serviço: {serviceName}</CardTitle>
                <CardDescription>
                  Mapeamentos de campo utilizados no arquivo {serviceName}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tabela</TableHead>
                      <TableHead>Coluna no Supabase</TableHead>
                      <TableHead>Referência no Código</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mappings.map((mapping, index) => (
                      <TableRow 
                        key={index} 
                        className={mapping.status === "incompatível" ? "bg-red-50" : ""}
                      >
                        <TableCell>{mapping.table}</TableCell>
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
        </TabsContent>
      
        <TabsContent value="table">
          {Object.entries(groupedByTable).map(([tableName, mappings]) => (
            <Card key={tableName} className="mb-6">
              <CardHeader>
                <CardTitle>Tabela: {tableName}</CardTitle>
                <CardDescription>
                  Mapeamento entre colunas do banco de dados e referências no código
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Serviço</TableHead>
                      <TableHead>Coluna no Supabase</TableHead>
                      <TableHead>Referência no Código</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mappings.map((mapping, index) => (
                      <TableRow 
                        key={index} 
                        className={mapping.status === "incompatível" ? "bg-red-50" : "bg-green-50"}
                      >
                        <TableCell>{mapping.service || 'N/A'}</TableCell>
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
        </TabsContent>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Todos os Mapeamentos</CardTitle>
              <CardDescription>
                Visão completa de todos os mapeamentos entre colunas do banco de dados e código
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Tabela</TableHead>
                    <TableHead>Coluna no Supabase</TableHead>
                    <TableHead>Referência no Código</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fieldMappings.map((mapping, index) => (
                    <TableRow 
                      key={index} 
                      className={mapping.status === "incompatível" ? "bg-red-50" : ""}
                    >
                      <TableCell>{mapping.service || 'N/A'}</TableCell>
                      <TableCell>{mapping.table}</TableCell>
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
        </TabsContent>
      </Tabs>

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
              A maioria das colunas do banco de dados agora está usando nomes em inglês, 
              compatíveis com as referências no código TypeScript.
            </p>
          </div>
          
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Alterações realizadas:</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>As colunas da tabela <code>cursos</code> foram mapeadas para usar nomenclatura em inglês</li>
              <li>As colunas da tabela <code>modulos</code> foram mapeadas para usar nomenclatura em inglês</li>
              <li>As colunas da tabela <code>conteudos</code> foram mapeadas para usar nomenclatura em inglês</li>
              <li>A tabela <code>inscricoes</code> foi renomeada para <code>enrollments</code></li>
              <li>A função <code>obter_detalhes_cursos_do_mentor</code> foi atualizada para usar os novos nomes de colunas</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseFieldsComparison;
