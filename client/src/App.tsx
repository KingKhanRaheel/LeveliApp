import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import FocusTimer from "@/pages/FocusTimer";
import PomodoroTimer from "@/pages/PomodoroTimer";
import Stats from "@/pages/Stats";
import Achievements from "@/pages/Achievements";
import BottomNav from "@/components/BottomNav";
import NotFound from "@/pages/not-found";
import { useTheme } from "@/hooks/useTheme";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/focus" component={FocusTimer} />
      <Route path="/pomodoro" component={PomodoroTimer} />
      <Route path="/stats" component={Stats} />
      <Route path="/achievements" component={Achievements} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useTheme();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Router />
          <Route path="/" component={BottomNav} />
          <Route path="/stats" component={BottomNav} />
          <Route path="/achievements" component={BottomNav} />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
