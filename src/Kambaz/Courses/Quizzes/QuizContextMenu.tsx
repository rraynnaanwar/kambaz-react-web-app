import { Dropdown } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import * as client from "./client.ts";

interface QuizContextMenuProps {
  quizId: string;
  quiz?: any; // Add quiz object to get current published status
  onDeleted?: (id: string) => void;
  onPublishToggle?: (quizId: string, published: boolean) => void;
}

export function QuizContextMenu({ 
  quizId, 
  quiz, 
  onDeleted, 
  onPublishToggle 
}: QuizContextMenuProps) {
  const navigate = useNavigate();
  const { cid } = useParams();
  
  // Use quiz prop if available, otherwise default to false
  const [isPublished, setIsPublished] = useState(quiz?.published || false);

  // Update local state when quiz prop changes
  useEffect(() => {
    setIsPublished(quiz?.published || false);
  }, [quiz?.published]);

  const handleEdit = () => {
    navigate(`Editor/${quizId}`);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this quiz?")) {
      try {
        await client.deleteQuiz(quizId);
        console.log("Successfully deleted quiz.");
        if (onDeleted) {
          onDeleted(quizId);
        }
      } catch (error) {
        console.error("Error deleting quiz:", error);
        alert("Failed to delete quiz. Please try again.");
      }
    }
  };

  const handlePublishToggle = async () => {
    try {
      const newPublishedStatus = !isPublished;
      await client.setQuizPublished(quizId, newPublishedStatus);
      setIsPublished(newPublishedStatus);
      
      if (onPublishToggle) {
        onPublishToggle(quizId, newPublishedStatus);
      }
      
      console.log(`Quiz ${newPublishedStatus ? 'published' : 'unpublished'}`);
    } catch (error) {
      console.error("Error updating quiz published status:", error);
      alert("Failed to update quiz status. Please try again.");
    }
  };

  return (
    <>
      <Dropdown.Item onClick={handleEdit}>Edit</Dropdown.Item>
      <Dropdown.Item onClick={handleDelete} className="text-danger">
        Delete
      </Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item onClick={handlePublishToggle}>
        {isPublished ? "Unpublish" : "Publish"}
      </Dropdown.Item>
    </>
  );
}