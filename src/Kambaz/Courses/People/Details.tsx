import { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useParams, useNavigate } from "react-router";
import * as client from "../../Account/client";
import { FaPencil, FaCheck } from "react-icons/fa6";
import { FormControl, FormSelect } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";

export default function PeopleDetails() {
  const { uid } = useParams();
  const [user, setUser] = useState<any>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  const deleteUser = async (uid: string) => {
    await client.deleteUser(uid);
    navigate(-1);
  };

  const fetchUser = async () => {
    if (!uid) return;
    const foundUser = await client.findUserById(uid);
    setUser(foundUser);
    setName(`${foundUser.firstName} ${foundUser.lastName}`);
    setEmail(foundUser.email || "");
    setRole(foundUser.role || "");
  };

  useEffect(() => {
    if (uid) fetchUser();
  }, [uid]);

  if (!uid) return null;

  const saveUser = async () => {
    const [firstName, lastName] = name.trim().split(" ");
    const updatedUser = {
      ...user,
      firstName,
      lastName,
      email,
      role
    };
    await client.updateUser(updatedUser);
    setUser(updatedUser);
    setEditing(false);
  };

  return (
    <div className="wd-people-details position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25">
      {/* Close button */}
      <button
        onClick={() => navigate(-1)}
        className="btn position-fixed end-0 top-0 wd-close-details"
      >
        <IoCloseSharp className="fs-1" />
      </button>

      {/* User avatar */}
      <div className="text-center mt-2">
        <FaUserCircle className="text-secondary me-2 fs-1" />
      </div>

      <hr />

      {/* Name + icons */}
      <div className="text-danger fs-4 wd-name">
        {!editing && (
          <FaPencil
            onClick={() => setEditing(true)}
            className="float-end fs-5 mt-2 wd-edit"
          />
        )}
        {editing && (
          <FaCheck
            onClick={saveUser}
            className="float-end fs-5 mt-2 me-2 wd-save"
          />
        )}

        {!editing && (
          <div
            className="wd-name"
            onClick={() => setEditing(true)}
            style={{ cursor: "pointer" }}
          >
            {user.firstName} {user.lastName}
          </div>
        )}
        {editing && (
          <FormControl
            className="w-75 mb-2 wd-edit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                saveUser();
              }
            }}
          />
        )}

        {/* Email */}
        {!editing && (
          <>
            <b>Email:</b> <span className="wd-email">{user.email}</span>
            <br />
          </>
        )}
        {editing && (
          <>
            <b>Email:</b>
            <FormControl
              type="email"
              className="w-75 mb-2 wd-edit-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  saveUser();
                }
              }}
            />
          </>
        )}

        {/* Role */}
        {!editing && (
          <>
            <b>Roles:</b> <span className="wd-roles">{user.role}</span> <br />
          </>
        )}
        {editing && (
          <>
            <b>Roles:</b>
            <FormSelect
              className="w-75 mb-2 wd-edit-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  saveUser();
                }
              }}
            >
              <option value="">Select role</option>
              <option value="STUDENT">Student</option>
              <option value="FACULTY">Faculty</option>
              <option value="ADMIN">Admin</option>
            </FormSelect>
          </>
        )}
      </div>

      {/* Read-only fields */}
      <b>Login ID:</b> <span className="wd-login-id">{user.loginId}</span> <br />
      <b>Section:</b> <span className="wd-section">{user.section}</span> <br />
      <b>Total Activity:</b>{" "}
      <span className="wd-total-activity">{user.totalActivity}</span>

      <hr />
      {/* Buttons */}
      <button
        onClick={() => deleteUser(uid)}
        className="btn btn-danger float-end wd-delete"
      >
        Delete
      </button>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-secondary float-start float-end me-2 wd-cancel"
      >
        Cancel
      </button>
    </div>
  );
}
