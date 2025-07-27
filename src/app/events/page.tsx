'use client';

import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Container, Row, Col, Card } from 'react-bootstrap';

type Event = {
  id: number;
  title: string;
  description: string;
  date: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then(setEvents)
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newEvent = { title, description, date };

    const res = await fetch('/api/events', {
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
    } else {
      // eslint-disable-next-line no-alert
      alert('Failed to create event');
    }
  };

  return (
    <Container
      className="py-4"
      style={{
        backgroundColor: '#064e03', // dark green
        color: 'white', // white text
        minHeight: '100vh', // full viewport height
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4" style={{ gap: '1rem' }}>
        <h2>Group Events</h2>
        <Button
          onClick={() => setShowModal(true)}
          style={{
            backgroundColor: '#000', // black button
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
                  {new Date(event.date).toLocaleString()}
                </Card.Text>
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
