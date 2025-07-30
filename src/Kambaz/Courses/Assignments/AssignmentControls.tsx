import { FaPlus } from "react-icons/fa6";
import { Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../styles.css"

export default function ModulesControls() {
  const { cid } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY";

  const handleAddAssignment = () => {
    navigate(`/Kambaz/Courses/${cid}/Assignments/new`);
  };

  const handleAddGroup = () => {
    console.log("Add Group clicked");
  };

  if (!isFaculty) {
    return null;
  }

  return (
    <div id="wd-modules-controls" className="text-nowrap">
      <Button 
        variant="danger" 
        size="lg" 
        className="me-1 float-end" 
        id="wd-assignment-btn"
        onClick={handleAddAssignment}
      >
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
        Assignment
      </Button>
      <Button 
        variant="secondary" 
        size="lg" 
        className="me-1 float-end" 
        id="wd-group-btn"
        onClick={handleAddGroup}
      >
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
        Group
      </Button>
    </div>
  );
}