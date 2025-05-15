
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function MentorCalendarPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <p className="text-gray-600">Manage your schedule and events</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>
            This feature will be implemented in a future update.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Coming soon: Schedule management for mentors!</p>
        </CardContent>
      </Card>
    </div>
  );
}
