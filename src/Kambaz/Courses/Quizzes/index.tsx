import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FormControl, InputGroup, ListGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import { FaRegFileAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import QuizModulesControls from "./QuizModulesControl";
import QuizControlButtons from "./QuizControlButtons";
import * as client from "./client";

export default function Quizzes() {
  const { cid } = useParams();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY";

  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getQuizAvailability = (quiz: any) => {
    const now = new Date();
    const availableDate = quiz.availableDate
      ? new Date(quiz.availableDate)
      : null;
    const availableUntilDate = quiz.untilDate ? new Date(quiz.untilDate) : null;

    if (!availableDate) {
      return { status: "Available", className: "text-success" };
    }

    if (now < availableDate) {
      return {
        status: `Not available until ${availableDate.toLocaleString()}`,
        className: "text-muted",
      };
    }

    if (availableUntilDate && now > availableUntilDate) {
      return { status: "Closed", className: "text-danger" };
    }

    return { status: "Available", className: "text-success" };
  };

  const handleQuizUpdate = (updatedQuiz: any) => {
    setQuizzes((prevQuizzes) =>
      prevQuizzes.map((quiz) =>
        quiz._id === updatedQuiz._id ? updatedQuiz : quiz
      )
    );
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        setError(null);
        if (cid) {
          const fetchedQuizzes = await client.getQuizzesByCourse(cid);

          // Filter based on user role
          const visibleQuizzes = isFaculty
            ? fetchedQuizzes // faculty sees all
            : fetchedQuizzes.filter((q: any) => q.published); // students see only published

          setQuizzes(visibleQuizzes);
        }
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError("Failed to load quizzes");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [cid, isFaculty]); // add isFaculty as dependency

  if (loading) {
    return (
      <div id="wd-quizzes" className="p-3">
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="wd-quizzes" className="p-3">
      <div className="d-flex align-items-center mb-3">
        <InputGroup style={{ maxWidth: 300 }}>
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <FormControl placeholder="Search quizzes..." id="wd-search-quizzes" />
        </InputGroup>
        <div className="ms-auto">
          <QuizModulesControls />
        </div>
      </div>

      {error && <div className="alert alert-warning mb-3">{error}.</div>}

      <ListGroup className="rounded-0" id="wd-modules">
        <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary d-flex align-items-center">
            <BsGripVertical className="me-2 fs-3" />
            <span className="me-auto">Assignment Quizzes</span>
          </div>

          <ListGroup className="wd-lessons rounded-0">
            {quizzes.length === 0 ? (
              <div className="p-3 text-muted small">No quizzes available.</div>
            ) : (
              quizzes.map((quiz: any) => (
                <ListGroup.Item key={quiz._id} className="wd-lesson p-3 ps-1">
                  <div className="d-flex">
                    <div className="me-2 d-flex align-items-start">
                      <BsGripVertical className="fs-3" />
                    </div>

                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center">
                        <FaRegFileAlt className="me-2 text-primary" />
                        <div className="me-auto">
                          <div className="fw-bold">{quiz.title}</div>
                          <div
                            className={`small ${
                              getQuizAvailability(quiz).className
                            }`}
                          >
                            <strong>Availability: </strong>
                            {getQuizAvailability(quiz).status}
                          </div>
                        </div>
                        <QuizControlButtons
                          quiz={quiz}
                          onQuizUpdate={handleQuizUpdate}
                        />
                      </div>
                      <div className="mt-1 text-muted small">
                        {quiz.totalQuestions ||
                          quiz.numberOfQuestions ||
                          "Unknown"}{" "}
                        Questions | {quiz.points} pts
                      </div>
                      <div className="text-muted small">
                        Available from {quiz.availableDate || "TBD"}{" "}
                        {quiz.untilDate && <>until {quiz.untilDate}</>}
                      </div>
                    </div>
                  </div>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
}
