'use client';

import { Container } from 'react-bootstrap';
import dynamic from 'next/dynamic';

// Dynamically import WorldMap with SSR disabled
const WorldMap = dynamic(() => import('@/components/WorldMap'), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

const MatchPage = () => (
  <Container className="py-5">
    <h1>Match Page</h1>
    <p>friend matching feature to be implemented here</p>
    <WorldMap />
  </Container>
);

export default MatchPage;
