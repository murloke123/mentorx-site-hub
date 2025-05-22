
import React from "react";
import MentorSidebar from "@/components/mentor/MentorSidebar";
import DatabaseFieldsComparison from "@/components/mentor/configuracoes/DatabaseFieldsComparison";

const DatabaseMappingPage = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <MentorSidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <DatabaseFieldsComparison />
      </div>
    </div>
  );
};

export default DatabaseMappingPage;
