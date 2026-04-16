import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import axios from "axios";
import api from "../api/axios";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaInfoCircle,
} from "react-icons/fa";

const ResetPasswordPage = () => {
  const { token: resetToken } = useParams();
  const navigate = useNavigate();
  const { token: userToken } = useAppSelector((state) => state.auth);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userToken) navigate("/");
  }, [userToken, navigate]);

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=(.*\d){4,})(?=.*[!@$#%^&*\-_])[A-Za-z\d!@$#%^&*\-_]{8,}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordRegex.test(password)) {
      toast.error("הסיסמה אינה עומדת בדרישות האבטחה המפורטות.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("הסיסמאות אינן תואמות");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(`/auth/reset-password/${resetToken}`, {
        password,
      });
      toast.success(res.data.message || "הסיסמה שונתה בהצלחה!");
      navigate("/login");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "שגיאה בעדכון הסיסמה");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-section py-5" dir="rtl">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="p-4 p-md-5 shadow-lg border-0 rounded-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-brown h3 mb-3">בחירת סיסמה חדשה</h2>
                <p className="text-muted small">אנא הזינו סיסמה חדשה</p>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3 position-relative">
                  <Form.Label className="small fw-bold text-brown">
                    סיסמה חדשה
                  </Form.Label>
                  <div className="form-input-group">
                    <FaLock className="input-icon" />
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="הזינו סיסמה חדשה"
                      className="form-input-rounded"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-icon"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  <div className="mt-2 p-3 bg-light rounded-3 small text-muted border-start border-brown border-4">
                    <div className="fw-bold mb-1 text-brown">
                      <FaInfoCircle className="me-1" /> דרישות סיסמה:
                    </div>
                    <ul className="mb-0 ps-3">
                      <li>לפחות 8 תווים</li>
                      <li>אות גדולה (A-Z) ואות קטנה (a-z)</li>
                      <li>
                        לפחות <strong>4 ספרות</strong>
                      </li>
                      <li>תו מיוחד אחד לפחות (!@$#%^&*-_)</li>
                    </ul>
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="small fw-bold text-brown">
                    אימות סיסמה
                  </Form.Label>
                  <div className="form-input-group">
                    <FaLock className="input-icon" />
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="הקלידו שוב את הסיסמה"
                      className="form-input-rounded"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading || !password || !confirmPassword}
                  className="btn-brown w-100 py-3 rounded-pill fw-bold fs-5 shadow-sm"
                >
                  {loading ? "מעדכן סיסמה..." : "עדכון סיסמה וכניסה"}
                </Button>

                <div className="text-center mt-4">
                  <Link
                    to="/login"
                    className="text-brown text-decoration-none small fw-bold"
                  >
                    <FaArrowRight className="ms-2" /> חזרה למסך ההתחברות
                  </Link>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ResetPasswordPage;
