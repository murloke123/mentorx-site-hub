
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MentoradoMentoresPage = () => {
  const [followedMentors, setFollowedMentors] = useState<any[]>([]);
  const [allMentors, setAllMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get all mentors
        const { data: mentorsData, error: mentorsError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, bio')
          .eq('role', 'mentor');

        if (mentorsError) throw mentorsError;
        
        // Get followed mentors
        const { data: followedData, error: followedError } = await supabase
          .from('mentor_followers')
          .select('mentor_id, followed_at')
          .eq('follower_id', user.id);

        if (followedError) throw followedError;
        
        // Create a set of followed mentor IDs for quick lookup
        const followedMentorIds = new Set(followedData?.map(f => f.mentor_id) || []);
        
        // Separate mentors into followed and all lists
        const followed = [];
        const all = [];
        
        for (const mentor of mentorsData || []) {
          const isFollowed = followedMentorIds.has(mentor.id);
          const mentorWithFollow = {
            ...mentor,
            isFollowed,
            followed_at: isFollowed ? 
              followedData?.find(f => f.mentor_id === mentor.id)?.followed_at : 
              null
          };
          
          if (isFollowed) {
            followed.push(mentorWithFollow);
          }
          all.push(mentorWithFollow);
        }
        
        setFollowedMentors(followed);
        setAllMentors(all);
      } catch (error) {
        console.error("Error fetching mentors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);
  
  const handleToggleFollow = async (mentorId: string, isCurrentlyFollowed: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para seguir um mentor",
          variant: "destructive"
        });
        return;
      }
      
      if (isCurrentlyFollowed) {
        // Unfollow the mentor
        await supabase
          .from('mentor_followers')
          .delete()
          .eq('follower_id', user.id)
          .eq('mentor_id', mentorId);
          
        toast({
          title: "Deixou de seguir",
          description: "Você deixou de seguir este mentor"
        });
      } else {
        // Follow the mentor
        await supabase
          .from('mentor_followers')
          .insert({
            follower_id: user.id,
            mentor_id: mentorId
          });
          
        toast({
          title: "Seguindo",
          description: "Agora você está seguindo este mentor"
        });
      }
      
      // Update the lists
      setAllMentors(prev => 
        prev.map(mentor => 
          mentor.id === mentorId 
            ? { ...mentor, isFollowed: !isCurrentlyFollowed } 
            : mentor
        )
      );
      
      if (isCurrentlyFollowed) {
        setFollowedMentors(prev => prev.filter(mentor => mentor.id !== mentorId));
      } else {
        const mentorToAdd = allMentors.find(m => m.id === mentorId);
        if (mentorToAdd) {
          setFollowedMentors(prev => [...prev, { ...mentorToAdd, isFollowed: true }]);
        }
      }
    } catch (error) {
      console.error("Error following/unfollowing mentor:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao tentar seguir/deixar de seguir este mentor",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="p-8">Carregando mentores...</div>;
  }

  const renderMentorCard = (mentor: any) => (
    <Card key={mentor.id} className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            {mentor.avatar_url ? (
              <img 
                src={mentor.avatar_url} 
                alt={mentor.full_name} 
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <span className="text-lg">{mentor.full_name?.charAt(0) || "M"}</span>
            )}
          </div>
          <div>
            <h3 className="font-semibold">{mentor.full_name}</h3>
            <p className="text-xs text-muted-foreground">
              {mentor.isFollowed ? `Seguindo desde ${new Date(mentor.followed_at).toLocaleDateString()}` : "Não seguindo"}
            </p>
          </div>
        </div>
        
        <p className="text-sm mb-4">{mentor.bio || "Este mentor ainda não adicionou uma bio."}</p>
        
        <Button 
          variant={mentor.isFollowed ? "outline" : "default"} 
          size="sm"
          onClick={() => handleToggleFollow(mentor.id, mentor.isFollowed)}
          className="w-full"
        >
          {mentor.isFollowed ? "Deixar de Seguir" : "Seguir"}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Mentores</h1>
      
      <Tabs defaultValue="followed" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="followed">
            Mentores que Sigo ({followedMentors.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            Todos os Mentores ({allMentors.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="followed">
          {followedMentors.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  Você ainda não está seguindo nenhum mentor. 
                  Explore a plataforma para encontrar mentores interessantes!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {followedMentors.map(renderMentorCard)}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allMentors.map(renderMentorCard)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MentoradoMentoresPage;
