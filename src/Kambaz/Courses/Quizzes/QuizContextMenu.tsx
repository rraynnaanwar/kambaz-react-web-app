import { Dropdown } from "react-bootstrap";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import * as client from "./client.ts";

interface QuizContextMenuProps {
  quizId: string;
  onDeleted?: (id: string) => void; // optional callback to update parent
}

export function QuizContextMenu({ quizId, onDeleted }: QuizContextMenuProps) {
  const navigate = useNavigate();
  const [isPublished, setIsPublished] = useState(false);
  const handleEdit = () => {
    navigate(`Editor/${quizId}`);
  };

  const handleDelete = async () => {
    if (quizId) {
      const quiz = await client.deleteQuiz(quizId);
      console.log("Successfully deleted course.");
    } else {
      console.log("No quiz id detected");
    }
  };

  const handlePublishToggle = () => {
    setIsPublished(!isPublished);
    console.log(isPublished ? "Unpublish quiz" : "Publish quiz");
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
