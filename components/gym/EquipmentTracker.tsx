'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { toast } from 'sonner';
import { Equipment, addEquipment, getUserEquipment, updateEquipment, deleteEquipment, toggleEquipmentAvailability } from '@/lib/firebase/equipment';

interface EquipmentTrackerProps {
  userId: string;
}

export function EquipmentTracker({ userId }: EquipmentTrackerProps) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [newEquipment, setNewEquipment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquipment();
  }, [userId]);

  const fetchEquipment = async () => {
    try {
      const equipmentData = await getUserEquipment(userId);
      setEquipment(equipmentData);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      toast.error('Failed to load equipment');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEquipment = async () => {
    if (!newEquipment.trim()) return;

    try {
      await addEquipment(userId, {
        name: newEquipment.trim(),
        available: true,
      });
      setNewEquipment('');
      fetchEquipment();
      toast.success('Equipment added successfully');
    } catch (error) {
      console.error('Error adding equipment:', error);
      toast.error('Failed to add equipment');
    }
  };

  const handleToggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      await toggleEquipmentAvailability(id, !currentStatus);
      fetchEquipment();
      toast.success('Equipment status updated');
    } catch (error) {
      console.error('Error updating equipment:', error);
      toast.error('Failed to update equipment status');
    }
  };

  const handleDeleteEquipment = async (id: string) => {
    try {
      await deleteEquipment(id);
      fetchEquipment();
      toast.success('Equipment deleted successfully');
    } catch (error) {
      console.error('Error deleting equipment:', error);
      toast.error('Failed to delete equipment');
    }
  };

  if (loading) {
    return <div>Loading equipment...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipment Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            value={newEquipment}
            onChange={(e) => setNewEquipment(e.target.value)}
            placeholder="Add new equipment"
            onKeyPress={(e) => e.key === 'Enter' && handleAddEquipment()}
          />
          <Button onClick={handleAddEquipment}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="space-y-2">
          {equipment.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggleAvailability(item.id, item.available)}
                >
                  {item.available ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-red-500" />
                  )}
                </Button>
                <div>
                  <div className="font-medium">{item.name}</div>
                  {item.lastUsed && (
                    <div className="text-sm text-muted-foreground">
                      Last used: {new Date(item.lastUsed).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteEquipment(item.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 