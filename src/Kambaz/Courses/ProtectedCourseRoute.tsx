import { useSelector } from "react-redux";
import { useParams, Navigate } from "react-router-dom";

export default function ProtectedCourseRoute({ children }: { children: any }) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments } = useSelector((state: any) => state.courseReducer);
  const { cid } = useParams();

  if (currentUser?.role === "FACULTY") {
    return children;
  }

  const isEnrolled = enrollments.some(
    (enrollment: any) =>
      enrollment.user === currentUser?._id && enrollment.course === cid
  );

  if (!isEnrolled) {
    return <Navigate to="/Kambaz/Dashboard" replace />;
  }

  return children;
}