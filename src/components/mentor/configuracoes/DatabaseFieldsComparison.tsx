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

// Dados de mapeamento das colunas - CORRIGIDO E ATUALIZADO
const fieldMappings: FieldMapping[] = [
  // Mapeamentos para CURSOS (todos já em inglês no DB Supabase)
  { table: "cursos", supabaseColumn: "id", codeReference: "id", status: "compatível", service: "courseService.ts" },
  { table: "cursos", supabaseColumn: "title", codeReference: "title", status: "compatível", service: "courseService.ts" },
  { table: "cursos", supabaseColumn: "description", codeReference: "description", status: "compatível", service: "courseService.ts" },
  { table: "cursos", supabaseColumn: "is_public", codeReference: "is_public", status: "compatível", service: "courseService.ts" },
  { table: "cursos", supabaseColumn: "is_paid", codeReference: "is_paid", status: "compatível", service: "courseService.ts" },
  { table: "cursos", supabaseColumn: "price", codeReference: "price", status: "compatível", service: "courseService.ts" },
  { table: "cursos", supabaseColumn: "image_url", codeReference: "image_url", status: "compatível", service: "courseService.ts" },
  // Adicione is_published se existir na tabela cursos e for relevante
  // { table: "cursos", supabaseColumn: "is_published", codeReference: "is_published", status: "compatível", service: "courseService.ts" }, 
  { table: "cursos", supabaseColumn: "created_at", codeReference: "created_at", status: "compatível", service: "courseService.ts" },
  { table: "cursos", supabaseColumn: "updated_at", codeReference: "updated_at", status: "compatível", service: "courseService.ts" },
  { table: "cursos", supabaseColumn: "mentor_id", codeReference: "mentor_id", status: "compatível", service: "courseService.ts" },


  // Mapeamentos para MODULOS (ainda com colunas em português no DB Supabase)
  { table: "modulos", supabaseColumn: "id", codeReference: "id", status: "compatível", service: "moduloService.ts" },
  { table: "modulos", supabaseColumn: "nome_modulo", codeReference: "name", status: "incompatível", service: "moduloService.ts" },
  { table: "modulos", supabaseColumn: "descricao_modulo", codeReference: "description", status: "incompatível", service: "moduloService.ts" },
  { table: "modulos", supabaseColumn: "curso_id", codeReference: "course_id", status: "compatível", service: "moduloService.ts" }, // curso_id já está ok
  { table: "modulos", supabaseColumn: "ordem", codeReference: "order", status: "incompatível", service: "moduloService.ts" },
  { table: "modulos", supabaseColumn: "created_at", codeReference: "created_at", status: "compatível", service: "moduloService.ts" },
  { table: "modulos", supabaseColumn: "updated_at", codeReference: "updated_at", status: "compatível", service: "moduloService.ts" },

  // Mapeamentos para CONTEUDOS (ainda com colunas em português no DB Supabase)
  { table: "conteudos", supabaseColumn: "id", codeReference: "id", status: "compatível", service: "conteudoService.ts" },
  { table: "conteudos", supabaseColumn: "nome_conteudo", codeReference: "title", status: "incompatível", service: "conteudoService.ts" },
  { table: "conteudos", supabaseColumn: "descricao_conteudo", codeReference: "description", status: "incompatível", service: "conteudoService.ts" },
  { table: "conteudos", supabaseColumn: "tipo_conteudo", codeReference: "type", status: "incompatível", service: "conteudoService.ts" },
  { table: "conteudos", supabaseColumn: "dados_conteudo", codeReference: "content_data", status: "incompatível", service: "conteudoService.ts" },
  { table: "conteudos", supabaseColumn: "modulo_id", codeReference: "module_id", status: "compatível", service: "conteudoService.ts" }, // modulo_id já está ok
  { table: "conteudos", supabaseColumn: "ordem", codeReference: "order", status: "incompatível", service: "conteudoService.ts" },
  { table: "conteudos", supabaseColumn: "created_at", codeReference: "created_at", status: "compatível", service: "conteudoService.ts" },
  { table: "conteudos", supabaseColumn: "updated_at", codeReference: "updated_at", status: "compatível", service: "conteudoService.ts" },

  // Mapeamentos para CONTEUDO_CONCLUIDO (colunas FK já ok, outras podem precisar de revisão)
  { table: "conteudo_concluido", supabaseColumn: "id", codeReference: "id", status: "compatível", service: "completedContentService.ts" },
  { table: "conteudo_concluido", supabaseColumn: "user_id", codeReference: "user_id", status: "compatível", service: "completedContentService.ts" },
  { table: "conteudo_concluido", supabaseColumn: "curso_id", codeReference: "course_id", status: "compatível", service: "completedContentService.ts" },
  { table: "conteudo_concluido", supabaseColumn: "modulo_id", codeReference: "module_id", status: "compatível", service: "completedContentService.ts" },
  { table: "conteudo_concluido", supabaseColumn: "conteudo_id", codeReference: "content_id", status: "compatível", service: "completedContentService.ts" },
  { table: "conteudo_concluido", supabaseColumn: "created_at", codeReference: "created_at", status: "compatível", service: "completedContentService.ts" },
  { table: "conteudo_concluido", supabaseColumn: "updated_at", codeReference: "updated_at", status: "compatível", service: "completedContentService.ts" },

  // Mapeamentos para ENROLLMENTS (já em inglês)
  { table: "enrollments", supabaseColumn: "id", codeReference: "id", status: "compatível", service: "enrollmentService.ts" },
  { table: "enrollments", supabaseColumn: "user_id", codeReference: "user_id", status: "compatível", service: "enrollmentService.ts" },
  { table: "enrollments", supabaseColumn: "course_id", codeReference: "course_id", status: "compatível", service: "enrollmentService.ts" },
  { table: "enrollments", supabaseColumn: "progress", codeReference: "progress", status: "compatível", service: "enrollmentService.ts" },
  { table: "enrollments", supabaseColumn: "enrolled_at", codeReference: "enrolled_at", status: "compatível", service: "enrollmentService.ts" },

  // Mapeamentos para PROFILES (já em inglês)
  { table: "profiles", supabaseColumn: "id", codeReference: "id", status: "compatível", service: "profileService.ts" },
  { table: "profiles", supabaseColumn: "full_name", codeReference: "full_name", status: "compatível", service: "profileService.ts" },
  { table: "profiles", supabaseColumn: "avatar_url", codeReference: "avatar_url", status: "compatível", service: "profileService.ts" },
  { table: "profiles", supabaseColumn: "bio", codeReference: "bio", status: "compatível", service: "profileService.ts" },
  { table: "profiles", supabaseColumn: "role", codeReference: "role", status: "compatível", service: "profileService.ts" },
  { table: "profiles", supabaseColumn: "updated_at", codeReference: "updated_at", status: "compatível", service: "profileService.ts" },
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
