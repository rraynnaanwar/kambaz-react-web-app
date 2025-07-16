import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Profile() {
  return (
    <div id="wd-profile-screen">
      <h1>Profile</h1>

      <Form.Control
        id="wd-username"
        placeholder="username"
        className="wd-username mb-3"
        defaultValue="alice"
      />

      <Form.Control
        id="wd-password"
        type="password"
        placeholder="password"
        className="wd-password mb-3"
        defaultValue="123"
      />

      <Form.Control
        id="wd-firstname"
        placeholder="First Name"
        className="mb-3"
        defaultValue="Alice"
      />

      <Form.Control
        id="wd-lastname"
        placeholder="Last Name"
        className="mb-3"
        defaultValue="Wonderland"
      />

      <Form.Control
        id="wd-dob"
        type="date"
        className="mb-3"
        defaultValue="2000-01-01"
      />

      <Form.Control
        id="wd-email"
        type="email"
        placeholder="Email"
        className="mb-3"
        defaultValue="alice@wonderland"
      />

      <Form.Select id="wd-role" className="mb-3" defaultValue="FACULTY">
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
        <option value="FACULTY">Faculty</option>
        <option value="STUDENT">Student</option>
      </Form.Select>

      <Link to="/Kambaz/Account/Signin" className="btn btn-primary">
        Sign out
      </Link>
    </div>
  );
}
