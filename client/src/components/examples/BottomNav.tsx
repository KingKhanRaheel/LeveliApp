import BottomNav from '../BottomNav';
import { Route, Switch } from 'wouter';

export default function BottomNavExample() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <Switch>
          <Route path="/" component={() => <h1 className="text-2xl">Home Page</h1>} />
          <Route path="/stats" component={() => <h1 className="text-2xl">Stats Page</h1>} />
          <Route path="/achievements" component={() => <h1 className="text-2xl">Achievements Page</h1>} />
        </Switch>
      </div>
      <BottomNav />
    </div>
  );
}
