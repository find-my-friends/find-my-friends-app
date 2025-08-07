'use client';

import { useState } from 'react';
import {
  Container, Row, Col, ListGroup, Form, Button, Card, Badge,
} from 'react-bootstrap';
import './chat-background.css'; // Custom styling for chat background

// Message model includes sender, recipient, text, and timestamp
interface Message {
  sender: string;
  recipient: string;
  text: string;
  timestamp: number;
}

// List of available users to chat with
const allUsers = ['Jane Doe', 'John Smith', 'Emily Chen'];

export default function ChatPage() {
  // Message history state
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'Jane Doe', recipient: 'You', text: 'Hey, how are you?', timestamp: Date.now() - 60000 },
    { sender: 'You', recipient: 'Jane Doe', text: 'I’m doing well! You?', timestamp: Date.now() - 55000 },
    { sender: 'Jane Doe', recipient: 'You', text: 'All good here!', timestamp: Date.now() - 30000 },
  ]);

  // Selected user to chat with
  const [selectedUser, setSelectedUser] = useState<string>('Jane Doe');

  // Current message input
  const [newMessage, setNewMessage] = useState('');

  // Send a new message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const newMsg: Message = {
      sender: 'You',
      recipient: selectedUser,
      text: newMessage,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage('');
  };

  // Get messages between "You" and selected user
  const getDirectMessages = () => messages.filter(
    (msg) => (msg.sender === 'You' && msg.recipient === selectedUser)
        || (msg.sender === selectedUser && msg.recipient === 'You'),
  );

  // Determine if a user is active (sent message in past 2 mins)
  const isUserActive = (user: string) => {
    const lastMsg = messages
      .filter((m) => m.sender === user)
      .sort((a, b) => b.timestamp - a.timestamp)[0];
    return lastMsg && Date.now() - lastMsg.timestamp < 2 * 60 * 1000;
  };

  return (
    <div className="chat-background">
      <Container fluid className="p-4">
        <Row>
          {/* User list */}
          <Col md={3}>
            <h5 className="text-white">Users</h5>
            <ListGroup>
              {allUsers.map((name) => (
                <ListGroup.Item
                  key={name}
                  action
                  active={selectedUser === name}
                  onClick={() => setSelectedUser(name)}
                >
                  {name}
                  {' '}
                  {isUserActive(name) && <Badge bg="success" className="ms-2">Active</Badge>}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>

          {/* Chat window */}
          <Col md={9}>
            <h5 className="text-white mb-2">
              Chat with
              {selectedUser}
            </h5>
            <Card className="mb-3">
              <Card.Body style={{ height: '400px', overflowY: 'auto' }}>
                {getDirectMessages().map((msg, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <div key={index}>
                    <strong>
                      {msg.sender}
                      :
                    </strong>
                    {' '}
                    {msg.text}
                  </div>
                ))}
              </Card.Body>
            </Card>

            {/* Message input */}
            <Form onSubmit={handleSendMessage}>
              <Form.Group className="d-flex">
                <Form.Control
                  type="text"
                  placeholder={`Message ${selectedUser}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button type="submit" variant="primary" className="ms-2">Send</Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
