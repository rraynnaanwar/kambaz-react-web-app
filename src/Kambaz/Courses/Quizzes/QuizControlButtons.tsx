import { FaCheck, FaTimes } from "react-icons/fa";
import GreenCheckmark from "../Modules/GreenCheckmark";
import * as client from "./client";
import { Dropdown } from "react-bootstrap";
import { QuizContextMenu } from "./QuizContextMenu";

interface QuizControlButtonsProps {
  quiz: any;
  onQuizUpdate?: (updatedQuiz: any) => void;
  onQuizDeleted?: (quizId: string) => void; // Add this prop
}

export default function QuizControlButtons({ 
  quiz, 
  onQuizUpdate, 
  onQuizDeleted 
}: QuizControlButtonsProps) {

  const handlePublishToggle = async () => {
    try {
      const newPublishedStatus = !quiz.published;
      
      // Call API to update quiz published status
      const updatedQuiz = await client.setQuizPublished(quiz._id, newPublishedStatus);
      
      // Update the local quiz object
      const newQuiz = { ...quiz, published: newPublishedStatus };
      
      // Call parent callback to update state if provided
      if (onQuizUpdate) {
        onQuizUpdate(newQuiz);
      }
      
      console.log(`Quiz ${quiz.title} ${newPublishedStatus ? 'published' : 'unpublished'}`);
    } catch (error) {
      console.error("Error updating quiz published status:", error);
    }
  };

  const handlePublishToggleFromMenu = (quizId: string, published: boolean) => {
    // Update the parent state when publish status changes from context menu
    const newQuiz = { ...quiz, published };
    if (onQuizUpdate) {
      onQuizUpdate(newQuiz);
    }
  };

  return (
    <div className="float-end d-flex align-items-center">
      {/* Clickable publish/unpublish button */}
      <button 
        onClick={handlePublishToggle}
        className="btn btn-link p-0 me-2 border-0"
        style={{ background: 'none' }}
        title={quiz.published ? "Click to unpublish" : "Click to publish"}
      >
        {quiz.published ? (
          <GreenCheckmark />
        ) : (
          <FaTimes className="text-danger" style={{ fontSize: '1.2rem' }} />
        )}
      </button>

      {/* Dropdown menu replacing static ellipsis */}
      <Dropdown className="d-inline-block">
        <Dropdown.Toggle
          variant="light"
          id={`quiz-context-${quiz._id}`}
          style={{
            border: "none",
            background: "transparent",
            boxShadow: "none",
            padding: 0,
            fontSize: "1.3rem"
          }}
        >
          ⋮
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <QuizContextMenu 
            quizId={quiz._id}
            quiz={quiz}
            onDeleted={onQuizDeleted}
            onPublishToggle={handlePublishToggleFromMenu}
          />
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}