import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import Addlogo from "./img/title.png";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./Firebase";

const Login = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentuser"));
    console.log("login error");
    if (user) navigate("/home");

  }, [navigate]);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    if (!loginEmail.length || !loginPassword.length) return;
    setLoading(true);
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      localStorage.setItem("currentuser", JSON.stringify(user));
      navigate("/home");
    } catch (err) {
      setLoading(false);
      setErr(true);
      console.log("Something went wrong");
    }
  };
  return (
    <div className="container">
      {loading ? (
        <loading />
      ) : (
        <form className="login-container"
        onSubmit={(e)=>{
          e.preventDefault();
          login();
        }}
        style = {{width:"100%"}}
        >
          <div className="login-form">
            <img className="app-title" src={Addlogo} alt="" />
            <h1 className="login-title">Log In</h1>
            <input
              type="text"
              className="login-email"
              placeholder="Email"
              onChange={(event) => {
                setLoginEmail(event.target.value);
              }}
            />
            <input
              type="password"
              className="login-password"
              placeholder="Password"
              onChange={(event) => {
                setLoginPassword(event.target.value);
              }}
            />
            <button className="login-btn" onClick={login}>
              Log In
            </button>
            <div className="or-line">
              <hr className="line1" />
              <p className="or">OR</p>
              <hr className="line2" />
            </div>
            {err && <span className="errormsg">Invalid Credentials!</span>}
          </div>
          <div className="signup-ques">
            <p className="signup-ques-text">Don't have an account?</p>
            <span className="signup-option">
              <Link className="register" to="/register">
                Sign up
              </Link>
            </span>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;
