import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditTimelineModal = ({
  show,
  handleClose,
  timeline,
  handleChange,
  handleEditSubmit,
  setTimeline,
}) => {



  const getTimeline=()
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Timeline</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="needs-validation">
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label style={{ fontWeight: "bold" }}>Topic</Form.Label>
            <Form.Control
              type="text"
              className="form-control"
              onChange={handleChange}
              autoComplete="on"
              placeholder="Enter your requiement..."
              value={timeline.Topic}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" type="submit" onClick={handleEditSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditTimelineModal;
