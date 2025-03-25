'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';

interface RestTimerProps {
  defaultTime?: number;
}

export function RestTimer({ defaultTime = 60 }: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(defaultTime);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTime, setSelectedTime] = useState(defaultTime);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Play notification sound
      new Audio('/notification.mp3').play().catch(() => {});
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(selectedTime);
  };

  const handleTimeChange = (value: number[]) => {
    setSelectedTime(value[0]);
    if (!isRunning) {
      setTimeLeft(value[0]);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Timer className="h-5 w-5" />
          <span>Rest Timer</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-4xl font-bold text-center">
          {formatTime(timeLeft)}
        </div>
        <div className="flex justify-center space-x-2">
          {!isRunning ? (
            <Button onClick={handleStart} size="lg">
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
          ) : (
            <Button onClick={handlePause} size="lg" variant="secondary">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
          <Button onClick={handleReset} size="lg" variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            Set rest time: {selectedTime} seconds
          </div>
          <Slider
            value={[selectedTime]}
            onValueChange={handleTimeChange}
            min={0}
            max={300}
            step={5}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
} 