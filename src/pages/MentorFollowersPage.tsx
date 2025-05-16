
import { useState, useEffect } from "react";
import MentorSidebar from "@/components/mentor/MentorSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { User } from "lucide-react";

interface Follower {
  id: string;
  followed_at: string;
  follower_id: string;
  profile: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

const MentorFollowersPage = () => {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFollowers = async () => {
      setIsLoading(true);
      try {
        // Obter o ID do usuário autenticado
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("Usuário não autenticado");
        }
        
        // Buscar seguidores com dados do perfil
        const { data, error } = await supabase
          .from("mentor_followers")
          .select(`
            id, 
            followed_at,
            follower_id,
            profile:profiles!follower_id (
              id,
              full_name,
              avatar_url
            )
          `)
          .eq("mentor_id", user.id)
          .order("followed_at", { ascending: false });

        if (error) throw error;
        
        // Garantir que o tipo de dados esteja correto
        const typedData = data as unknown as Follower[];
        setFollowers(typedData);
      } catch (error) {
        console.error("Erro ao buscar seguidores:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFollowers();
  }, []);

  // Filtrar seguidores com base no termo de pesquisa
  const filteredFollowers = followers.filter((follower) => 
    follower.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <MentorSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Meus Seguidores</h1>
        
        {/* Barra de pesquisa */}
        <div className="mb-6 max-w-md">
          <Input
            type="text"
            placeholder="Buscar seguidores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Lista de seguidores */}
        {isLoading ? (
          <p>Carregando seguidores...</p>
        ) : followers.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFollowers.map((follower) => (
              <Card key={follower.id}>
                <CardContent className="flex items-center space-x-4 p-4">
                  <Avatar className="h-12 w-12">
                    {follower.profile?.avatar_url ? (
                      <AvatarImage src={follower.profile.avatar_url} alt={follower.profile.full_name || ""} />
                    ) : (
                      <AvatarFallback>
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium">{follower.profile?.full_name || "Usuário"}</h3>
                    <p className="text-sm text-gray-500">
                      Seguindo desde {new Date(follower.followed_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Ver Perfil</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-xl font-medium text-gray-900">
              Você ainda não tem seguidores
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              À medida que você compartilhar seu conhecimento, mais pessoas irão te seguir!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorFollowersPage;
