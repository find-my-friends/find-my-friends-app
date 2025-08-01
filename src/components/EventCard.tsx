'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Button } from 'react-bootstrap';

export default function EventCard({ event }: { event: any }) {
  const { data: session } = useSession();
  const [rsvpStatus, setRsvpStatus] = useState<string | null>(null);

  const handleRSVP = async () => {
    if (!session?.user) return;

    try {
      const res = await fetch(`/api/group-events/${event.id}/rsvp`, {
        method: 'POST',
      });

      if (res.ok) {
        setRsvpStatus('✅ RSVP’d!');
      } else {
        setRsvpStatus('❌ Error RSVP’ing.');
      }
    } catch (err) {
      console.error(err);
      setRsvpStatus('❌ Network error.');
    }
  };

  return (
    <div className="card p-3 mb-3">
      <h5>{event.title}</h5>
      <p>{event.location}</p>
      <p>{new Date(event.datetime).toLocaleString()}</p>
      <Button variant="primary" onClick={handleRSVP}>RSVP</Button>
      {rsvpStatus && <div className="mt-2">{rsvpStatus}</div>}
    </div>
  );
}
