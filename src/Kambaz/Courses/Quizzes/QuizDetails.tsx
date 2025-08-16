import React from "react";
import { useNavigate } from "react-router-dom";

export default function QuizDetails() {
  const navigate = useNavigate();
  const quiz = {
    _id: "quiz_001",
    title: "Q1 - HTML",
    courseId: "CS101",
    points: 29,
    numberOfQuestions: 15,
    quizType: "GRADED_QUIZ",
    assignmentGroup: "QUIZZES",
    shuffleAnswers: false,
    timeLimit: 30,
    multipleAttempts: false,
    maxAttempts: 1,
    showCorrectAnswers: true,
    oneQuestionAtATime: true,
    webcamRequired: false,
    lockQuestionsAfterAnswering: false,
    dueDate: new Date("2024-09-21T13:00:00"),
    availableDate: new Date("2024-09-21T11:40:00"),
    untilDate: new Date("2024-09-21T13:00:00"),
    published: true,
    accessCode: "None",
  };

  const editQuiz = () => {
    console.log("navigartintg to editor")
    navigate(`../Quizzes/Editor/${quiz._id}`, { state: { quiz } });
  };

  const formatDate = (date: Date) =>
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

  return (
    <div className="container my-5">
      {/* Header */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body d-flex flex-column flex-lg-row justify-content-between align-items-lg-center">
          <div>
            <h1 className="card-title">{quiz.title}</h1>
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
            <button className="btn btn-primary" onClick={editQuiz}>
              {" "}
              Edit Quiz
            </button>
            <button className="btn btn-success">Preview Quiz</button>
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
                value={quiz.assignmentGroup}
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
              <DetailRow label="Access code" value={quiz.accessCode} />
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
              <DetailRow label="Questions" value={quiz.numberOfQuestions} />
              <DetailRow label="Total Points" value={quiz.points} />
              <DetailRow label="Time Limit" value={`${quiz.timeLimit} min`} />
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
