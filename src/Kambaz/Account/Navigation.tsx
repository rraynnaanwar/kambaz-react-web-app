import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AccountNavigation() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  return (
    <div id="wd-account-navigation" className="wd list-group fs-5 rounded-0">
      {!currentUser && (
        <>
          <NavLink
            to="/Kambaz/Account/Signin"
            id="wd-account-signin-link"
            className={({ isActive }) =>
              `list-group-item border border-0 ${
                isActive ? "active text-danger fw-bold" : "text-danger"
              }`
            }
          >
            Signin
          </NavLink>

          <NavLink
            to="/Kambaz/Account/Signup"
            id="wd-account-signup-link"
            className={({ isActive }) =>
              `list-group-item border border-0 ${
                isActive ? "active text-danger fw-bold" : "text-danger"
              }`
            }
          >
            Signup
          </NavLink>
        </>
      )}

      {currentUser && (
        <NavLink
          to="/Kambaz/Account/Profile"
          id="wd-account-profile-link"
          className={({ isActive }) =>
            `list-group-item border border-0 ${
              isActive ? "active text-danger fw-bold" : "text-danger"
            }`
          }
        >
          Profile
        </NavLink>
      )}
    </div>
  );
}