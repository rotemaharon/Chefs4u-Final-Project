import { useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { login } from "../store/authSlice";
import axios from "axios";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitting, setSubmitting] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const emailError =
    touched.email && email.length > 0 && !emailRegex.test(email)
      ? "כתובת אימייל אינה תקינה"
      : "";

  const passwordError =
    touched.password && password.length > 0 && password.length < 8
      ? "הסיסמה חייבת לכלול לפחות 8 תווים"
      : "";

  const isFormValid =
    email.length > 0 && emailRegex.test(email) && password.length >= 8;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!isFormValid) return;

    setSubmitting(true);
    try {
      const res = await api.post(`/auth/login`, { email, password });
      dispatch(login({ token: res.data.token, user: res.data.user }));
      toast.success("התחברת בהצלחה!");
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "שגיאה בהתחברות");
      } else {
        toast.error("שגיאה לא צפויה בהתחברות");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page-section py-5" dir="rtl">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={5}>
            <div className="bg-white p-5 shadow-lg border-0 rounded-4">
              <div className="text-center mb-5">
                <h2 className="fw-bold text-brown display-6 mb-2">
                  ברוכים השבים
                </h2>
                <p className="text-muted small">
                  התחברו כדי למצוא את המשמרת הבאה שלכם.
                </p>
              </div>

              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-4 form-input-group">
                  <FaEnvelope className="input-icon" />
                  <Form.Control
                    type="email"
                    placeholder="אימייל"
                    className="form-input-rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched({ ...touched, email: true })}
                    isInvalid={!!emailError}
                    isValid={touched.email && email.length > 0 && !emailError}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {emailError}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-1 form-input-group">
                  <FaLock className="input-icon" />
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="סיסמה"
                    className="form-input-rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setTouched({ ...touched, password: true })}
                    isInvalid={!!passwordError}
                    isValid={touched.password && password.length >= 8}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <Form.Control.Feedback type="invalid">
                    {passwordError}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="text-start mb-4">
                  <Link
                    to="/forgot-password"
                    className="text-brown small text-decoration-none fw-bold"
                  >
                    שכחת סיסמה?
                  </Link>
                </div>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={!isFormValid || submitting}
                  className="btn-brown w-100 py-3 rounded-pill fw-bold fs-5 mt-2"
                >
                  {submitting ? "מתחבר..." : "התחברות למערכת"}
                </Button>

                <div className="text-center mt-4 pt-3 border-top">
                  <p className="text-muted small">
                    עדיין לא רשומים?{" "}
                    <Link
                      to="/register"
                      className="text-brown fw-bold text-decoration-none"
                    >
                      צרו חשבון עכשיו
                    </Link>
                  </p>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
