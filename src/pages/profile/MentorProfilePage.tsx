
import React from "react";
import MentorSidebar from "@/components/mentor/MentorSidebar";
import ProfilePage from "@/components/profile/ProfilePage";

const MentorProfilePage = () => {
  return (
    <div className="flex">
      <MentorSidebar />
      <div className="flex-1">
        <ProfilePage userRole="mentor" />
      </div>
    </div>
  );
};

export default MentorProfilePage;
