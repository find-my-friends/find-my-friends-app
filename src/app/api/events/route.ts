const events = [
  {
    id: 1,
    title: 'Sample Event',
    description: 'This is an example event',
    date: new Date().toISOString(),
  },
];

export async function GET() {
  return new Response(JSON.stringify(events), { status: 200 });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newEvent = {
      id: events.length + 1,
      ...data,
    };
    events.push(newEvent);
    return new Response(JSON.stringify(newEvent), { status: 201 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Failed to create event' }), { status: 500 });
  }
}
