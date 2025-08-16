import React, { useState, useCallback, useEffect, useRef } from "react";
import { Button, Card } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash, FaGripVertical } from "react-icons/fa";
import * as client from "../client";
import MultipleChoiceEditor from "./MultipleChoiceEditor";
import TrueFalseEditor from "./TrueFalseEditor";
import FillInBlankEditor from "./FillInBlankEditor";

interface Question {
  id: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK";
  title: string;
  points: number;
  question: string;
  answers?: Answer[];
  correctAnswer?: string | boolean;
  possibleAnswers?: string[]; // For fill in blank
  isEditing: boolean;
}

interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface QuizQuestionsProps {
  quizId?: string;
  onPointsChange?: (totalPoints: number) => void;
}

export default function QuizQuestions({ quizId, onPointsChange }: QuizQuestionsProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  console.log("QuizQuestions component loaded with quizId:", quizId);

  // Load existing questions when component mounts
  useEffect(() => {
    const loadQuestions = async () => {
      if (!quizId) return;
      
      try {
        setLoading(true);
        const existingQuestions = await client.getQuestionsByQuiz(quizId);
        setQuestions(existingQuestions.map((q: any) => ({ ...q, isEditing: false })));
      } catch (error) {
        console.error("Error loading questions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [quizId]);

  // Calculate total points and notify parent with proper dependency management
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const onPointsChangeRef = useRef(onPointsChange);
  
  // Update ref when callback changes
  useEffect(() => {
    onPointsChangeRef.current = onPointsChange;
  }, [onPointsChange]);

  // Notify parent of points change using ref to avoid dependency issues
  useEffect(() => {
    if (onPointsChangeRef.current) {
      onPointsChangeRef.current(totalPoints);
    }
  }, [totalPoints]);

  const saveQuestion = useCallback(async (question: Question) => {
    if (!quizId) {
      console.error("No quizId provided");
      alert("Error: No quiz ID found");
      return;
    }
    
    // Validate required fields
    if (!question.question.trim()) {
      alert("Please enter the question text before saving.");
      return;
    }
    
    if (question.type === "MULTIPLE_CHOICE") {
      const validAnswers = question.answers?.filter(a => a.text.trim()) || [];
      if (validAnswers.length < 2) {
        alert("Multiple choice questions need at least 2 answers with text.");
        return;
      }
      
      const hasCorrectAnswer = question.answers?.some(a => a.isCorrect && a.text.trim());
      if (!hasCorrectAnswer) {
        alert("Please select a correct answer for this multiple choice question.");
        return;
      }
    }
    
    if (question.type === "FILL_BLANK") {
      const validAnswers = question.possibleAnswers?.filter(a => a.trim()) || [];
      if (validAnswers.length === 0) {
        alert("Please enter at least one correct answer for this fill-in-the-blank question.");
        return;
      }
    }
    
    // Clean the question data - remove UI-specific fields and ensure proper structure
    const cleanQuestion: any = {
      type: question.type,
      title: question.title,
      points: question.points,
      question: question.question,
    };
    
    // Add type-specific fields
    if (question.type === "MULTIPLE_CHOICE" && question.answers) {
      // Clean answers and ensure they have proper IDs
      cleanQuestion.answers = question.answers
        .filter(a => a.text.trim()) // Only include answers with text
        .map(a => ({
          _id: a.id, // Use _id instead of id for MongoDB
          text: a.text.trim(),
          isCorrect: a.isCorrect
        }));
    } else if (question.type === "TRUE_FALSE") {
      cleanQuestion.correctAnswer = question.correctAnswer;
    } else if (question.type === "FILL_BLANK") {
      cleanQuestion.possibleAnswers = question.possibleAnswers?.filter(a => a.trim()) || [];
      cleanQuestion.correctAnswer = cleanQuestion.possibleAnswers[0] || "";
    }
    
    console.log("Saving question:", cleanQuestion);
    console.log("Quiz ID:", quizId);
    
    try {
      if (question.id.startsWith('q_')) {
        // New question - create it
        console.log("Creating new question...");
        const savedQuestion = await client.createQuestion(quizId, cleanQuestion);
        console.log("Created question response:", savedQuestion);
        
        // Update the question with the real ID from the server
        updateQuestion(question.id, { 
          id: savedQuestion._id || savedQuestion.id,
          isEditing: false 
        });
      } else {
        // Existing question - update it
        console.log("Updating existing question...");
        const updatedQuestion = await client.updateQuestion(quizId, question.id, cleanQuestion);
        console.log("Updated question response:", updatedQuestion);
        toggleEdit(question.id, false);
      }
      
      console.log("Question saved successfully");
      alert("Question saved successfully!");
    } catch (error) {
      console.error("Error saving question:", error);
    }
  }, [quizId]);

  const handleDeleteQuestion = useCallback(async (id: string) => {
    if (!quizId) return;
    
    if (confirm("Are you sure you want to delete this question?")) {
      try {
        if (!id.startsWith('q_')) {
          // Only call API for existing questions
          await client.deleteQuestion(quizId, id);
        }
        deleteQuestion(id);
        console.log("Question deleted successfully");
      } catch (error) {
        console.error("Error deleting question:", error);
        alert("Failed to delete question. Please try again.");
      }
    }
  }, [quizId]);

  const addNewQuestion = useCallback((questionType: Question["type"] = "MULTIPLE_CHOICE") => {
    const baseQuestion = {
      id: `q_${Date.now()}`,
      type: questionType,
      title: `Question ${questions.length + 1}`,
      points: 1,
      question: "",
      isEditing: true,
    };

    let newQuestion: Question;

    switch (questionType) {
      case "TRUE_FALSE":
        newQuestion = {
          ...baseQuestion,
          correctAnswer: true,
        };
        break;
      case "FILL_BLANK":
        newQuestion = {
          ...baseQuestion,
          correctAnswer: "",
          possibleAnswers: [""],
        };
        break;
      case "MULTIPLE_CHOICE":
      default:
        newQuestion = {
          ...baseQuestion,
          answers: [
            { id: `a_${Date.now()}_1`, text: "", isCorrect: true },
            { id: `a_${Date.now()}_2`, text: "", isCorrect: false },
            { id: `a_${Date.now()}_3`, text: "", isCorrect: false },
            { id: `a_${Date.now()}_4`, text: "", isCorrect: false },
          ],
        };
        break;
    }

    setQuestions(prev => [...prev, newQuestion]);
  }, [questions.length]);

  const updateQuestion = useCallback((id: string, updates: Partial<Question>) => {
    setQuestions(prev => 
      prev.map(q => q.id === id ? { ...q, ...updates } : q)
    );
  }, []);

  const deleteQuestion = useCallback((id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  }, []);

  const toggleEdit = useCallback((id: string, editing: boolean) => {
    setQuestions(prev => 
      prev.map(q => q.id === id ? { ...q, isEditing: editing } : q)
    );
  }, []);

  const updateAnswer = useCallback((questionId: string, answerId: string, text: string) => {
    setQuestions(prev => 
      prev.map(q => 
        q.id === questionId 
          ? {
              ...q,
              answers: q.answers?.map(a => 
                a.id === answerId ? { ...a, text } : a
              )
            }
          : q
      )
    );
  }, []);

  const setCorrectAnswer = useCallback((questionId: string, answerId: string) => {
    setQuestions(prev => 
      prev.map(q => 
        q.id === questionId 
          ? {
              ...q,
              answers: q.answers?.map(a => ({
                ...a,
                isCorrect: a.id === answerId
              }))
            }
          : q
      )
    );
  }, []);

  const addAnswer = useCallback((questionId: string) => {
    setQuestions(prev => 
      prev.map(q => 
        q.id === questionId 
          ? {
              ...q,
              answers: [
                ...(q.answers || []),
                { id: `a_${Date.now()}`, text: "", isCorrect: false }
              ]
            }
          : q
      )
    );
  }, []);

  const removeAnswer = useCallback((questionId: string, answerId: string) => {
    setQuestions(prev => 
      prev.map(q => 
        q.id === questionId 
          ? {
              ...q,
              answers: q.answers?.filter(a => a.id !== answerId)
            }
          : q
      )
    );
  }, []);

  const renderQuestionEditor = (question: Question) => {
    const commonProps = {
      question,
      onUpdate: (updates: Partial<Question>) => updateQuestion(question.id, updates),
      onSave: () => saveQuestion(question),
      onCancel: () => toggleEdit(question.id, false),
    };

    switch (question.type) {
      case "MULTIPLE_CHOICE":
        return (
          <MultipleChoiceEditor
            {...commonProps}
            onUpdateAnswer={(answerId, text) => updateAnswer(question.id, answerId, text)}
            onSetCorrectAnswer={(answerId) => setCorrectAnswer(question.id, answerId)}
            onAddAnswer={() => addAnswer(question.id)}
            onRemoveAnswer={(answerId) => removeAnswer(question.id, answerId)}
          />
        );
      case "TRUE_FALSE":
        return <TrueFalseEditor {...commonProps} />;
      case "FILL_BLANK":
        return <FillInBlankEditor {...commonProps} />;
      default:
        return (
          <MultipleChoiceEditor
            {...commonProps}
            onUpdateAnswer={(answerId, text) => updateAnswer(question.id, answerId, text)}
            onSetCorrectAnswer={(answerId) => setCorrectAnswer(question.id, answerId)}
            onAddAnswer={() => addAnswer(question.id)}
            onRemoveAnswer={(answerId) => removeAnswer(question.id, answerId)}
          />
        );
    }
  };

  const renderQuestionPreview = (question: Question) => {
    return (
      <Card className="mb-3" key={question.id}>
        <Card.Body>
          <div className="d-flex align-items-start">
            <FaGripVertical className="text-muted me-2 mt-1" />
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h6 className="mb-1">{question.title}</h6>
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-secondary">{question.points} pts</span>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => toggleEdit(question.id, true)}
                  >
                    <FaEdit className="me-1" /> Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </div>
              
              <p className="text-muted mb-2">{question.question || "No question text"}</p>
              
              <div className="small text-muted">
                Type: <span className="badge bg-info">
                  {question.type.replace("_", " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                {question.type === "MULTIPLE_CHOICE" && question.answers && (
                  <span className="ms-2">
                    • {question.answers.length} answer choices
                  </span>
                )}
                {question.type === "FILL_BLANK" && question.possibleAnswers && (
                  <span className="ms-2">
                    • {question.possibleAnswers.length} possible answers
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading questions...</p>
      </div>
    );
  }

  return (
    <div className="quiz-questions-editor">
      {/* Header with Points Display */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Quiz Questions</h4>
        <div className="text-end">
          <div className="h5 mb-0">Points: {totalPoints}</div>
          <small className="text-muted">{questions.length} question{questions.length !== 1 ? 's' : ''}</small>
        </div>
      </div>

      {/* Questions List */}
      <div className="questions-container">
        {questions.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <p className="mb-3">No questions added yet</p>
            <Button variant="primary" onClick={addNewQuestion}>
              <FaPlus className="me-2" />
              Add Your First Question
            </Button>
          </div>
        ) : (
          <>
            {questions.map((question) => (
              <div key={question.id}>
                {question.isEditing 
                  ? renderQuestionEditor(question)
                  : renderQuestionPreview(question)
                }
              </div>
            ))}
            
            {/* Add New Question Button */}
            <div className="text-center mt-4">
              <Button
                variant="outline-primary"
                size="lg"
                onClick={addNewQuestion}
                className="px-4"
              >
                <FaPlus className="me-2" />
                New Question
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Bottom Action Buttons */}
      <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
        <Button variant="outline-secondary">
          Cancel
        </Button>
        <Button variant="danger">
          Save
        </Button>
      </div>
    </div>
  );
}