import { IoEllipsisVertical } from "react-icons/io5";
import { BsPlus } from "react-icons/bs";
import { Button } from "react-bootstrap";

export default function AssignmentControlButtons() {
  return (
    <div className="float-end d-flex align-items-center">
      <Button
        variant="light"
        size="sm"
        className="rounded-pill px-3 me-2 border"
        style={{ fontWeight: 500 }}
      >
        40% of Total
      </Button>
      <BsPlus className="fs-4 mx-2" />
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}
