import React, { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";

interface Question {
  id: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK";
  title: string;
  points: number;
  question: string;
  answers?: any[];
  correctAnswer?: string | boolean;
  possibleAnswers?: string[]; // For fill in blank - multiple correct answers
  isEditing: boolean;
}

interface FillInBlankEditorProps {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function FillInBlankEditor({
  question,
  onUpdate,
  onSave,
  onCancel,
}: FillInBlankEditorProps) {
  // Use possibleAnswers array for multiple correct answers, fallback to single correctAnswer
  const [possibleAnswers, setPossibleAnswers] = useState<string[]>(
    question.possibleAnswers || (question.correctAnswer ? [question.correctAnswer as string] : [""])
  );

  const updatePossibleAnswers = (answers: string[]) => {
    setPossibleAnswers(answers);
    onUpdate({ 
      possibleAnswers: answers,
      correctAnswer: answers[0] || "" // Keep first answer as primary correct answer
    });
  };

  const addPossibleAnswer = () => {
    const newAnswers = [...possibleAnswers, ""];
    updatePossibleAnswers(newAnswers);
  };

  const removePossibleAnswer = (index: number) => {
    if (possibleAnswers.length > 1) {
      const newAnswers = possibleAnswers.filter((_, i) => i !== index);
      updatePossibleAnswers(newAnswers);
    }
  };

  const updateAnswerAtIndex = (index: number, value: string) => {
    const newAnswers = [...possibleAnswers];
    newAnswers[index] = value;
    updatePossibleAnswers(newAnswers);
  };

  return (
    <Card className="mb-3 border-2">
      <Card.Body className="p-4">
        {/* Header with Title, Type, and Points */}
        <div className="row mb-4">
          <div className="col-md-4">
            <Form.Control
              type="text"
              value={question.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Easy fill the blank"
              className="border-2 fw-semibold"
            />
          </div>
          <div className="col-md-4">
            <Form.Select
              value={question.type}
              onChange={(e) => {
                const newType = e.target.value as Question["type"];
                let updates: Partial<Question> = { type: newType };
                
                if (newType === "TRUE_FALSE") {
                  updates.correctAnswer = true;
                  updates.answers = undefined;
                  updates.possibleAnswers = undefined;
                } else if (newType === "FILL_BLANK") {
                  updates.correctAnswer = "";
                  updates.answers = undefined;
                  updates.possibleAnswers = [""];
                } else if (newType === "MULTIPLE_CHOICE") {
                  updates.answers = [
                    { id: `a_${Date.now()}_1`, text: "", isCorrect: true },
                    { id: `a_${Date.now()}_2`, text: "", isCorrect: false },
                  ];
                  updates.correctAnswer = undefined;
                  updates.possibleAnswers = undefined;
                }
                
                onUpdate(updates);
              }}
              className="border-2"
            >
              <option value="MULTIPLE_CHOICE">Multiple Choice</option>
              <option value="TRUE_FALSE">True/False</option>
              <option value="FILL_BLANK">Fill in the Blank</option>
            </Form.Select>
          </div>
          <div className="col-md-4 d-flex align-items-end">
            <div className="d-flex align-items-center">
              <span className="me-2 fw-semibold">pts:</span>
              <Form.Control
                type="number"
                value={question.points}
                onChange={(e) => onUpdate({ points: parseInt(e.target.value) || 1 })}
                min="1"
                className="border-2"
                style={{ width: "80px" }}
              />
            </div>
          </div>
        </div>

        {/* Instructional Text */}
        <div className="mb-4 p-3 bg-light rounded">
          <small className="text-muted">
            Enter your question text, then define all possible correct answers for the blank. 
            Students will see the question followed by a small text box to type their answer.
          </small>
        </div>

        {/* Question Text with WYSIWYG-Style Editor */}
        <div className="mb-4">
          <Form.Label className="fw-semibold h6">Question:</Form.Label>
          <div className="border rounded">
            {/* Toolbar */}
            <div className="border-bottom px-3 py-2 bg-light d-flex align-items-center gap-3">
              <span className="text-muted small">Edit</span>
              <span className="text-muted small">View</span>
              <span className="text-muted small">Insert</span>
              <span className="text-muted small">Format</span>
              <span className="text-muted small">Tools</span>
              <span className="text-muted small">Table</span>
              <div className="ms-auto d-flex align-items-center gap-2">
                <span className="text-muted small">12pt ▼</span>
                <span className="text-muted small">Paragraph ▼</span>
                <div className="d-flex gap-2">
                  <span className="fw-bold">B</span>
                  <span className="fst-italic">I</span>
                  <span className="text-decoration-underline">U</span>
                  <span className="text-muted">A ▼</span>
                  <span className="text-muted">✎ ▼</span>
                  <span className="text-muted">T² ▼</span>
                </div>
                <span className="text-muted">⋮</span>
              </div>
            </div>
            <Form.Control
              as="textarea"
              rows={4}
              value={question.question}
              onChange={(e) => onUpdate({ question: e.target.value })}
              placeholder="How much is 2 + 2 = _______?"
              className="border-0 rounded-0"
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>

        {/* Possible Answers */}
        <div className="mb-4">
          <Form.Label className="fw-semibold h6">Answers:</Form.Label>
          {possibleAnswers.map((answer, index) => (
            <div key={index} className="d-flex align-items-center mb-3">
              <div className="me-3" style={{ minWidth: '140px' }}>
                <span className="text-muted">Possible Answer:</span>
              </div>
              <Form.Control
                type="text"
                value={answer}
                onChange={(e) => updateAnswerAtIndex(index, e.target.value)}
                placeholder={index === 0 ? "4" : index === 1 ? "four" : "dos"}
                className="flex-grow-1 me-3 border-2"
              />
              {possibleAnswers.length > 1 && (
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => removePossibleAnswer(index)}
                  title="Delete this answer"
                  className="border-0"
                >
                  🗑️
                </Button>
              )}
            </div>
          ))}
          
          <div className="text-center mt-3">
            <Button
              variant="link"
              className="text-danger text-decoration-none fw-normal"
              onClick={addPossibleAnswer}
            >
              + Add Another Answer
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex justify-content-start gap-2 pt-3 border-top">
          <Button
            variant="outline-secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onSave}
          >
            {question.id.startsWith('q_') ? 'Save Question' : 'Update Question'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}