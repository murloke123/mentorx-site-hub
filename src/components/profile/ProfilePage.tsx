import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "@/components/ui/spinner";
import ProfileForm from "@/components/profile/ProfileForm";

interface ProfilePageProps {
  userRole?: "mentor" | "mentorado" | "admin";
}

const ProfilePage = ({ userRole }: ProfilePageProps) => {
  const [user, setUser] = useState<any | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      // Obter o email do usuário separadamente
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      setProfileData({
        ...data,
        email: userData?.user?.email
      });
    } catch (err: any) {
      console.error("Erro ao buscar dados do perfil:", err);
      setError("Não foi possível carregar os dados do perfil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session?.user) {
          setUser(session.user);
          await fetchProfileData(session.user.id);
        } else {
          setLoading(false);
          setError("Usuário não autenticado");
        }
      } catch (err: any) {
        console.error("Erro ao obter usuário:", err);
        setLoading(false);
        setError("Erro ao verificar autenticação");
      }
    };

    getCurrentUser();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 max-w-2xl mx-auto my-8">
        <h3 className="font-medium">Erro</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
        <ProfileForm 
          user={user} 
          profileData={profileData}
          onProfileUpdate={() => fetchProfileData(user?.id || "")}
        />
  );
};

export default ProfilePage;
