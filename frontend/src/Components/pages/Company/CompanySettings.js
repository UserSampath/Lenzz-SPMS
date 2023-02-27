import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";

const CompanySettings = () => {
  const [show, setShow] = useState(true);
  const [error, setError] = useState(null);
  const history = useNavigate();

  const handleClose = () => {
    setShow(false);
    history("/Company");
  };

  const handleSubmit = async () => {};
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Company Settings</Modal.Title>
          <br />
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label style={{ fontWeight: "bold" }}>
                Company Email
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Company Email"
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label style={{ fontWeight: "bold" }}>
                Company key
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Change your company key"
                autoFocus
              />
            </Form.Group>

            <hr></hr>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "bold" }}>
                Departments
              </Form.Label>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Company details
          </Button>
          {error && (
            <div
              className="error"
              style={{
                padding: " 10px",
                paddingLeft: "65px",
                background: " #ffefef",
                border: " 1px solid var(--error)",
                color: "red",
                borderRadius: "15px",
                margin: " 10px 0",
                marginRight: "55px",
                width: " 340px",
              }}
            >
              {error}
            </div>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CompanySettings;
