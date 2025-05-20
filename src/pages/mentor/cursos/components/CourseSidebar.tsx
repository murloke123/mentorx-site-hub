
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ConteudoItemLocal, ModuloItemLocal } from '../types';

interface CourseSidebarProps {
  modulos: ModuloItemLocal[];
  currentConteudo: ConteudoItemLocal | null;
  conteudosConcluidos: Set<string>;
  onConteudoSelect: (conteudo: ConteudoItemLocal) => void;
  onToggleConteudoConcluido: (conteudoId: string, moduloId: string) => Promise<void>;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({ 
  modulos,
  currentConteudo,
  conteudosConcluidos,
  onConteudoSelect,
  onToggleConteudoConcluido
}) => {
  return (
    <aside className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Conteúdo do Curso</h3>
      <Accordion type="multiple" className="w-full" defaultValue={modulos.map(m => m.id)}>
        {modulos.map((modulo) => (
          <AccordionItem value={modulo.id} key={modulo.id}>
            <AccordionTrigger className="font-medium hover:bg-gray-50 p-2 rounded">
              {modulo.nome_modulo}
            </AccordionTrigger>
            <AccordionContent className="pl-4 pr-1 pt-1 pb-1">
              <ul className="space-y-1">
                {modulo.conteudos.sort((a,b) => a.ordem - b.ordem).map((conteudo) => (
                  <li key={conteudo.id} className="text-sm">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-left h-auto py-2 px-2 block ${currentConteudo?.id === conteudo.id ? 'bg-sky-100 text-sky-700 font-semibold' : 'hover:bg-gray-100'}`}
                      onClick={() => onConteudoSelect(conteudo)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="flex-1 truncate" title={conteudo.nome_conteudo}>{conteudo.nome_conteudo}</span>
                        <Checkbox
                          checked={conteudosConcluidos.has(conteudo.id)}
                          onCheckedChange={() => onToggleConteudoConcluido(conteudo.id, modulo.id)}
                          className="ml-2 flex-shrink-0"
                          onClick={(e) => e.stopPropagation()} // Prevent button click when checkbox is clicked
                        />
                      </div>
                    </Button>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </aside>
  );
};

export default CourseSidebar;
