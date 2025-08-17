import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import * as client from "./client.ts";

export default function QuizDetails() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY";
  const { qid, cid } = useParams();

  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!qid) {
        setError("No quiz ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching quiz with ID:", qid);

        const fetchedQuiz = await client.getQuizById(qid);
        console.log("Fetched quiz:", fetchedQuiz);

        if (!fetchedQuiz) {
          setError("Quiz not found");
          setLoading(false);
          return;
        }

        setQuiz(fetchedQuiz);
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [qid]);

  const editQuiz = () => {
    console.log("navigating to editor");
    navigate(`/Kambaz/Courses/${cid}/Quizzes/Editor/${quiz._id}`);
  };

  const navigateToTakeQuiz = () => {
    console.log("navigating to take quiz");
    navigate(`/Kambaz/Courses/${cid}/Quizzes/TakeQuiz/${qid}`);
  };

  
  const formatDate = (date: Date | string) =>
    date
      ? new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }).format(new Date(date))
      : "Not set";

  const formatQuizType = (type: string) =>
    type
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");

  const formatBoolean = (value: boolean) => (value ? "Yes" : "No");

  const DetailRow = ({
    label,
    value,
  }: {
    label: string;
    value: string | number;
  }) => (
    <div className="d-flex justify-content-between py-2 border-bottom">
      <span className="text-secondary">{label}</span>
      <span className="fw-bold">{value}</span>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading quiz details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">
          <h4>Error</h4>
          <p>{error}</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  // No quiz found
  if (!quiz) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">
          <h4>Quiz Not Found</h4>
          <p>The requested quiz could not be found.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {/* Header */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body d-flex flex-column flex-lg-row justify-content-between align-items-lg-center">
          <div>
            <h1
              className="card-title text-primary"
              style={{ cursor: "pointer" }}
              onClick={navigateToTakeQuiz}
              onMouseEnter={(e) =>
                (e.currentTarget.style.textDecoration = "underline")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.textDecoration = "none")
              }
            >
              {quiz.title}
            </h1>
            <div className="d-flex flex-wrap gap-2 mt-2 text-muted small">
              <span className="badge bg-primary">
                {formatQuizType(quiz.quizType)}
              </span>
              <span>{quiz.points} points</span>
              <span>{quiz.numberOfQuestions} questions</span>
              <span>{quiz.timeLimit} minutes</span>
            </div>
          </div>
          <div className="mt-3 mt-lg-0 d-flex gap-2">
            {/* Only show Edit Quiz button for faculty */}
            {isFaculty && (
              <button className="btn btn-primary" onClick={editQuiz}>
                Edit Quiz
              </button>
            )}

            {/* Show different button based on user role */}
            <button
              className={`btn ${isFaculty ? "btn-success" : "btn-primary"}`}
              onClick={navigateToTakeQuiz}
            >
              {isFaculty ? "Preview Quiz" : "Take Quiz"}
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">Quiz Configuration</h5>
            </div>
            <div className="card-body">
              <DetailRow
                label="Assignment Group"
                value={quiz.assignmentGroup || "N/A"}
              />
              <DetailRow
                label="Shuffle Answers"
                value={formatBoolean(quiz.shuffleAnswers)}
              />
              <DetailRow
                label="Multiple Attempts"
                value={formatBoolean(quiz.multipleAttempts)}
              />
              <DetailRow label="View Responses" value="Always" />
              <DetailRow label="Show Correct Answers" value="Immediately" />
              <DetailRow
                label="One Question at a Time"
                value={formatBoolean(quiz.oneQuestionAtATime)}
              />
              <DetailRow
                label="Require Respondus LockDown Browser"
                value="No"
              />
              <DetailRow
                label="Webcam Required"
                value={formatBoolean(quiz.webcamRequired)}
              />
              <DetailRow
                label="Lock Questions After Answering"
                value={formatBoolean(quiz.lockQuestionsAfterAnswering)}
              />
              <DetailRow
                label="Access code"
                value={quiz.accessCode || "None"}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats & Due Dates */}
        <div className="col-lg-4 d-flex flex-column gap-4">
          <div className="card shadow-sm">
            <div className="card-header">
              <h6 className="mb-0">Quick Stats</h6>
            </div>
            <div className="card-body">
              <DetailRow
                label="Questions"
                value={quiz.numberOfQuestions || 0}
              />
              <DetailRow label="Total Points" value={quiz.points || 0} />
              <DetailRow
                label="Time Limit"
                value={`${quiz.timeLimit || 0} min`}
              />
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header">
              <h6 className="mb-0">Due Dates</h6>
            </div>
            <div className="card-body">
              <DetailRow label="Due Date" value={formatDate(quiz.dueDate)} />
              <DetailRow
                label="Available From"
                value={formatDate(quiz.availableDate)}
              />
              <DetailRow label="Until" value={formatDate(quiz.untilDate)} />
              <DetailRow label="For" value="Everyone" />
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Details Table */}
      <div className="card shadow-sm mt-4">
        <div className="card-header">
          <h5 className="mb-0">Assignment Details</h5>
        </div>
        <div className="table-responsive">
          <table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th>Due</th>
                <th>For</th>
                <th>Available From</th>
                <th>Until</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-danger fw-bold">
                  {formatDate(quiz.dueDate)}
                </td>
                <td>
                  <span className="badge bg-primary">Everyone</span>
                </td>
                <td>{formatDate(quiz.availableDate)}</td>
                <td>{formatDate(quiz.untilDate)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
