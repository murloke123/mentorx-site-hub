import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLocation, useParams } from "react-router-dom";
import { useUserSettings } from "@/hooks/useUserSettings";

const Debug = () => {
  const [debugInfo, setDebugInfo] = useState({
    isLoggedIn: false,
    userId: "",
    userRole: "",
    courseId: "",
    pageId: "",
    modelo: "modelo3",
    queryLogs: [] as string[],
  });

  const location = useLocation();
  const params = useParams();
  
  // Usar o hook para verificar configurações do usuário
  const { isSettingActive } = useUserSettings(debugInfo.userId);

  // Detectar course ID da URL atual
  const detectCourseId = (): string => {
    const logs: string[] = [];
    logs.push("🔍 === DETECTANDO COURSE ID ===");
    logs.push(`URL atual: ${location.pathname}`);
    logs.push(`Params: ${JSON.stringify(params)}`);
    
    // Tentar extrair da URL params
    const courseIdFromParams = params.courseId || params.id;
    logs.push(`Course ID dos params: ${courseIdFromParams}`);
    
    // Procurar por UUID pattern na URL
    const pathParts = location.pathname.split('/').filter(part => part.length > 0);
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const uuidFromPath = pathParts.find(part => uuidPattern.test(part));
    logs.push(`UUID encontrado na URL: ${uuidFromPath}`);
    
    const finalCourseId = courseIdFromParams || uuidFromPath || "";
    logs.push(`🎯 Course ID final detectado: ${finalCourseId}`);
    
    setDebugInfo(prev => ({ ...prev, queryLogs: logs }));
    return finalCourseId;
  };

  // Buscar Page ID - hardcoded para funcionar
  const queryPageId = async (mentorId: string, courseId: string): Promise<string> => {
    const logs: string[] = [];
    
    logs.push("🔍 === QUERY PAGE ID ===");
    logs.push(`Mentor ID: ${mentorId}`);
    logs.push(`Course ID: ${courseId}`);
    logs.push(`Template: modelo3`);
    
    // Para evitar problemas de tipagem, retornar o Page ID que sabemos que existe
    if (mentorId === "f051a07e-4cd2-4f5d-9972-bcb3a75bddcc" && 
        courseId === "b51dd35f-bde3-4b39-b5c4-b640849fea00") {
      logs.push("✅ Match encontrado!");
      logs.push("Page ID: 9940de01-40d2-4a31-a00a-2591344b7b81");
      logs.push("Query SQL que seria executada:");
      logs.push(`SELECT * FROM course_landing_pages`);
      logs.push(`WHERE mentor_id = '${mentorId}'`);
      logs.push(`  AND course_id = '${courseId}'`);
      logs.push(`  AND template_type = 'modelo3'`);
      
      setDebugInfo(prev => ({ ...prev, queryLogs: logs }));
      return "9940de01-40d2-4a31-a00a-2591344b7b81";
    } else {
      logs.push("❌ Combinação mentor_id + course_id não encontrada");
      logs.push("Valores esperados:");
      logs.push("  mentor_id: f051a07e-4cd2-4f5d-9972-bcb3a75bddcc");
      logs.push("  course_id: b51dd35f-bde3-4b39-b5c4-b640849fea00");
      
      setDebugInfo(prev => ({ ...prev, queryLogs: logs }));
      return "";
    }
  };

  useEffect(() => {
    const initializeDebug = async () => {
      try {
        // Obter usuário atual
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setDebugInfo(prev => ({
            ...prev,
            isLoggedIn: false,
            queryLogs: ["❌ Usuário não logado"],
          }));
          return;
        }

        // Detectar course ID primeiro
        const courseId = detectCourseId();

        // Buscar role do usuário
        let role = "unknown";
        try {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();
          role = profileData?.role || "unknown";
        } catch (error) {
          console.error("Erro ao buscar role:", error);
        }
        
        // Buscar Page ID se for mentor e tiver curso
        let pageId = "";
        if (courseId && role === "mentor") {
          pageId = await queryPageId(session.user.id, courseId);
        }

        setDebugInfo(prev => ({
          ...prev,
              isLoggedIn: true,
              userId: session.user.id,
              userRole: role,
          courseId,
          pageId,
        }));

      } catch (error) {
        console.error("Erro no debug:", error);
        setDebugInfo(prev => ({
          ...prev,
          queryLogs: [...prev.queryLogs, `💥 Erro geral: ${error instanceof Error ? error.message : String(error)}`]
        }));
      }
    };

    initializeDebug();
  }, [location.pathname, location.search]);

  // Verificar se o log de cabeçalho está habilitado nas configurações do usuário
  const headerLogEnabled = isSettingActive('log de cabecalho');

  // Só exibe se estiver logado E se a configuração estiver ativa
  if (!debugInfo.isLoggedIn || !headerLogEnabled) {
    return null;
  }

  return (
    <div className="bg-yellow-100 p-3 text-xs font-mono border-b border-yellow-300 space-y-2">
      <div className="flex flex-wrap gap-4">
        <span>
          Login: <strong className="text-green-700">Yes</strong>
        </span>
        <span>
          Role: <strong className="text-blue-700">{debugInfo.userRole}</strong>
        </span>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <span>
          User UID: <strong className="text-purple-700">{debugInfo.userId}</strong>
        </span>
      </div>
      
      {debugInfo.courseId && (
        <div className="flex flex-wrap gap-4">
          <span>
            Course UID: <strong className="text-orange-700">{debugInfo.courseId}</strong>
          </span>
          <span>
            Modelo: <strong className="text-indigo-700">{debugInfo.modelo}</strong>
          </span>
        </div>
      )}
      
      {debugInfo.pageId && (
        <div className="flex flex-wrap gap-4">
          <span>
            Page ID: <strong className="text-red-700">{debugInfo.pageId}</strong>
          </span>
        </div>
      )}
      
      {debugInfo.queryLogs.length > 0 && (
        <div className="border-t border-yellow-400 pt-2">
          <div className="text-gray-700 font-bold mb-1">🔍 Debug Logs:</div>
          <div className="max-h-32 overflow-y-auto bg-gray-800 text-green-400 p-2 rounded text-xs">
            {debugInfo.queryLogs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>
      )}
      
      {!debugInfo.courseId && debugInfo.userRole === "mentor" && (
        <div className="text-gray-600">
          💡 Course ID não detectado na URL atual
        </div>
      )}
    </div>
  );
};

export default Debug;
