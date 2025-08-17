import { useParams, useNavigate } from "react-router";
import * as client from "./client.ts";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

interface QuizAttempt {
  _id: string;
  userId: string;
  quizId: string;
  attemptNumber: number;
  answers: {[questionId: string]: any};
  score: number;
  maxScore: number;
  startTime: Date;
  endTime?: Date;
  isCompleted: boolean;
}

export default function TakeQuiz() {
  const { qid, cid } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY";

  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: any}>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  
  // Attempt tracking
  const [userAttempts, setUserAttempts] = useState<QuizAttempt[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState<QuizAttempt | null>(null);
  const [viewingResults, setViewingResults] = useState(false);
  const [lastAttempt, setLastAttempt] = useState<QuizAttempt | null>(null);
  const [loading, setLoading] = useState(true);

  if (!qid) return;
  useEffect(() => {
    if (!qid) {
      console.log("no qid");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch quiz data
        const q = await client.getQuizById(qid);
        setQuiz(q);
        setTimeRemaining(q.timeLimit * 60); // Convert minutes to seconds
        
        // Fetch questions
        const qs = await client.getQuestionsByQuiz(qid);
        const sortedQuestions = qs.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        setQuestions(sortedQuestions);
        
        // For students, fetch their attempts
        if (!isFaculty && currentUser) {
          const attempts = await client.getUserQuizAttempts(currentUser._id, qid);
          setUserAttempts(attempts);
          
          if (attempts.length > 0) {
            const lastAttemptData = attempts[attempts.length - 1];
            setLastAttempt(lastAttemptData);
            
            // If they want to view results of last attempt
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('view') === 'results') {
              setViewingResults(true);
            }
          }
        }
        
      } catch (err) {
        console.error("Error loading quiz:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [qid, currentUser, isFaculty]);

  // Timer countdown
  useEffect(() => {
    let timer: number;
    if (quizStarted && timeRemaining > 0 && !quizSubmitted && !viewingResults) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeRemaining, quizSubmitted, viewingResults]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const canTakeQuiz = () => {
    if (isFaculty) return true; // Faculty can always preview
    if (!quiz.multipleAttempts && userAttempts.length > 0) return false;
    if (quiz.multipleAttempts && userAttempts.length >= quiz.maxAttempts) return false;
    return true;
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleStartQuiz = async () => {
    if (isFaculty) {
      // Faculty just previews, no attempt tracking
      setQuizStarted(true);
      return;
    }

    try {
      // Create new attempt for student
      const attempt = await client.createQuizAttempt({
        userId: currentUser._id,
        quizId: qid,
        attemptNumber: userAttempts.length + 1,
        answers: {},
        startTime: new Date(),
        isCompleted: false
      });
      
      setCurrentAttempt(attempt);
      setQuizStarted(true);
    } catch (error) {
      console.error("Error starting quiz:", error);
    }
  };

  const handleSubmitQuiz = async () => {
    if (isFaculty) {
      // Faculty preview submission
      setQuizSubmitted(true);
      return;
    }

    try {
      // Calculate score
      const score = calculateScore();
      const maxScore = questions.reduce((sum, q) => sum + q.points, 0);
      
      // Update attempt with final answers and score
      if (!currentAttempt) {
        console.error("No current attempt found");
        return;
      }
      
      const updatedAttempt = await client.updateQuizAttempt(currentAttempt._id, {
        answers,
        score,
        maxScore,
        endTime: new Date(),
        isCompleted: true
      });
      
      setCurrentAttempt(updatedAttempt);
      setQuizSubmitted(true);
      
      // Refresh attempts list
      const attempts = await client.getUserQuizAttempts(currentUser._id, qid);
      setUserAttempts(attempts);
      
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(question => {
      const userAnswer = answers[question._id];
      let isCorrect = false;
      
      if (question.type === "MULTIPLE_CHOICE") {
        const correctAnswer = question.answers.find((a: any) => a.isCorrect);
        isCorrect = userAnswer === correctAnswer?._id;
      } else if (question.type === "TRUE_FALSE") {
        isCorrect = userAnswer === question.correctAnswer;
      } else if (question.type === "FILL_BLANK") {
        // Check if answer matches any of the possible answers (case insensitive)
        const userAnswerLower = userAnswer?.toString().toLowerCase().trim();
        isCorrect = question.possibleAnswers?.some((possible: string) => 
          possible.toLowerCase().trim() === userAnswerLower
        );
      }
      
      if (isCorrect) {
        score += question.points;
      }
    });
    
    return score;
  };

  const isAnswerCorrect = (question: any, userAnswer: any) => {
    if (question.type === "MULTIPLE_CHOICE") {
      const correctAnswer = question.answers.find((a: any) => a.isCorrect);
      return userAnswer === correctAnswer?._id;
    } else if (question.type === "TRUE_FALSE") {
      return userAnswer === question.correctAnswer;
    } else if (question.type === "FILL_BLANK") {
      const userAnswerLower = userAnswer?.toString().toLowerCase().trim();
      return question.possibleAnswers?.some((possible: string) => 
        possible.toLowerCase().trim() === userAnswerLower
      );
    }
    return false;
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleViewResults = () => {
    setViewingResults(true);
    setAnswers(lastAttempt?.answers || {});
    setCurrentQuestionIndex(0);
  };

  const handleRetakeQuiz = () => {
    setViewingResults(false);
    setQuizStarted(false);
    setQuizSubmitted(false);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setTimeRemaining(quiz.timeLimit * 60);
  };

  if (loading) {
    return (
      <div className="container my-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading quiz...</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container my-4">
        <div className="alert alert-danger">
          <h4>Quiz Not Found</h4>
          <p>The requested quiz could not be found.</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container my-4">
        <div className="alert alert-warning">
          <h4>No Questions Found</h4>
          <p>This quiz does not have any questions yet.</p>
        </div>
      </div>
    );
  }

  // Results view for completed quiz
  if (viewingResults && lastAttempt) {
    const currentQuestion = questions[currentQuestionIndex];
    const userAnswer = lastAttempt.answers[currentQuestion._id];
    const isCorrect = isAnswerCorrect(currentQuestion, userAnswer);
    
    return (
      <div className="container my-4">
        {/* Results Header */}
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-4">
                <h5 className="mb-0">{quiz.title} - Results</h5>
                <small className="text-muted">Attempt {lastAttempt.attemptNumber}</small>
              </div>
              <div className="col-md-4 text-center">
                <h4 className={`mb-0 ${lastAttempt.score >= (lastAttempt.maxScore * 0.7) ? 'text-success' : 'text-danger'}`}>
                  Score: {lastAttempt.score}/{lastAttempt.maxScore}
                </h4>
                <small className="text-muted">
                  {((lastAttempt.score / lastAttempt.maxScore) * 100).toFixed(1)}%
                </small>
              </div>
              <div className="col-md-4 text-end">
                <div className="text-muted">
                  <small>Completed: {new Date(lastAttempt.endTime!).toLocaleString()}</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Results */}
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className={`card shadow border-${isCorrect ? 'success' : 'danger'}`}>
              <div className="card-header d-flex justify-content-between align-items-center">
                <span className="badge bg-secondary">Question {currentQuestionIndex + 1}</span>
                <span className={`badge ${isCorrect ? 'bg-success' : 'bg-danger'}`}>
                  {isCorrect ? '✓ Correct' : '✗ Incorrect'} ({currentQuestion.points} pts)
                </span>
              </div>
              <div className="card-body">
                <h4 className="mb-4">{currentQuestion.question}</h4>
                
                {/* Show answers with correct/incorrect indicators */}
                {currentQuestion.type === "MULTIPLE_CHOICE" && currentQuestion.answers && (
                  <div className="mb-4">
                    {currentQuestion.answers.map((answer: any, index: number) => {
                      const isUserChoice = userAnswer === answer._id;
                      const isCorrectChoice = answer.isCorrect;
                      let className = "form-check mb-3";
                      let iconClass = "";
                      
                      if (isCorrectChoice) {
                        className += " text-success";
                        iconClass = "fas fa-check-circle text-success me-2";
                      } else if (isUserChoice && !isCorrectChoice) {
                        className += " text-danger";
                        iconClass = "fas fa-times-circle text-danger me-2";
                      }

                      return (
                        <div key={answer._id || index} className={className}>
                          <div className="d-flex align-items-center">
                            <input
                              className="form-check-input me-2"
                              type="radio"
                              checked={isUserChoice}
                              disabled={true}
                            />
                            <i className={iconClass}></i>
                            <label className="form-check-label">
                              {answer.text}
                              {isUserChoice && <span className="ms-2 badge bg-secondary">Your Answer</span>}
                              {isCorrectChoice && <span className="ms-2 badge bg-success">Correct Answer</span>}
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* True/False Results */}
                {currentQuestion.type === "TRUE_FALSE" && (
                  <div className="mb-4">
                    {[true, false].map((option) => {
                      const isUserChoice = userAnswer === option;
                      const isCorrectChoice = currentQuestion.correctAnswer === option;
                      let className = "form-check mb-3";
                      let iconClass = "";
                      
                      if (isCorrectChoice) {
                        className += " text-success";
                        iconClass = "fas fa-check-circle text-success me-2";
                      } else if (isUserChoice && !isCorrectChoice) {
                        className += " text-danger";
                        iconClass = "fas fa-times-circle text-danger me-2";
                      }

                      return (
                        <div key={option.toString()} className={className}>
                          <div className="d-flex align-items-center">
                            <input
                              className="form-check-input me-2"
                              type="radio"
                              checked={isUserChoice}
                              disabled={true}
                            />
                            <i className={iconClass}></i>
                            <label className="form-check-label">
                              {option ? "True" : "False"}
                              {isUserChoice && <span className="ms-2 badge bg-secondary">Your Answer</span>}
                              {isCorrectChoice && <span className="ms-2 badge bg-success">Correct Answer</span>}
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Fill in Blank Results */}
                {currentQuestion.type === "FILL_BLANK" && (
                  <div className="mb-4">
                    <div className={`form-control ${isCorrect ? 'border-success' : 'border-danger'}`}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span>{userAnswer || "(No answer provided)"}</span>
                        <i className={`fas ${isCorrect ? 'fa-check-circle text-success' : 'fa-times-circle text-danger'}`}></i>
                      </div>
                    </div>
                    <small className="text-muted mt-2 d-block">
                      Correct answers: {currentQuestion.possibleAnswers?.join(", ") || "Not specified"}
                    </small>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="card mt-4">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                    >
                      <i className="fas fa-arrow-left me-2"></i>Previous
                    </button>
                  </div>
                  <div className="col text-center">
                    <span className="text-muted">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                  </div>
                  <div className="col text-end">
                    {currentQuestionIndex < questions.length - 1 ? (
                      <button
                        className="btn btn-primary"
                        onClick={handleNextQuestion}
                      >
                        Next<i className="fas fa-arrow-right ms-2"></i>
                      </button>
                    ) : canTakeQuiz() ? (
                      <button
                        className="btn btn-success"
                        onClick={handleRetakeQuiz}
                      >
                        <i className="fas fa-redo me-2"></i>Retake Quiz
                      </button>
                    ) : (
                      <button
                        className="btn btn-secondary"
                        onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
                      >
                        Back to Quizzes
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Question Navigation */}
            <div className="card mt-3">
              <div className="card-body">
                <h6 className="mb-3">Question Results:</h6>
                <div className="d-flex flex-wrap gap-2">
                  {questions.map((q, index) => {
                    const qUserAnswer = lastAttempt.answers[q._id];
                    const qIsCorrect = isAnswerCorrect(q, qUserAnswer);
                    
                    return (
                      <button
                        key={q._id}
                        className={`btn btn-sm ${
                          index === currentQuestionIndex 
                            ? 'btn-primary' 
                            : qIsCorrect 
                              ? 'btn-success' 
                              : 'btn-danger'
                        }`}
                        onClick={() => setCurrentQuestionIndex(index)}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz completed - show results summary
  if (quizSubmitted && !isFaculty) {
    return (
      <div className="container my-4">
        <div className="card">
          <div className="card-body text-center">
            <div className="mb-4">
              <i className="fas fa-check-circle text-success" style={{fontSize: '4rem'}}></i>
            </div>
            <h2 className="text-success mb-3">Quiz Submitted Successfully!</h2>
            <p className="lead">Thank you for completing the quiz.</p>
            
            {currentAttempt && (
              <div className="mt-4">
                <div className="row justify-content-center">
                  <div className="col-md-6">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h4>Your Results</h4>
                        <h2 className={`${currentAttempt.score >= (currentAttempt.maxScore * 0.7) ? 'text-success' : 'text-danger'}`}>
                          {currentAttempt.score}/{currentAttempt.maxScore}
                        </h2>
                        <p className="mb-0">
                          {((currentAttempt.score / currentAttempt.maxScore) * 100).toFixed(1)}%
                        </p>
                        <hr />
                        <p><strong>Quiz:</strong> {quiz.title}</p>
                        <p><strong>Attempt:</strong> {currentAttempt.attemptNumber} of {quiz.maxAttempts}</p>
                        <p><strong>Completed:</strong> {new Date().toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-4">
              <button 
                className="btn btn-primary me-3"
                onClick={handleViewResults}
              >
                View Detailed Results
              </button>
              {canTakeQuiz() && (
                <button 
                  className="btn btn-outline-secondary me-3"
                  onClick={handleRetakeQuiz}
                >
                  Retake Quiz
                </button>
              )}
              <button 
                className="btn btn-secondary"
                onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
              >
                Back to Quizzes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Faculty preview completion
  if (quizSubmitted && isFaculty) {
    return (
      <div className="container my-4">
        <div className="card">
          <div className="card-body text-center">
            <div className="mb-4">
              <i className="fas fa-eye text-primary" style={{fontSize: '4rem'}}></i>
            </div>
            <h2 className="text-primary mb-3">Quiz Preview Completed</h2>
            <p className="lead">You have previewed the quiz as faculty.</p>
            <div className="mt-4">
              <button 
                className="btn btn-primary me-3"
                onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/Details/${qid}`)}
              >
                Back to Quiz Details
              </button>
              <button 
                className="btn btn-outline-secondary"
                onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
              >
                Back to Quizzes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz start screen
  if (!quizStarted) {
    return (
      <div className="container my-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h3 className="mb-0">{quiz.title}</h3>
                {!isFaculty && (
                  <small>
                    {userAttempts.length > 0 ? `Previous Attempts: ${userAttempts.length}` : 'First Attempt'}
                    {quiz.multipleAttempts && ` | Max Attempts: ${quiz.maxAttempts}`}
                  </small>
                )}
              </div>
              <div className="card-body">
                {/* Show previous attempt info for students */}
                {!isFaculty && lastAttempt && (
                  <div className="alert alert-info mb-4">
                    <h6>Previous Attempt Results:</h6>
                    <div className="row">
                      <div className="col-md-6">
                        <strong>Score:</strong> {lastAttempt.score}/{lastAttempt.maxScore} 
                        ({((lastAttempt.score / lastAttempt.maxScore) * 100).toFixed(1)}%)
                      </div>
                      <div className="col-md-6">
                        <strong>Completed:</strong> {new Date(lastAttempt.endTime!).toLocaleDateString()}
                      </div>
                    </div>
                    <button 
                      className="btn btn-sm btn-outline-info mt-2"
                      onClick={handleViewResults}
                    >
                      View Detailed Results
                    </button>
                  </div>
                )}

                {/* Attempt limit warning */}
                {!isFaculty && !canTakeQuiz() && (
                  <div className="alert alert-danger">
                    <h5>No More Attempts Available</h5>
                    <p>You have used all {quiz.maxAttempts} attempt{quiz.maxAttempts > 1 ? 's' : ''} for this quiz.</p>
                    <button 
                      className="btn btn-primary"
                      onClick={handleViewResults}
                    >
                      View Your Last Results
                    </button>
                    <button 
                      className="btn btn-outline-secondary ms-2"
                      onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes`)}
                    >
                      Back to Quizzes
                    </button>
                  </div>
                )}

                {canTakeQuiz() && (
                  <>
                    <div className="row">
                      <div className="col-md-6">
                        <h5>Quiz Instructions</h5>
                        <ul className="list-unstyled">
                          <li><i className="fas fa-clock text-primary me-2"></i><strong>Time Limit:</strong> {quiz.timeLimit} minutes</li>
                          <li><i className="fas fa-list text-primary me-2"></i><strong>Questions:</strong> {questions.length}</li>
                          <li><i className="fas fa-star text-primary me-2"></i><strong>Points:</strong> {quiz.points} total</li>
                          <li><i className="fas fa-eye text-primary me-2"></i><strong>Attempts:</strong> {quiz.multipleAttempts ? `${quiz.maxAttempts} allowed` : '1 attempt only'}</li>
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <h5>Important Notes</h5>
                        <ul className="small">
                          <li>Navigate between questions using Previous/Next buttons</li>
                          <li>Your answers are saved automatically</li>
                          <li>Submit your quiz before time runs out</li>
                          {quiz.oneQuestionAtATime && <li>You can review and change answers before submitting</li>}
                          {isFaculty && <li className="text-info">You are previewing this quiz as faculty</li>}
                        </ul>
                      </div>
                    </div>
                    <div className="text-center mt-4">
                      <button 
                        className="btn btn-success btn-lg px-5"
                        onClick={handleStartQuiz}
                      >
                        {isFaculty ? 'Preview Quiz' : 'Start Quiz'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active quiz taking interface
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container my-4">
      {/* Header with timer and progress */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-4">
              <h5 className="mb-0">{quiz.title}</h5>
              {!isFaculty && currentAttempt && (
                <small className="text-muted">Attempt {currentAttempt.attemptNumber}</small>
              )}
            </div>
            <div className="col-md-4 text-center">
              <div className="progress mb-2" style={{height: '8px'}}>
                <div 
                  className="progress-bar" 
                  style={{width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`}}
                ></div>
              </div>
              <small className="text-muted">
                Question {currentQuestionIndex + 1} of {questions.length}
              </small>
            </div>
            <div className="col-md-4 text-end">
              {!isFaculty && (
                <div className={`badge ${timeRemaining < 300 ? 'bg-danger' : 'bg-primary'} fs-6 p-2`}>
                  <i className="fas fa-clock me-1"></i>
                  {formatTime(timeRemaining)}
                </div>
              )}
              {isFaculty && (
                <span className="badge bg-info fs-6 p-2">
                  <i className="fas fa-eye me-1"></i>Preview Mode
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span className="badge bg-secondary">Question {currentQuestionIndex + 1}</span>
              <span className="badge bg-info">{currentQuestion.points} point{currentQuestion.points !== 1 ? 's' : ''}</span>
            </div>
            <div className="card-body">
              <h4 className="mb-4">{currentQuestion.question}</h4>
              
              {/* Multiple Choice Questions */}
              {currentQuestion.type === "MULTIPLE_CHOICE" && currentQuestion.answers && (
                <div className="mb-4">
                  {currentQuestion.answers.map((answer: any, index: number) => (
                    <div key={answer._id || index} className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`question_${currentQuestion._id}`}
                        id={`q${currentQuestion._id}_a${index}`}
                        checked={answers[currentQuestion._id] === answer._id}
                        onChange={() => handleAnswerChange(currentQuestion._id, answer._id)}
                      />
                      <label 
                        className="form-check-label" 
                        htmlFor={`q${currentQuestion._id}_a${index}`}
                        style={{cursor: 'pointer'}}
                      >
                        {answer.text}
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {/* True/False Questions */}
              {currentQuestion.type === "TRUE_FALSE" && (
                <div className="mb-4">
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`question_${currentQuestion._id}`}
                      id={`q${currentQuestion._id}_true`}
                      checked={answers[currentQuestion._id] === true}
                      onChange={() => handleAnswerChange(currentQuestion._id, true)}
                    />
                    <label className="form-check-label" htmlFor={`q${currentQuestion._id}_true`}>
                      True
                    </label>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`question_${currentQuestion._id}`}
                      id={`q${currentQuestion._id}_false`}
                      checked={answers[currentQuestion._id] === false}
                      onChange={() => handleAnswerChange(currentQuestion._id, false)}
                    />
                    <label className="form-check-label" htmlFor={`q${currentQuestion._id}_false`}>
                      False
                    </label>
                  </div>
                </div>
              )}

              {/* Fill in the Blank Questions */}
              {currentQuestion.type === "FILL_BLANK" && (
                <div className="mb-4">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Enter your answer..."
                    value={answers[currentQuestion._id] || ""}
                    onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Navigation and Submit */}
          <div className="card mt-4">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    <i className="fas fa-arrow-left me-2"></i>Previous
                  </button>
                </div>
                <div className="col text-center">
                  <span className="text-muted">
                    {Object.keys(answers).length} of {questions.length} questions answered
                  </span>
                </div>
                <div className="col text-end">
                  {currentQuestionIndex < questions.length - 1 ? (
                    <button
                      className="btn btn-primary"
                      onClick={handleNextQuestion}
                    >
                      Next<i className="fas fa-arrow-right ms-2"></i>
                    </button>
                  ) : (
                    <button
                      className="btn btn-success btn-lg"
                      onClick={handleSubmitQuiz}
                    >
                      <i className="fas fa-check me-2"></i>
                      {isFaculty ? 'Finish Preview' : 'Submit Quiz'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Question Navigation */}
          <div className="card mt-3">
            <div className="card-body">
              <h6 className="mb-3">Question Navigation:</h6>
              <div className="d-flex flex-wrap gap-2">
                {questions.map((q, index) => (
                  <button
                    key={q._id}
                    className={`btn btn-sm ${
                      index === currentQuestionIndex 
                        ? 'btn-primary' 
                        : answers[q._id] !== undefined
                          ? 'btn-success' 
                          : 'btn-outline-secondary'
                    }`}
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}