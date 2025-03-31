'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
};

export default function PlannerPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    priority: 'medium',
  });

  const addEvent = () => {
    if (!newEvent.title || !newEvent.date) return;

    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description || '',
      date: newEvent.date,
      priority: newEvent.priority || 'medium',
    };

    setEvents([...events, event]);
    setNewEvent({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      priority: 'medium',
    });
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Planner</CardTitle>
          <CardDescription>
            Plan and organize your schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4">
              <Input
                placeholder="Event title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
              <Textarea
                placeholder="Event description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                />
                <Select
                  value={newEvent.priority}
                  onValueChange={(value: 'low' | 'medium' | 'high') => 
                    setNewEvent({ ...newEvent, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={addEvent}>
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </div>

            <div className="space-y-4 mt-6">
              {events.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">
                  No events planned. Start by adding an event!
                </div>
              ) : (
                events
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((event) => (
                    <Card key={event.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteEvent(event.id)}
                          >
                            ×
                          </Button>
                        </div>
                        <CardDescription>
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            {new Date(event.date).toLocaleDateString()}
                            <span className={`ml-2 ${getPriorityColor(event.priority)}`}>
                              • {event.priority}
                            </span>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      {event.description && (
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {event.description}
                          </p>
                        </CardContent>
                      )}
                    </Card>
                  ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 