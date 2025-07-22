'use client';

import { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={6} className="text-center">
          <h2>Something went wrong!</h2>
          <p>{error.message}</p>
          <button type="button" className="btn btn-outline-danger mt-3" onClick={() => reset()}>
            Try Again
          </button>

        </Col>
      </Row>
    </Container>
  );
}
