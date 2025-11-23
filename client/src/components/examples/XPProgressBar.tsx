import XPProgressBar from '../XPProgressBar';

export default function XPProgressBarExample() {
  return (
    <div className="w-full max-w-md p-8">
      <XPProgressBar 
        currentXP={750}
        xpForNextLevel={1000}
        currentLevel={5}
        nextLevel={6}
      />
    </div>
  );
}
