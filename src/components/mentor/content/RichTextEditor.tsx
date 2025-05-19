
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, 
  AlignRight, List, ListOrdered, Type, Image
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RichTextEditorProps {
  initialValue?: string;
  onChange: (content: string) => void;
}

const RichTextEditor = ({ initialValue = "", onChange }: RichTextEditorProps) => {
  const [editorInitialized, setEditorInitialized] = useState(false);

  useEffect(() => {
    // Inicializa o editor apenas uma vez após a montagem do componente
    if (!editorInitialized) {
      // Preparar o conteúdo inicial, se houver
      if (initialValue) {
        const editorElement = document.getElementById('rich-text-editor');
        if (editorElement) {
          editorElement.innerHTML = initialValue;
        }
      }
      setEditorInitialized(true);
    }
  }, [initialValue, editorInitialized]);

  // Atualiza o valor cada vez que o conteúdo do editor muda
  useEffect(() => {
    const editorElement = document.getElementById('rich-text-editor');
    if (editorElement && editorInitialized) {
      const handleEditorChange = () => {
        onChange(editorElement.innerHTML);
      };

      editorElement.addEventListener('input', handleEditorChange);

      return () => {
        editorElement.removeEventListener('input', handleEditorChange);
      };
    }
  }, [onChange, editorInitialized]);

  const execCommand = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    
    // Atualiza manualmente o valor após executar um comando
    const editorElement = document.getElementById('rich-text-editor');
    if (editorElement) {
      onChange(editorElement.innerHTML);
    }
    
    // Foca o editor após executar um comando
    editorElement?.focus();
  };

  const insertImage = () => {
    const url = prompt("Insira a URL da imagem:");
    if (url) {
      execCommand('insertHTML', `<img src="${url}" alt="Imagem" style="max-width: 100%; height: auto;" />`);
    }
  };

  const createHeading = (level: number) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      
      if (selectedText) {
        // Se há texto selecionado, substitui por um heading
        execCommand('insertHTML', `<h${level}>${selectedText}</h${level}>`);
      } else {
        // Se não há seleção, insere um heading vazio
        execCommand('insertHTML', `<h${level}>Título</h${level}>`);
      }
    }
  };

  return (
    <div className="border rounded-md">
      <div className="bg-muted p-2 border-b flex flex-wrap gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand('bold')}
              >
                <Bold className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Negrito</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand('italic')}
              >
                <Italic className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Itálico</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand('underline')}
              >
                <Underline className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Sublinhado</TooltipContent>
          </Tooltip>

          <div className="w-px h-6 bg-border mx-1"></div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => createHeading(2)}
              >
                <Type className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Título</TooltipContent>
          </Tooltip>

          <div className="w-px h-6 bg-border mx-1"></div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand('justifyLeft')}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Alinhar à esquerda</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand('justifyCenter')}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Centralizar</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand('justifyRight')}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Alinhar à direita</TooltipContent>
          </Tooltip>

          <div className="w-px h-6 bg-border mx-1"></div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand('insertUnorderedList')}
              >
                <List className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Lista com marcadores</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => execCommand('insertOrderedList')}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Lista numerada</TooltipContent>
          </Tooltip>

          <div className="w-px h-6 bg-border mx-1"></div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={insertImage}
              >
                <Image className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Inserir imagem</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div
        id="rich-text-editor"
        contentEditable
        className="p-4 min-h-[300px] max-h-[500px] overflow-y-auto focus:outline-none"
        dangerouslySetInnerHTML={{ __html: initialValue }}
      />
    </div>
  );
};

export default RichTextEditor;
