/* eslint-disable no-alert */

'use client';

import { useState } from 'react';

export default function AddGroupEventForm() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [datetime, setDatetime] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch('/api/group-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, location, datetime }),
    });

    if (res.ok) {
      setTitle('');
      setLocation('');
      setDatetime('');
      alert('Event created!');
    } else {
      alert('Failed to create event.');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Event Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />
      <input
        type="datetime-local"
        value={datetime}
        onChange={(e) => setDatetime(e.target.value)}
        required
      />
      <button type="submit">Create Event</button>
    </form>
  );
}
