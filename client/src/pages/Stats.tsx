import { Clock, Flame, Trophy, TrendingUp, TrendingDown } from "lucide-react";
import StatCard from "@/components/StatCard";
import { useGameState } from "@/hooks/useGameState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { motion } from "framer-motion";

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

  // Calculate insights
  const lastWeekTotal = stats.weeklyData.slice(0, 7).reduce((sum, day) => sum + day.minutes, 0);
  const previousWeekTotal = stats.weeklyData.slice(7, 14).reduce((sum, day) => sum + day.minutes, 0);
  const weekComparison = previousWeekTotal > 0 
    ? Math.round(((lastWeekTotal - previousWeekTotal) / previousWeekTotal) * 100)
    : 0;
  
  // Find quietest day
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentWeekData = stats.weeklyData.slice(0, 7);
  const quietestDay = currentWeekData.reduce((min, day) => 
    day.minutes < min.minutes ? day : min, currentWeekData[0]
  );

  // Generate contextual message
  const getInsightMessage = () => {
    if (weekComparison > 0) {
      return `You improved ${Math.abs(weekComparison)}% compared to last week. W.`;
    } else if (weekComparison < 0) {
      return `Down ${Math.abs(weekComparison)}% from last week. Let's fix that.`;
    } else {
      return "Keep the consistency going.";
    }
  };

  return (
    <div className="min-h-screen pb-20 px-4">
      <div className="max-w-lg mx-auto pt-8 space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">Stats</h1>
          <p className="text-sm text-muted-foreground/70">your grind metrics</p>
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

        {/* Insights Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {weekComparison >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                )}
                <div className="space-y-2">
                  <p className="text-base font-bold text-foreground">
                    {getInsightMessage()}
                  </p>
                  {quietestDay && quietestDay.minutes === 0 && (
                    <p className="text-sm text-muted-foreground font-medium">
                      {quietestDay.date} was quiet. Fix or accept.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display font-bold">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={currentWeekData}>
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
                  {currentWeekData.map((entry, index) => (
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
                <div className="text-sm text-muted-foreground/70 mt-1 font-medium">Total Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-bold" data-testid="stat-sessions">
                  {stats.totalSessions}
                </div>
                <div className="text-sm text-muted-foreground/70 mt-1 font-medium">Sessions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
