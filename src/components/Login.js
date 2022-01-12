import React from 'react'
import { Container, Form, Button, Card } from 'react-bootstrap'

export default function Login({ handleSubmitLogin, usernameRef }) {
  return (
    <Container className="align-items-center m-5" style={{ height: '100vh' }}>
      <Card className="text-center m-5 bg-success text-white">
        <Card.Header>ChatApp</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmitLogin} className="w-100">
            <Form.Group>
              <Card.Title><Form.Label>Enter Your Username</Form.Label></Card.Title>
              <Card.Text className="ms-5 me-5">
                <div className="row">
                  <div className="col-md">
                  </div>
                  <div className="col">
                    <Form.Control className="text-center" type="text" ref={usernameRef} required />
                  </div>
                  <div className="col-md">
                  </div>
                </div>
              </Card.Text>
              <Button className="mt-2" type="submit" variant="light">Login</Button>
            </Form.Group>
          </Form>
        </Card.Body>
        <Card.Footer className="text-white">created by: riko</Card.Footer>
      </Card>
    </Container>
  )
}
