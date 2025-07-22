'use client';

import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import './landing.css';

const Home = () => {
  const { status } = useSession();
  const isLoggedIn = status === 'authenticated';

  return (
    <main>
      <div className="section section-hero text-white text-center">
        <Container className="py-5">
          {isLoggedIn ? (
            <>
              <h1 className="display-4">Welcome to Find My Friends!</h1>
              <p className="lead">
                Use the menu bar above to navigate to your desired page.
              </p>
            </>
          ) : (
            <>
              <h1 className="display-3 fw-bold">Find My Friends</h1>
              <p className="lead">
                Helping UH students connect through shared majors, classes, and interests.
              </p>
              <div className="d-flex justify-content-center flex-wrap gap-3 mt-4">
                <Link href="/auth/signin">
                  <Button className="btn-uh" size="lg">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="btn-uh-outline" size="lg">
                    Sign Up to Get Started
                  </Button>
                </Link>
              </div>
            </>
          )}
        </Container>
      </div>

      {!isLoggedIn && (
        <div className="section section-info text-dark text-center">
          <Container className="py-5">
            <Row>
              <Col md={6}>
                <h2>Connect with classmates</h2>
                <p>
                  Search for fellow students in your major or classes and build new friendships.
                </p>
              </Col>
              <Col md={6}>
                <h2>Smart friend suggestions</h2>
                <p>
                  Our platform suggests potential friends based on shared courses, interests, and UH activities.
                </p>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </main>
  );
};

export default Home;
