
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Function to fetch mentor followers
async function getMentorFollowers() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Not authenticated");
  
  const { data, error } = await supabase
    .from('mentor_followers')
    .select('*, follower:follower_id(id, full_name)')
    .eq('mentor_id', user.id)
    .order('followed_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export default function MentorFollowersPage() {
  // Fetch mentor followers
  const { data: followers = [], isLoading } = useQuery({
    queryKey: ['mentorFollowers'],
    queryFn: getMentorFollowers,
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Followers</h1>
        <p className="text-gray-600">People who follow your profile and courses</p>
      </div>
      
      {isLoading ? (
        <div className="text-center py-10">
          <p>Loading followers...</p>
        </div>
      ) : followers.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No followers yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p>When people follow you, they'll appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {followers.map((follower) => (
            <Card key={follower.follower_id}>
              <CardHeader>
                <CardTitle>{follower.follower?.full_name || 'Anonymous User'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Followed on {new Date(follower.followed_at).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
