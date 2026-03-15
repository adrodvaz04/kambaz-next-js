import { Modal, Button } from "react-bootstrap";
export default function DeleteConfirmModal({
  show,
  handleClose,
  deleteOperation,
  dialogTitle,
  bodyText,
}: {
  show: boolean;
  handleClose: () => void;
  deleteOperation: () => void;
  dialogTitle: string;
  bodyText: string;
}) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{dialogTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{bodyText}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {" "}
          Cancel{" "}
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            deleteOperation();
            handleClose();
          }}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
