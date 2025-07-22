'use client';

import { useEffect, useState } from 'react';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';

type GroupEvent = {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
};

export default function GroupEventsPage() {
  const [events, setEvents] = useState<GroupEvent[]>([]);

  useEffect(() => {
    fetch('/api/group-events')
      .then(res => res.json())
      .then((data: GroupEvent[]) => setEvents(data));
  }, []);

  return (
    <Container className="py-4">
      <h2>Group Events</h2>
      <Link href="/group-events/create">
        <Button className="mb-3">+ Create Event</Button>
      </Link>
      <Row>
        {events.map(event => (
          <Col key={event.id} md={6} lg={4}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>{event.title}</Card.Title>
                <Card.Text>{event.description}</Card.Text>
                <Card.Text>
                  📍
                  {' '}
                  {event.location}
                  {' '}
                  <br />
                  🕒
                  {' '}
                  {new Date(event.date).toLocaleString()}
                </Card.Text>
                <Link href={`/group-events/${event.id}`}>
                  <Button variant="outline-primary">View Event</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
