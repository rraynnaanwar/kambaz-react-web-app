import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as client from "./client";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import { FormControl } from "react-bootstrap";

export default function Signup() {
  const [user, setUser] = useState<any>({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signup = async () => {
    if (!user.username || !user.password) {
      setError("Username and password are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const currentUser = await client.signup({
        username: user.username,
        password: user.password,
      });

      dispatch(setCurrentUser(currentUser));
      navigate("/Kambaz/Account/Profile");
    } catch (err: any) {
      console.error("Signup error:", err);
      console.error("Error response:", err.response);
      setError(err.response?.data?.message || err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wd-signup-screen">
      <h1>Sign up</h1>

      {error && (
        <div className="alert alert-danger mb-2" role="alert">
          {error}
        </div>
      )}

      <FormControl
        defaultValue=""
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        className="wd-username mb-2"
        placeholder="username"
      />

      <FormControl
        defaultValue=""
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        className="wd-password mb-2"
        placeholder="password"
        type="password"
      />

      <button
        onClick={signup}
        disabled={loading}
        className="wd-signup-btn btn btn-primary mb-2 w-100"
      >
        {loading ? "Signing up..." : "Sign up"}
      </button>
      <br />

      <Link to="/Kambaz/Account/Signin" className="wd-signin-link">
        Sign in
      </Link>
    </div>
  );
}
