
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { ScheduleSlot } from "@/types";

interface ScheduleSelectorProps {
  mentorId: string;
  availableSlots: ScheduleSlot[];
  onSchedule: (slotId: string, comment: string) => void;
}

const ScheduleSelector = ({ mentorId, availableSlots, onSchedule }: ScheduleSelectorProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<ScheduleSlot | null>(null);
  const [comment, setComment] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filter slots for selected date
  const filteredSlots = availableSlots.filter(slot => {
    if (!selectedDate) return false;
    const slotDate = new Date(slot.date);
    return (
      slotDate.getDate() === selectedDate.getDate() &&
      slotDate.getMonth() === selectedDate.getMonth() &&
      slotDate.getFullYear() === selectedDate.getFullYear() &&
      !slot.isBooked
    );
  });

  const handleSchedule = () => {
    if (selectedSlot) {
      onSchedule(selectedSlot.id, comment);
      setDialogOpen(false);
      toast({
        title: "Solicitação enviada!",
        description: "Você receberá uma confirmação assim que o mentor responder.",
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/2">
        <h3 className="text-lg font-medium mb-4">Selecione uma data</h3>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
          disabled={(date) => {
            // Disable past dates
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date < today;
          }}
        />
      </div>
      <div className="md:w-1/2">
        <h3 className="text-lg font-medium mb-4">Horários disponíveis</h3>
        {filteredSlots.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {filteredSlots.map((slot) => (
              <Dialog key={slot.id} open={dialogOpen && selectedSlot?.id === slot.id} onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) setSelectedSlot(null);
              }}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="text-left justify-start"
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot.startTime} - {slot.endTime}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Agendar Sessão</DialogTitle>
                    <DialogDescription>
                      Você está agendando uma sessão de {slot.duration} minutos no dia{" "}
                      {new Date(slot.date).toLocaleDateString()} às {slot.startTime}.
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    placeholder="Deixe uma mensagem para o mentor (opcional)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSchedule}>Confirmar Agendamento</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        ) : (
          <div className="border rounded-md p-4 text-center text-gray-500">
            {selectedDate ? "Não há horários disponíveis para esta data." : "Selecione uma data para ver os horários disponíveis."}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleSelector;
