import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { ListGroup } from "react-bootstrap";
import { NavLink } from "react-router-dom";

// Inline CSS for active nav link
const navStyles = `
  .list-group-item.active, .list-group-item.active:focus, .list-group-item.active:hover {
    background: #fff !important;
    color: #dc3545 !important;
    font-weight: bold;
  }
  .list-group-item.active .fs-1 {
    color: #dc3545 !important;
  }
`;

export default function KambazNavigation() {
  return (
    <>
      <style>{navStyles}</style>
      <ListGroup id="wd-kambaz-navigation" style={{ width: 110 }}
        className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2">
        <ListGroup.Item id="wd-neu-link" target="_blank" action
          href="https://www.northeastern.edu/"
          className="bg-black border-0 text-center">
          <img src="/images/NEU.png" width="75px" />
        </ListGroup.Item><br />
        <ListGroup.Item to="/Kambaz/Account" as={NavLink}
          className="text-center border-0 bg-black text-white">
          <FaRegCircleUser className="fs-1 text-white" /><br />
          Account
        </ListGroup.Item>
        <ListGroup.Item to="/Kambaz/Dashboard" as={NavLink}
          className="text-center border-0 bg-black text-white">
          <AiOutlineDashboard className="fs-1 text-danger" /><br />
          Dashboard
        </ListGroup.Item>
        <ListGroup.Item to="/Kambaz/Courses" as={NavLink}
          className="text-white bg-black text-center border-0">
          <LiaBookSolid className="fs-1 text-danger" /><br />
          Courses
        </ListGroup.Item>
        <ListGroup.Item to="/Kambaz/Calendar" as={NavLink}
          className="text-white bg-black text-center border-0">
          <IoCalendarOutline className="fs-1 text-danger" /><br />
          Calendar
        </ListGroup.Item>
        <ListGroup.Item to="/Kambaz/Inbox" as={NavLink}
          className="text-white bg-black text-center border-0">
          <FaInbox className="fs-1 text-danger" /><br />
          Inbox
        </ListGroup.Item>
        <ListGroup.Item to="/Labs" as={NavLink}
          className="text-white bg-black text-center border-0">
          <LiaBookSolid className="fs-1 text-danger" /><br />
          Labs
        </ListGroup.Item>
      </ListGroup>
    </>
  );
}