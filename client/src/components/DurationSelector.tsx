import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface DurationSelectorProps {
  onSelect: (minutes: number) => void;
  defaultMinutes?: number;
  minMinutes?: number;
  maxMinutes?: number;
  type?: "focus" | "break";
}

export default function DurationSelector({
  onSelect,
  defaultMinutes = 25,
  minMinutes = 5,
  maxMinutes = 120,
  type = "focus"
}: DurationSelectorProps) {
  const [minutes, setMinutes] = useState(defaultMinutes);

  const presets = type === "focus" 
    ? [15, 25, 45, 60, 90]
    : [5, 10, 15, 20];

  return (
    <div className="w-full max-w-md space-y-8" data-testid="duration-selector">
      <div className="text-center space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          {type === "focus" ? "Focus Duration" : "Break Duration"}
        </h3>
        <div className="text-8xl font-bold bg-gradient-to-br from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
          {minutes}
        </div>
        <p className="text-lg text-muted-foreground">minutes</p>
      </div>

      <div className="space-y-6">
        <Slider
          value={[minutes]}
          onValueChange={(value) => setMinutes(value[0])}
          min={minMinutes}
          max={maxMinutes}
          step={5}
          className="w-full"
          data-testid="slider-duration"
        />

        <div className="flex flex-wrap gap-2 justify-center">
          {presets.map((preset) => (
            <Button
              key={preset}
              variant={minutes === preset ? "default" : "outline"}
              size="sm"
              onClick={() => setMinutes(preset)}
              data-testid={`button-preset-${preset}`}
            >
              {preset}m
            </Button>
          ))}
        </div>

        <Button
          onClick={() => onSelect(minutes)}
          className="w-full"
          size="lg"
          data-testid="button-start"
        >
          Start {type === "focus" ? "Focus" : "Break"}
        </Button>
      </div>
    </div>
  );
}
