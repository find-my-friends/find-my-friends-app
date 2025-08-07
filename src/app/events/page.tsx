/* eslint-disable no-alert */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button, Modal, Form, Container, Row, Col, Card } from 'react-bootstrap';

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  attendees?: { id: number; email: string }[];
  location?: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');

  const fetchEvents = useCallback(() => {
    fetch('/api/group-events')
      .then((res) => res.json())
      .then(setEvents)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const newEvent = { title, description, datetime: date, location };

      const res = await fetch('/api/group-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });

      if (res.ok) {
        const createdEvent = await res.json();
        setEvents((prev) => [...prev, createdEvent]);
        setShowModal(false);
        setTitle('');
        setDescription('');
        setDate('');
        setLocation('');
      } else {
        alert('Failed to create event');
      }
    },
    [title, description, date, location],
  );

  const handleRSVP = async (eventId: string) => {
    try {
      const res = await fetch(`/api/group-events/${eventId}/rsvp`, {
        method: 'POST',
      });

      if (res.ok) {
        fetchEvents();
      } else {
        alert('Failed to RSVP');
      }
    } catch (error) {
      console.error('RSVP error:', error);
      alert('Failed to RSVP');
    }
  };

  return (
    <Container
      className="py-4"
      style={{
        backgroundColor: '#064e03',
        color: 'white',
        minHeight: '100vh',
      }}
    >
      <div
        className="d-flex justify-content-between align-items-center mb-4"
        style={{ gap: '1rem' }}
      >
        <h2>Group Events</h2>
        <Button
          onClick={() => setShowModal(true)}
          style={{
            backgroundColor: '#000',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
          }}
        >
          Host an Event
        </Button>
      </div>

      <Row>
        {events.map((event) => (
          <Col key={event.id} md={6} lg={4} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{event.title}</Card.Title>
                <Card.Text>{event.description}</Card.Text>
                <Card.Text>
                  🕒
                  <br />
                  {new Date(event.date).toLocaleString()}
                </Card.Text>
                <Card.Text>
                  📍
                  <br />
                  {event.location || 'Location not specified'}
                </Card.Text>
                <Card.Text>
                  <strong>Attendees:</strong>
                  <br />
                  {event.attendees && event.attendees.length > 0
                    ? event.attendees.map((a) => a.email).join(', ')
                    : 'None yet'}
                </Card.Text>
                <Button variant="primary" onClick={() => handleRSVP(event.id)}>
                  RSVP
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Host an Event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDate">
              <Form.Label>Date & Time</Form.Label>
              <Form.Control
                type="datetime-local"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Event
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}
