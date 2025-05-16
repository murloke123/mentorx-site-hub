
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import MentorSidebar from "@/components/mentor/MentorSidebar";

interface Follower {
  id: string;
  followed_at: string;
  follower: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

const MentorFollowersPage = () => {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        // Get current user ID
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("Not authenticated");
        }
        
        // Fetch followers with their profile information
        const { data, error } = await supabase
          .from("mentor_followers")
          .select(`
            id,
            followed_at,
            follower:profiles!follower_id(
              id, 
              full_name, 
              avatar_url
            )
          `)
          .eq("mentor_id", user.id)
          .order("followed_at", { ascending: false });

        if (error) throw error;
        
        setFollowers(data as Follower[]);
      } catch (error) {
        console.error("Error fetching followers:", error);
        toast({
          title: "Error fetching followers",
          description: "Could not load your followers. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [toast]);

  return (
    <div className="flex">
      <MentorSidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">My Followers</h1>
        
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="flex items-center gap-4 p-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-3 w-[120px]" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : followers.length > 0 ? (
          <div className="space-y-4">
            {followers.map((follower) => (
              <Card key={follower.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <Avatar>
                    <AvatarImage src={follower.follower.avatar_url || undefined} />
                    <AvatarFallback>
                      {follower.follower.full_name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{follower.follower.full_name || "Anonymous User"}</p>
                    <p className="text-sm text-gray-500">
                      Following since {new Date(follower.followed_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">You don't have any followers yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorFollowersPage;
