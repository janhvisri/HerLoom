import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, clearError, verifyOtpSuccess, cancelRegistration } from "../redux/slices/authSlice";
import { AlertCircle, User, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Registration Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");

  // OTP Validation Fields
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState(null);

  const { userInfo, registeredUser, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
    return () => {
      dispatch(clearError());
    };
  }, [userInfo, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) return;

    if (password !== confirmPassword) {
      dispatch({ type: "auth/register/rejected", payload: "Passwords do not match." }); // custom dispatch
      return;
    }

    dispatch(register({ name, email, password, role }));
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setOtpError(null);

    if (otpInput === registeredUser.otp) {
      // OTP is valid! Promotes client state to verified logged in status
      dispatch(verifyOtpSuccess(registeredUser));
      navigate("/");
    } else {
      setOtpError("Incorrect verification code. Please check the OTP code displayed in the mock notification box.");
    }
  };

  const handleCancelOtp = () => {
    dispatch(cancelRegistration());
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Sign up to shop the premium collection</p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name-input">Full Name</label>
            <div style={{ position: "relative" }}>
              <input
                id="name-input"
                type="text"
                placeholder="Janhvi Srivastava"
                className="form-input"
                style={{ paddingLeft: "40px" }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <User size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            </div>
          </div>

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
            <label className="form-label" htmlFor="role-select">Account Type</label>
            <select
              id="role-select"
              className="form-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">Customer</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password-input">Password</label>
            <div style={{ position: "relative" }}>
              <input
                id="password-input"
                type="password"
                placeholder="Minimum 6 characters"
                className="form-input"
                style={{ paddingLeft: "40px" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirm-password-input">Confirm Password</label>
            <div style={{ position: "relative" }}>
              <input
                id="confirm-password-input"
                type="password"
                placeholder="Repeat password"
                className="form-input"
                style={{ paddingLeft: "40px" }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Lock size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "10px", padding: "12px" }} disabled={loading}>
            {loading ? "Registering..." : "Sign Up"} <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>

      {/* Verification OTP Modal Overlay */}
      {registeredUser && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <ShieldCheck size={48} color="var(--primary-hover)" style={{ margin: "0 auto 10px" }} />
              <h2 style={{ fontSize: "22px", fontWeight: "800", color: "var(--text-main)" }}>Enter Verification Code</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "5px" }}>
                We've sent a 5-digit verification code to your email. Please check your inbox and enter it below.
              </p>
            </div>

            {otpError && (
              <div className="alert alert-danger" style={{ padding: "8px 12px", fontSize: "12px" }}>
                {otpError}
              </div>
            )}

            <form onSubmit={handleVerifyOtp}>
              <div className="form-group" style={{ marginBottom: "25px" }}>
                <input
                  type="text"
                  placeholder="Enter 5-Digit OTP"
                  className="form-input"
                  style={{ textAlign: "center", fontSize: "20px", letterSpacing: "5px", fontWeight: "700" }}
                  maxLength="5"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1, padding: "10px" }} onClick={handleCancelOtp}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: "10px" }}>
                  Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Register;
