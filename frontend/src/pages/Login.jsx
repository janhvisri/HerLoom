import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../redux/slices/authSlice";
import { AlertCircle, Lock, Mail, ArrowRight } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { userInfo, loading, error } = useSelector((state) => state.auth);

  // If redirect exists, direct there, otherwise home
  const redirect = searchParams.get("redirect") || "";

  useEffect(() => {
    if (userInfo) {
      navigate("/" + redirect);
    }
    return () => {
      dispatch(clearError());
    };
  }, [userInfo, navigate, redirect, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(login({ email, password }));
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Login to your HerLoom account</p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email-input">Email Address</label>
            <div style={{ position: "relative" }}>
              <input
                id="email-input"
                type="email"
                placeholder="you@example.com"
                className="form-input"
                style={{ paddingLeft: "40px" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password-input">Password</label>
            <div style={{ position: "relative" }}>
              <input
                id="password-input"
                type="password"
                placeholder="Enter password"
                className="form-input"
                style={{ paddingLeft: "40px" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "10px", padding: "12px" }} disabled={loading}>
            {loading ? "Authenticating..." : "Login"} <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Sign Up Free</Link>
        </div>

        <div style={{ marginTop: "20px", background: "var(--primary-light)", padding: "12px", borderRadius: "var(--radius-sm)", fontSize: "13px", border: "1px solid var(--secondary)", textAlign: "center" }}>
          <p style={{ fontWeight: "700", color: "var(--primary-hover)" }}>Test Credentials:</p>
          <p style={{ margin: "4px 0", color: "var(--text-main)" }}>Customer: <b>janhvi@gmail.com</b> / <b>12345678</b></p>
          <p style={{ color: "var(--text-main)" }}>Admin: <b>admin@gmail.com</b> / <b>12345678</b></p>
        </div>
      </div>
    </main>
  );
};

export default Login;
