'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Event, addEvent, updateEvent, deleteEvent, getEventsByDateRange } from '@/lib/firebase/events';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, CalendarPlus, Clock, Loader2, Trash2, AlertTriangle } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import { GeminiAssistant } from '@/components/common/GeminiAssistant';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function PlannerPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [allDay, setAllDay] = useState(false);
  const [currentView, setCurrentView] = useState<'day' | 'week'>('day');
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [indexError, setIndexError] = useState<{message: string, url: string} | null>(null);

  // Fetch events on component mount
  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user, selectedDate, currentView]);

  const fetchEvents = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let startDate, endDate;
      
      if (currentView === 'day') {
        // Day view
        startDate = new Date(selectedDate);
        startDate.setHours(0, 0, 0, 0);
        
        endDate = new Date(selectedDate);
        endDate.setHours(23, 59, 59, 999);
      } else {
        // Week view
        const dayOfWeek = selectedDate.getDay();
        startDate = new Date(selectedDate);
        startDate.setDate(selectedDate.getDate() - dayOfWeek);
        startDate.setHours(0, 0, 0, 0);
        
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
      }
      
      const fetchedEvents = await getEventsByDateRange(user.uid, startDate, endDate);
      setEvents(fetchedEvents);
      setIndexError(null);
    } catch (error: any) {
      console.error('Error fetching events:', error);
      
      // Check if this is a Firebase index error
      if (error?.code === 'missing-index') {
        setIndexError({
          message: 'Your planner needs a database index to be created first.',
          url: error.indexUrl
        });
      } else {
        toast.error('Failed to load events');
      }
    } finally {
      setLoading(false);
    }
  }, [user, selectedDate, currentView]);

  const handleCreateEvent = async () => {
    if (!user) return;
    if (!title.trim()) {
      toast.error('Event title is required');
      return;
    }

    try {
      // Create date objects for start and end times
      const startDate = new Date(selectedDate);
      const endDate = new Date(selectedDate);
      
      if (!allDay) {
        const [startHours, startMinutes] = startTime.split(':').map(n => parseInt(n, 10));
        const [endHours, endMinutes] = endTime.split(':').map(n => parseInt(n, 10));
        
        startDate.setHours(startHours, startMinutes, 0, 0);
        endDate.setHours(endHours, endMinutes, 0, 0);
        
        // Validate that end time is after start time
        if (endDate <= startDate) {
          toast.error('End time must be after start time');
          return;
        }
      } else {
        // All-day event
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
      }

      const newEvent = {
        title,
        description,
        start: Timestamp.fromDate(startDate),
        end: Timestamp.fromDate(endDate),
        allDay,
        userId: user.uid
      };

      if (editingEvent) {
        await updateEvent(editingEvent.id as string, newEvent);
        toast.success('Event updated successfully');
      } else {
        await addEvent(newEvent);
        toast.success('Event created successfully');
      }
      
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error(`Failed to ${editingEvent ? 'update' : 'create'} event`);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!user) return;
    
    try {
      await deleteEvent(eventId);
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartTime('09:00');
    setEndTime('10:00');
    setAllDay(false);
    setEditingEvent(null);
    setIsDialogOpen(false);
  };

  const openCreateDialog = (date: Date = selectedDate) => {
    setSelectedDate(date);
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (event: Event) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDescription(event.description || '');
    setAllDay(event.allDay || false);
    
    const startDate = event.start.toDate();
    setSelectedDate(startDate);
    
    if (!event.allDay) {
      setStartTime(formatTimeForInput(startDate));
      setEndTime(formatTimeForInput(event.end.toDate()));
    }
    
    setIsDialogOpen(true);
  };

  const formatTimeForInput = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatEventTime = (event: Event) => {
    if (event.allDay) {
      return 'All day';
    }
    
    const start = event.start.toDate();
    const end = event.end.toDate();
    
    return `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
            ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    
    if (currentView === 'day') {
      // Move by a single day
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else {
      // Move by a week
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    }
    
    setSelectedDate(newDate);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Planner</h1>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentView('day')}
            className={currentView === 'day' ? 'bg-primary/10' : ''}
          >
            Day
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentView('week')}
            className={currentView === 'week' ? 'bg-primary/10' : ''}
          >
            Week
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigateDate('prev')}>
            &lt;
          </Button>
          <span className="font-medium">{formatDate(selectedDate)}</span>
          <Button variant="outline" size="icon" onClick={() => navigateDate('next')}>
            &gt;
          </Button>
        </div>
        
        <Button onClick={() => openCreateDialog()}>
          <CalendarPlus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Firebase Index Error Message */}
      {indexError && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {indexError.message}
              </p>
              <div className="mt-2">
                <a
                  href={indexError.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-yellow-700 hover:text-yellow-600 underline"
                >
                  Click here to create the required index
                </a>
              </div>
              <p className="text-xs text-yellow-600 mt-1">
                After creating the index, it may take a few minutes to activate. Refresh this page once completed.
              </p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center my-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-card border rounded-lg p-4">
          {events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-lg font-medium mb-2">No events scheduled</h2>
              <p className="text-muted-foreground mb-4">
                Click "Add Event" to schedule something for {currentView === 'day' ? 'today' : 'this week'}
              </p>
              <Button onClick={() => openCreateDialog()}>
                <CalendarPlus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map(event => (
                <Card key={event.id} className="overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{event.title}</h3>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatEventTime(event)}
                        </div>
                        {event.description && (
                          <p className="text-sm mt-2">{event.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openEditDialog(event)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteEvent(event.id as string)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edit Event' : 'Create Event'}</DialogTitle>
            <DialogDescription>
              {editingEvent 
                ? 'Update your event details below.' 
                : 'Add a new event to your calendar.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Event Title *
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add description or notes"
                className="min-h-[80px]"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="allDay" 
                checked={allDay} 
                onCheckedChange={(checked) => setAllDay(!!checked)}
              />
              <label
                htmlFor="allDay"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                All day event
              </label>
            </div>
            
            {!allDay && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="startTime" className="text-sm font-medium">
                    Start Time
                  </label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="endTime" className="text-sm font-medium">
                    End Time
                  </label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button onClick={handleCreateEvent}>
              {editingEvent ? 'Update Event' : 'Create Event'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <GeminiAssistant />
    </div>
  );
} 