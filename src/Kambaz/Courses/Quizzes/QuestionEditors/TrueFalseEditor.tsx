import React from "react";
import { Button, Card, Form } from "react-bootstrap";

interface Question {
  id: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK";
  title: string;
  points: number;
  question: string;
  answers?: any[];
  correctAnswer?: string | boolean;
  possibleAnswers?: string[]; // For fill in blank
  isEditing: boolean;
}

interface TrueFalseEditorProps {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function TrueFalseEditor({
  question,
  onUpdate,
  onSave,
  onCancel,
}: TrueFalseEditorProps) {
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
              placeholder="Is 2 + 2 = 4?"
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
            Enter your question text, then select if True or False is the correct answer.
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
              placeholder="Is it true that 2 + 2 = 4?"
              className="border-0 rounded-0"
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>

        {/* True/False Answers */}
        <div className="mb-4">
          <Form.Label className="fw-semibold h6">Answers:</Form.Label>
          
          <div className="d-flex align-items-center mb-3">
            <div className="me-3" style={{ minWidth: '140px' }}>
              {question.correctAnswer === true ? (
                <span className="badge bg-success d-flex align-items-center justify-content-center py-1">
                  <span className="me-1">✓</span>
                  Correct Answer
                </span>
              ) : (
                <span className="text-muted">Possible Answer</span>
              )}
            </div>
            <div className="flex-grow-1 me-3 py-2 px-3 bg-light border rounded">
              True
            </div>
            <Form.Check
              type="radio"
              name={`tf-${question.id}`}
              checked={question.correctAnswer === true}
              onChange={() => onUpdate({ correctAnswer: true })}
              className="me-2"
            />
          </div>

          <div className="d-flex align-items-center mb-3">
            <div className="me-3" style={{ minWidth: '140px' }}>
              {question.correctAnswer === false ? (
                <span className="badge bg-success d-flex align-items-center justify-content-center py-1">
                  <span className="me-1">✓</span>
                  Correct Answer
                </span>
              ) : (
                <span className="text-muted">Possible Answer</span>
              )}
            </div>
            <div className="flex-grow-1 me-3 py-2 px-3 bg-light border rounded">
              False
            </div>
            <Form.Check
              type="radio"
              name={`tf-${question.id}`}
              checked={question.correctAnswer === false}
              onChange={() => onUpdate({ correctAnswer: false })}
              className="me-2"
            />
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
            {question?.id?.startsWith('q_') ? 'Save Question' : 'Update Question'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}