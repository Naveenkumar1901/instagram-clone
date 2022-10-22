import React, { useEffect, useState } from "react";
import "./register.css";
import Addlogo from "./img/title.png";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const Register = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentuser"));
    console.log("register error");
    if (user) navigate("/home");
  }, [navigate]);
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const signup = async (e) => {
    e.preventDefault();
    if (!signupEmail.length || !signupPassword.length) return;
    setLoading(true);
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        signupEmail,
        signupPassword
      );
      localStorage.setItem("currentuser", JSON.stringify(user));
      navigate("/home");
    } catch (err) {
      setLoading(false);
      setErr(true);
      console.log("Something wrong");
    }
  };

  return (
    <div className="container">
      {loading ? (
        <loading />
      ) : (
        <form
          className="signup-container"
          onSubmit={(e) => {
            e.preventDefault();
            signup();
          }}
          style={{ width: "100%" }}
        >
          <div className="signup-form">
            <img className="app-title" src={Addlogo} alt="" />
            <h1 className="signup-title">Sign Up</h1>
            <input
              type="text"
              className="signup-email"
              placeholder="Email"
              onChange={(event) => {
                setSignupEmail(event.target.value);
              }}
            />
            <input
              type="password"
              className="signup-password"
              placeholder="Password"
              onChange={(event) => {
                setSignupPassword(event.target.value);
              }}
            />
            <button className="signup-btn" onClick={signup}>
              Sign Up
            </button>
            <div className="or-line">
              <hr className="line1" />
              <p className="or">OR</p>
              <hr className="line2" />
            </div>
            {err && (
              <span className="errormsg">Email/Password invalid format!</span>
            )}
          </div>
          <div className="login-ques">
            <p className="login-ques-text">Have an account?</p>
            <span className="login-option">
              <Link className="login" to="/login">
                Log In
              </Link>
            </span>
          </div>
        </form>
      )}
    </div>
  );
};

export default Register;
