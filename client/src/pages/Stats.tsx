import { Clock, Flame, Trophy } from "lucide-react";
import StatCard from "@/components/StatCard";
import { useGameState } from "@/hooks/useGameState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

export default function Stats() {
  const { getStats } = useGameState();
  const stats = getStats();

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="min-h-screen pb-20 px-4">
      <div className="max-w-lg mx-auto pt-8 space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold mb-1">Stats</h1>
          <p className="text-sm text-muted-foreground">your grind metrics</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <StatCard
            icon={Clock}
            label="Today"
            value={formatTime(stats.dailyMinutes)}
          />
          <StatCard
            icon={Flame}
            label="Streak"
            value={stats.streakDays}
            gradient
          />
          <StatCard
            icon={Trophy}
            label="Level"
            value={stats.level}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.weeklyData}>
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Bar 
                  dataKey="minutes" 
                  radius={[8, 8, 0, 0]}
                >
                  {stats.weeklyData.map((entry, index) => (
                    <Cell key={index} fill="hsl(var(--primary))" opacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-primary" data-testid="stat-total-time">
                  {formatTime(stats.totalMinutes)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Total Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-bold" data-testid="stat-sessions">
                  {stats.totalSessions}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Sessions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
