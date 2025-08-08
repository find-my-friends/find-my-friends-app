'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Image from 'next/image';
import { redirect } from 'next/navigation';

interface Profile {
  name: string;
  major: string;
  year: string;
  hobbies: string[];
  bio: string;
  image: string;
  owner: string;
  score?: number;
}

const MatchPage = () => {
  const { data: session, status } = useSession();
  const currentUser = session?.user?.email || '';

  const [matches, setMatches] = useState<Profile[]>([]);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await fetch('/api/auth/profiles');
        const data = await res.json();

        const normalizeString = (str: string) => str.toLowerCase().trim();

        const all: Profile[] = data.map((p: any) => ({
          ...p,
          major: normalizeString(p.major),
          year: normalizeString(p.year),
          hobbies: Array.isArray(p.hobbies)
            ? p.hobbies.map((h: string) => normalizeString(h))
            : p.hobbies.split(',').map((h: string) => normalizeString(h.trim())),
        }));

        const current = all.find((p) => p.owner === currentUser);
        if (!current) return;

        setUserProfile(current);

        const others = all
          .filter((p) => p.owner !== currentUser)
          .map((p) => ({
            ...p,
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            score: calculateMatchScore(current, p),
          }))
          .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
          .slice(0, 5);

        setMatches(others);
      } catch (err) {
        console.error('Failed to fetch profiles:', err);
      }
    };

    if (currentUser) fetchProfiles();
  }, [currentUser]);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'unauthenticated') redirect('/auth/signin');

  const calculateMatchScore = (user: Profile, other: Profile): number => {
    let score = 0;

    if (user.major === other.major) score += 2;
    if (user.year === other.year) score += 2;

    const shared = user.hobbies.filter((h) => other.hobbies.includes(h));
    score += shared.length;

    return score;
  };

  return (
    <div style={{ backgroundColor: '#006848', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <Container>
        <h1 className="mb-4 text-white">Match Page</h1>
        <p className="mb-4 text-white">Here are your top matches based on major, year, and hobbies:</p>

        {matches.length === 0 ? (
          <p className="text-light">
            No matches found. Try updating your profile or wait for more users to join.
          </p>
        ) : (
          matches.map((match) => (
            <Card key={match.owner} className="mb-3 p-3" style={{ backgroundColor: 'white', color: 'black' }}>
              <Row className="align-items-center g-3">
                <Col xs={3} md={2}>
                  <Image
                    src={match.image}
                    alt={match.name}
                    width={80}
                    height={80}
                    className="rounded-circle"
                  />
                </Col>
                <Col>
                  <h5>{match.name}</h5>
                  <p className="mb-1">
                    <strong>Major:</strong> 
                    {' '}
                    {match.major}
                  </p>
                  <p className="mb-1">
                    <strong>Year:</strong> 
                    {' '}
                    {match.year}
                  </p>
                  <p className="mb-1">
                    <strong>Shared Hobbies:</strong>
                    {' '}
                    {userProfile &&
                      match.hobbies.filter((h) => userProfile.hobbies.includes(h)).join(', ')}
                  </p>
                  <p className="mb-1">
                    <strong>Bio:</strong> 
                    {' '}
                    {match.bio}
                  </p>
                  <p className="mb-1">
                    <strong>Score:</strong> 
                    {' '}
                    {match.score}
                  </p>
                  <Button href={`/chat?user=${encodeURIComponent(match.owner)}`} variant="primary">
                    Start Chat
                  </Button>
                </Col>
              </Row>
            </Card>
          ))
        )}
      </Container>
    </div>
  );
};

export default MatchPage;
