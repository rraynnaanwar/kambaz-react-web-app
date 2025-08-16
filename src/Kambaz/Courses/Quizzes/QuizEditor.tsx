import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import * as client from "./client";

// Move FormGroup outside to prevent recreating on every render
const FormGroup = ({
  label,
  children,
  required = false,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) => (
  <div className="mb-4">
    <label className="form-label fw-semibold">
      {label} {required && <span className="text-danger">*</span>}
    </label>
    {children}
  </div>
);

// Define props interface
interface QuizEditorProps {
  initialQuiz?: any;
  onSave?: (quiz: any) => void;
  onCancel?: () => void;
  showHeader?: boolean;
  isNewQuiz?: boolean;
}

export default function QuizEditor({
  initialQuiz,
  onSave,
  onCancel,
  showHeader = true,
  isNewQuiz = false
}: QuizEditorProps = {}) {
  const navigate = useNavigate();
  const { qid, cid } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("details");
  const [loading, setLoading] = useState(false);

  // Initialize with fallback dummy quiz first
  const [quiz, setQuiz] = useState(() => {
    // 1. Use initialQuiz prop if provided
    if (initialQuiz) {
      return {
        ...initialQuiz,
        courseId: cid || initialQuiz.courseId,
        dueDate: initialQuiz.dueDate
          ? new Date(initialQuiz.dueDate).toISOString().slice(0, 16)
          : "",
        availableDate: initialQuiz.availableDate
          ? new Date(initialQuiz.availableDate).toISOString().slice(0, 16)
          : "",
        untilDate: initialQuiz.untilDate
          ? new Date(initialQuiz.untilDate).toISOString().slice(0, 16)
          : "",
        description: initialQuiz.description || "",
      };
    }

    // 2. If we have state data, use it
    if (location.state?.quiz) {
      const quizData = location.state.quiz;
      return {
        ...quizData,
        courseId: cid,
        dueDate: quizData.dueDate
          ? new Date(quizData.dueDate).toISOString().slice(0, 16)
          : "",
        availableDate: quizData.availableDate
          ? new Date(quizData.availableDate).toISOString().slice(0, 16)
          : "",
        untilDate: quizData.untilDate
          ? new Date(quizData.untilDate).toISOString().slice(0, 16)
          : "",
        description: quizData.description || "",
      };
    }

    // 3. Fallback dummy quiz (will be replaced by useEffect if qid exists)
    return {
      _id: qid || "quiz_001",
      title: isNewQuiz ? "New Quiz" : "Q1 - HTML",
      courseId: cid || "CS101",
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
      dueDate: "2024-09-21T13:00",
      availableDate: "2024-09-21T11:40",
      untilDate: "2024-09-21T13:00",
      published: true,
      accessCode: "",
      description: "",
    };
  });

  // Fetch quiz data if we have qid but no location state and no initialQuiz prop
  useEffect(() => {
    const fetchQuizData = async () => {
      // Only fetch if we don't have initialQuiz prop, location state, and we have a quiz ID
      if (!initialQuiz && !location.state?.quiz && qid) {
        try {
          setLoading(true);
          const fetchedQuiz = await client.getQuizById(qid);
          
          // Format dates for datetime-local inputs
          const formattedQuiz = {
            ...fetchedQuiz,
            courseId: cid, // Ensure courseId is set from URL params
            dueDate: fetchedQuiz.dueDate
              ? new Date(fetchedQuiz.dueDate).toISOString().slice(0, 16)
              : "",
            availableDate: fetchedQuiz.availableDate
              ? new Date(fetchedQuiz.availableDate).toISOString().slice(0, 16)
              : "",
            untilDate: fetchedQuiz.untilDate
              ? new Date(fetchedQuiz.untilDate).toISOString().slice(0, 16)
              : "",
            description: fetchedQuiz.description || "",
          };
          
          setQuiz(formattedQuiz);
        } catch (error) {
          console.error("Error fetching quiz:", error);
          // Keep the fallback dummy quiz if fetch fails
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQuizData();
  }, [qid, cid, location.state, initialQuiz]);

  // Use useCallback to prevent function recreation on every render
  const handleInputChange = useCallback((field: string, value: any) => {
    setQuiz((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      console.log("Saving quiz:", quiz);
      await client.createQuiz(quiz);
      alert("Quiz saved successfully!");
      navigate(-1); // Go back to quiz details
    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("Failed to save quiz. Please try again.");
    }
  }, [quiz, navigate]);

  const handleCancel = useCallback(() => {
    navigate(-1); // Go back to quiz details
  }, [navigate]);

  // Show loading state while fetching quiz data
  if (loading) {
    return (
      <div className="container my-4">
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading quiz data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">Edit Quiz</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <button
                  className="btn btn-link p-0 text-decoration-none"
                  onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
                >
                  Quizzes
                </button>
              </li>
              <li className="breadcrumb-item">
                <button
                  className="btn btn-link p-0 text-decoration-none"
                  onClick={() => navigate(-1)}
                >
                  {quiz.title}
                </button>
              </li>
              <li className="breadcrumb-item active">Edit</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={handleSubmit}
          >
            Save
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={async () => {
              if (!qid) return;
              try {
                // First save the quiz
                await handleSubmit();
                // Then set published to true
                await client.setQuizPublished(qid, true);
                // Also update local state
                setQuiz((prev: any) => ({ ...prev, published: true }));
              } catch (error) {
                console.error("Error saving and publishing quiz:", error);
                alert("Failed to save and publish quiz. Please try again.");
              }
            }}
          >
            Save & Publish
          </button>
        </div>
      </div>

      <div className="row">
        {/* Main Content */}
        <div className="col-lg-8">
          {/* Navigation Tabs */}
          <div className="card shadow-sm mb-4">
            <div className="card-header p-0">
              <nav>
                <div className="nav nav-tabs" role="tablist">
                  <button
                    className={`nav-link ${
                      activeTab === "details" ? "active" : ""
                    }`}
                    type="button"
                    onClick={() => setActiveTab("details")}
                  >
                    Details
                  </button>
                  <button
                    className={`nav-link ${
                      activeTab === "options" ? "active" : ""
                    }`}
                    type="button"
                    onClick={() => setActiveTab("options")}
                  >
                    Options
                  </button>
                  <button
                    className={`nav-link ${
                      activeTab === "restrictions" ? "active" : ""
                    }`}
                    type="button"
                    onClick={() => setActiveTab("restrictions")}
                  >
                    Restrictions
                  </button>
                </div>
              </nav>
            </div>

            <div className="card-body">
              {/* Details Tab */}
              {activeTab === "details" && (
                <div>
                  <FormGroup label="Quiz Title" required>
                    <input
                      type="text"
                      className="form-control"
                      value={quiz.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="Enter quiz title"
                    />
                  </FormGroup>

                  <FormGroup label="Description">
                    <textarea
                      className="form-control"
                      rows={4}
                      value={quiz.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Enter quiz description (optional)"
                    />
                  </FormGroup>

                  <div className="row">
                    <div className="col-md-6">
                      <FormGroup label="Quiz Type">
                        <select
                          className="form-select"
                          value={quiz.quizType || "GRADED_QUIZ"}
                          onChange={(e) =>
                            handleInputChange("quizType", e.target.value)
                          }
                        >
                          <option value="GRADED_QUIZ">Graded Quiz</option>
                          <option value="PRACTICE_QUIZ">Practice Quiz</option>
                          <option value="GRADED_SURVEY">Graded Survey</option>
                          <option value="UNGRADED_SURVEY">
                            Ungraded Survey
                          </option>
                        </select>
                      </FormGroup>
                    </div>
                    <div className="col-md-6">
                      <FormGroup label="Assignment Group">
                        <select
                          className="form-select"
                          value={quiz.assignmentGroup || "QUIZZES"}
                          onChange={(e) =>
                            handleInputChange("assignmentGroup", e.target.value)
                          }
                        >
                          <option value="QUIZZES">Quizzes</option>
                          <option value="ASSIGNMENTS">Assignments</option>
                          <option value="EXAMS">Exams</option>
                        </select>
                      </FormGroup>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-4">
                      <FormGroup label="Points">
                        <input
                          type="number"
                          className="form-control"
                          value={quiz.points || 0}
                          onChange={(e) =>
                            handleInputChange(
                              "points",
                              parseInt(e.target.value) || 0
                            )
                          }
                          min="0"
                        />
                      </FormGroup>
                    </div>
                    <div className="col-md-4">
                      <FormGroup label="Number of Questions">
                        <input
                          type="number"
                          className="form-control"
                          value={quiz.numberOfQuestions || 1}
                          onChange={(e) =>
                            handleInputChange(
                              "numberOfQuestions",
                              parseInt(e.target.value) || 1
                            )
                          }
                          min="1"
                        />
                      </FormGroup>
                    </div>
                    <div className="col-md-4">
                      <FormGroup label="Time Limit (minutes)">
                        <input
                          type="number"
                          className="form-control"
                          value={quiz.timeLimit || 30}
                          onChange={(e) =>
                            handleInputChange(
                              "timeLimit",
                              parseInt(e.target.value) || 1
                            )
                          }
                          min="1"
                        />
                      </FormGroup>
                    </div>
                  </div>
                </div>
              )}

              {/* Options Tab */}
              {activeTab === "options" && (
                <div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-check mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={quiz.shuffleAnswers || false}
                          onChange={(e) =>
                            handleInputChange(
                              "shuffleAnswers",
                              e.target.checked
                            )
                          }
                        />
                        <label className="form-check-label">
                          Shuffle Answers
                        </label>
                      </div>

                      <div className="form-check mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={quiz.multipleAttempts}
                          onChange={(e) =>
                            handleInputChange(
                              "multipleAttempts",
                              e.target.checked
                            )
                          }
                        />
                        <label className="form-check-label">
                          Allow Multiple Attempts
                        </label>
                      </div>

                      <div className="form-check mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={quiz.showCorrectAnswers}
                          onChange={(e) =>
                            handleInputChange(
                              "showCorrectAnswers",
                              e.target.checked
                            )
                          }
                        />
                        <label className="form-check-label">
                          Show Correct Answers
                        </label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-check mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={quiz.oneQuestionAtATime}
                          onChange={(e) =>
                            handleInputChange(
                              "oneQuestionAtATime",
                              e.target.checked
                            )
                          }
                        />
                        <label className="form-check-label">
                          Show One Question at a Time
                        </label>
                      </div>

                      <div className="form-check mb-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={quiz.lockQuestionsAfterAnswering}
                          onChange={(e) =>
                            handleInputChange(
                              "lockQuestionsAfterAnswering",
                              e.target.checked
                            )
                          }
                        />
                        <label className="form-check-label">
                          Lock Questions After Answering
                        </label>
                      </div>
                    </div>
                  </div>

                  {quiz.multipleAttempts && (
                    <FormGroup label="Maximum Attempts">
                      <input
                        type="number"
                        className="form-control"
                        value={quiz.maxAttempts}
                        onChange={(e) =>
                          handleInputChange(
                            "maxAttempts",
                            parseInt(e.target.value) || 1
                          )
                        }
                        min="1"
                        max="10"
                      />
                    </FormGroup>
                  )}
                </div>
              )}

              {/* Restrictions Tab */}
              {activeTab === "restrictions" && (
                <div>
                  <div className="form-check mb-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={quiz.webcamRequired}
                      onChange={(e) =>
                        handleInputChange("webcamRequired", e.target.checked)
                      }
                    />
                    <label className="form-check-label">
                      Require Webcam
                      <small className="d-block text-muted">
                        Students must have webcam access to take this quiz
                      </small>
                    </label>
                  </div>

                  <FormGroup label="Access Code">
                    <input
                      type="text"
                      className="form-control"
                      value={quiz.accessCode}
                      onChange={(e) =>
                        handleInputChange("accessCode", e.target.value)
                      }
                      placeholder="Enter access code (optional)"
                    />
                    <div className="form-text">
                      Students will need to enter this code to access the quiz
                    </div>
                  </FormGroup>

                  <div className="alert alert-info">
                    <h6 className="alert-heading">Additional Restrictions</h6>
                    <ul className="mb-0">
                      <li>Require Respondus LockDown Browser: No</li>
                      <li>Required to View Quiz Results: No</li>
                      <li>IP Address Filtering: Disabled</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          {/* Due Dates */}
          <div className="card shadow-sm mb-4">
            <div className="card-header">
              <h6 className="mb-0">Due Dates</h6>
            </div>
            <div className="card-body">
              <FormGroup label="Available From">
                <input
                  type="datetime-local"
                  className="form-control"
                  value={quiz.availableDate}
                  onChange={(e) =>
                    handleInputChange("availableDate", e.target.value)
                  }
                />
              </FormGroup>

              <FormGroup label="Due Date">
                <input
                  type="datetime-local"
                  className="form-control"
                  value={quiz.dueDate}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                />
              </FormGroup>

              <FormGroup label="Until">
                <input
                  type="datetime-local"
                  className="form-control"
                  value={quiz.untilDate}
                  onChange={(e) =>
                    handleInputChange("untilDate", e.target.value)
                  }
                />
              </FormGroup>
            </div>
          </div>

          {/* Publish Settings */}
          <div className="card shadow-sm">
            <div className="card-header">
              <h6 className="mb-0">Publish Settings</h6>
            </div>
            <div className="card-body">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={quiz.published || false}
                  onChange={(e) =>
                    handleInputChange("published", e.target.checked)
                  }
                />
                <label className="form-check-label">
                  Published
                  <small className="d-block text-muted">
                    {quiz.published
                      ? "Students can see and take this quiz"
                      : "Quiz is hidden from students"}
                  </small>
                </label>
              </div>
            </div>
          </div>

          {/* Quick Preview */}
          <div className="card shadow-sm mt-4">
            <div className="card-header">
              <h6 className="mb-0">Quick Preview</h6>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Type:</span>
                <span className="badge bg-primary">
                  {quiz.quizType
                    ? quiz.quizType
                        .split("_")
                        .map(
                          (word: string) =>
                            word.charAt(0) + word.slice(1).toLowerCase()
                        )
                        .join(" ")
                    : "Not Set"}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Points:</span>
                <span>{quiz.points || 0}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Questions:</span>
                <span>{quiz.numberOfQuestions || 0}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Time Limit:</span>
                <span>{quiz.timeLimit || 0} min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}