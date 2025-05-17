
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MentoradoCalendarioPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Calendário</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Selecione uma Data</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sessões Agendadas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Você não tem sessões agendadas para {date?.toLocaleDateString() || "hoje"}.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MentoradoCalendarioPage;
