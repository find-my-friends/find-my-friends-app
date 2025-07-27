'use client';

import { Container, Row, Col, ListGroup, Form, Button, Card } from 'react-bootstrap';
import './chat-background.css'; // ← Add this line

export default function ChatPage() {
  return (
    <div className="chat-background">
      {' '}
      {/* ← Wrap in background container */}
      <Container fluid className="p-4">
        <Row>
          <Col md={3}>
            <h5 className="text-white">Users</h5>
            {' '}
            {/* Optional text color tweak */}
            <ListGroup>
              <ListGroup.Item action active>Jane Doe</ListGroup.Item>
              <ListGroup.Item action>John Smith</ListGroup.Item>
              <ListGroup.Item action>Emily Chen</ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={9}>
            <Card className="mb-3">
              <Card.Body style={{ height: '400px', overflowY: 'auto' }}>
                <div>
                  <strong>Jane:</strong>
                  {' '}
                  Hey, how are you?
                </div>
                <div>
                  <strong>You:</strong>
                  {' '}
                  I’m doing well! You?
                </div>
                <div>
                  <strong>Jane:</strong>
                  {' '}
                  All good here!
                </div>
              </Card.Body>
            </Card>

            <Form>
              <Form.Group className="d-flex">
                <Form.Control type="text" placeholder="Type a message..." />
                <Button variant="primary" className="ms-2">Send</Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
