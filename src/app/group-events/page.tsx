/* eslint-disable no-alert */

'use client';

import { useEffect, useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useSession } from 'next-auth/react';

// Extend the Session user type to include 'id'
import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
    } & DefaultSession['user'];
  }
}

interface GroupEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
}

export default function GroupEventsPage() {
  const { data: session, status } = useSession();
  const currentUserId = session?.user?.id;

  const [events, setEvents] = useState<GroupEvent[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');

  // Fetch events from API
  async function fetchEvents() {
    try {
      const res = await fetch('/api/group-events');
      if (!res.ok) {
        const err = await res.json();
        console.error('Fetch events error:', err);
        return;
      }
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error('Fetch events failed:', error);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle new event submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUserId) {
      alert('You must be logged in to create an event.');
      return;
    }

    const res = await fetch('/api/group-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, date, location, hostId: currentUserId }),
    });

    if (res.ok) {
      setTitle('');
      setDescription('');
      setDate('');
      setLocation('');
      fetchEvents();
    } else {
      alert('Failed to create event');
    }
  };

  // Handle RSVP button click
  const handleRSVP = async (eventId: string) => {
    if (!currentUserId) {
      alert('You must be logged in to RSVP.');
      return;
    }

    const res = await fetch(`/api/group-events/${eventId}/rsvp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUserId }),
    });

    if (res.ok) {
      fetchEvents(); // Refresh events list to update attendees info
    } else {
      alert('Failed to RSVP');
    }
  };

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'unauthenticated') return <p>Please log in to view this page.</p>;

  return (
    <Container className="my-4">
      <h2>Host a New Group Event</h2>
      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group className="mb-2">
          <Form.Label>Title</Form.Label>
          <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Description</Form.Label>
          <Form.Control value={description} onChange={(e) => setDescription(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Date</Form.Label>
          <Form.Control type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Location</Form.Label>
          <Form.Control value={location} onChange={(e) => setLocation(e.target.value)} required />
        </Form.Group>
        <Button type="submit">Add Event</Button>
      </Form>

      <h3>Upcoming Events</h3>
      {events.map((event) => (
        <Card key={event.id} className="mb-3">
          <Card.Body>
            <Card.Title>{event.title}</Card.Title>
            <Card.Text>{event.description}</Card.Text>
            <Card.Text>
              <strong>Date:</strong>
              {' '}
              {new Date(event.date).toLocaleString()}
            </Card.Text>
            <Card.Text>
              <strong>Location:</strong>
              {' '}
              {event.location}
            </Card.Text>
            <Button variant="primary" onClick={() => handleRSVP(event.id)}>
              RSVP
            </Button>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}
