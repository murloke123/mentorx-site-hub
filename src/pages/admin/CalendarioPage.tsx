
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

const AdminCalendarioPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would fetch sessions from the database
    // For now, we'll simulate it with an empty array
    setSessions([]);
    setLoading(false);
  }, [date]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Calendário de Sessões</h1>
      
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
            <CardTitle>
              Sessões Agendadas para {date?.toLocaleDateString() || "hoje"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Carregando sessões...</p>
            ) : sessions.length === 0 ? (
              <p className="text-muted-foreground">
                Não há sessões agendadas para esta data.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Horário</TableHead>
                    <TableHead>Mentor</TableHead>
                    <TableHead>Mentorado</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>{session.time}</TableCell>
                      <TableCell>{session.mentor}</TableCell>
                      <TableCell>{session.mentorado}</TableCell>
                      <TableCell>{session.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCalendarioPage;
