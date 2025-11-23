import SessionCompleteModal from '../SessionCompleteModal';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function SessionCompleteModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>Show Session Complete</Button>
      <SessionCompleteModal 
        open={open}
        onClose={() => setOpen(false)}
        xpGained={25}
        message="locked in fr"
        leveledUp={true}
        newLevel={6}
      />
    </div>
  );
}
