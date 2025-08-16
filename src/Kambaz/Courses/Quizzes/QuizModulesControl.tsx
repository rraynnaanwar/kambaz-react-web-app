import { FaPlus, FaEllipsisVertical } from "react-icons/fa6";
import { Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function QuizModulesControls() {
  const { cid } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY";

const handleAddQuiz = () => {
  // Navigate to create new quiz editor
  navigate(`Editor/new`);
};

  if (!isFaculty) {
    return null;
  }

  return (
    <div id="wd-quiz-modules-controls" className="text-nowrap">
      <Button
        variant="danger"
        size="lg"
        className="me-1 float-end"
        id="wd-quiz-btn"
        onClick={handleAddQuiz}
      >
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
        Quiz
      </Button>

      {/* Simple three ellipsis button */}
      <Button
        variant="light"
        className="me-1 float-end"
        style={{
          border: "1px solid #dee2e6",
          background: "#f8f9fa"
        }}
      >
        <FaEllipsisVertical
          style={{
            fontSize: "1.2rem",
            color: "#6c757d"
          }}
        />
      </Button>
    </div>
  );
}