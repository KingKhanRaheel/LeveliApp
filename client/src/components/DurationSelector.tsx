import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { useState } from "react";
import { BUTTON_LABELS } from "@/lib/content";

interface DurationSelectorProps {
  onSelect: (minutes: number, strictMode?: boolean) => void;
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
  const [strictMode, setStrictMode] = useState(false);

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

        {type === "focus" && (
          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label htmlFor="strict-mode" className="text-sm font-medium cursor-pointer">
                  Strict Mode
                </Label>
                <p className="text-xs text-muted-foreground">
                  Fullscreen lock, warns on exit
                </p>
              </div>
            </div>
            <Switch
              id="strict-mode"
              checked={strictMode}
              onCheckedChange={setStrictMode}
              data-testid="switch-strict-mode"
            />
          </div>
        )}

        <Button
          onClick={() => onSelect(minutes, strictMode)}
          className="w-full"
          size="lg"
          data-testid="button-start"
        >
          {type === "focus" ? BUTTON_LABELS.startFocus : BUTTON_LABELS.breakTime}
        </Button>
      </div>
    </div>
  );
}
