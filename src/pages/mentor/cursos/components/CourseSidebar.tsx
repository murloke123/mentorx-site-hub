import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ConteudoItemLocal, ModuloItemLocal } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CourseSidebarProps {
  modulos: ModuloItemLocal[];
  currentConteudo: ConteudoItemLocal | null;
  conteudosConcluidos: Set<string>;
  onConteudoSelect: (conteudo: ConteudoItemLocal) => void;
  onToggleConteudoConcluido: (conteudoId: string, moduloId: string) => Promise<void>;
  progress: number;
  onPreviousContent: () => void;
  onNextContent: () => void;
  hasPreviousContent: boolean;
  hasNextContent: boolean;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({ 
  modulos,
  currentConteudo,
  conteudosConcluidos,
  onConteudoSelect,
  onToggleConteudoConcluido,
  progress,
  onPreviousContent,
  onNextContent,
  hasPreviousContent,
  hasNextContent
}) => {
  return (
    <aside className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Conteúdo do Curso</h3>
          <span className="text-sm font-medium">{Math.round(progress)}% concluído</span>
        </div>
        <Progress value={progress} className="h-2 bg-gray-100 [&>*]:bg-green-500" />
      </div>
      
      <div className="overflow-y-auto flex-grow p-4">
        <Accordion type="single" collapsible className="w-full">
          {modulos.map((module, moduleIndex) => (
            <AccordionItem key={module.id} value={module.id}>
              <AccordionTrigger className="px-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{module.nome_modulo}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1">
                  {module.conteudos.sort((a,b) => a.ordem - b.ordem).map((content, contentIndex) => (
                    <li key={content.id}>
                      <div
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 hover:bg-accent cursor-pointer",
                          currentConteudo?.id === content.id && "bg-accent"
                        )}
                        onClick={() => onConteudoSelect(content)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            onConteudoSelect(content);
                          }
                        }}
                      >
                        <Checkbox
                          checked={conteudosConcluidos.has(content.id)}
                          onCheckedChange={(checked) => onToggleConteudoConcluido(content.id, module.id)}
                        />
                        <span>{content.nome_conteudo}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </aside>
  );
};

export default CourseSidebar;
