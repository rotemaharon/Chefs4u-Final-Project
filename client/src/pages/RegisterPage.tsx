import { useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { login } from "../store/authSlice";
import { toast } from "react-toastify";
import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "cook",
  });
  const [submitting, setSubmitting] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const errors = { fullName: "", email: "", password: "", phone: "" };
  let isFormValid = true;

  if (formData.fullName.length > 0 && formData.fullName.length < 2) {
    errors.fullName = "שם מלא חייב להכיל לפחות 2 תווים";
  }
  if (!formData.fullName || formData.fullName.length < 2) isFormValid = false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (formData.email.length > 0 && !emailRegex.test(formData.email)) {
    errors.email = "כתובת אימייל אינה תקינה";
  }
  if (!formData.email || !emailRegex.test(formData.email)) isFormValid = false;

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=(.*\d){4,})(?=.*[!@$#%^&*\-_])[A-Za-z\d!@$#%^&*\-_]{8,}$/;
  if (formData.password.length > 0 && !passwordRegex.test(formData.password)) {
    errors.password =
      "הסיסמה חייבת לכלול לפחות 8 תווים, אות גדולה, אות קטנה, 4 מספרים וסימן מיוחד (!@$#%^&*-_)";
  }
  if (!formData.password || !passwordRegex.test(formData.password))
    isFormValid = false;

  if (formData.phone.length > 0 && formData.phone.length < 9) {
    errors.phone = "מספר טלפון אינו תקין";
  }
  if (!formData.phone || formData.phone.length < 9) isFormValid = false;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setSubmitting(true);
    try {
      const res = await api.post(`/auth/register`, formData);
      dispatch(login({ user: res.data.user, token: res.data.token }));
      toast.success("ברוכים הבאים ל-Chefs4u!");
      navigate("/");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(
          err.response?.data?.message || "שגיאה בהרשמה, אנא נסו שנית",
        );
      } else {
        toast.error("שגיאה לא צפויה התרחשה");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container mt-4">
      <Container>
        <Card
          className="auth-card border-0 shadow-lg mx-auto"
          style={{ maxWidth: "600px" }}
        >
          <Card.Body className="p-5 text-right">
            <h2 className="text-center fw-bold mb-2 text-brown fs-1">
              הצטרפו אלינו
            </h2>
            <p className="text-center text-muted mb-5">
              צרו חשבון כדי למצוא את המשרה או הטבח הבא שלכם
            </p>

            <Form onSubmit={handleSubmit}>
              <Row className="g-4">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="fw-bold text-brown ms-2">
                      שם מלא
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      className="form-input-rounded"
                      value={formData.fullName}
                      onChange={handleChange}
                      isInvalid={!!errors.fullName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.fullName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="fw-bold text-brown ms-2">
                      אימייל
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      className="form-input-rounded text-start"
                      dir="ltr"
                      value={formData.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="fw-bold text-brown ms-2">
                      סיסמה
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      className="form-input-rounded text-start"
                      dir="ltr"
                      value={formData.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback
                      type="invalid"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold text-brown ms-2">
                      טלפון
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      className="form-input-rounded text-start"
                      dir="ltr"
                      value={formData.phone}
                      onChange={handleChange}
                      isInvalid={!!errors.phone}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phone}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold text-brown ms-2">
                      אני מחפש/ת
                    </Form.Label>
                    <Form.Select
                      name="role"
                      className="form-input-rounded"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="cook">עבודה כטבח</option>
                      <option value="restaurant">לפרסם משרות למסעדה</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <div className="text-center mt-5">
                <Button
                  type="submit"
                  disabled={!isFormValid || submitting}
                  className="btn-brown px-5 py-3 fs-5 fw-bold shadow-sm rounded-pill w-100"
                >
                  {submitting ? "נרשם..." : "הרשמה"}
                </Button>
              </div>
            </Form>

            <div className="text-center mt-4">
              <span className="text-muted">כבר יש לכם חשבון? </span>
              <Link
                to="/login"
                className="text-brown fw-bold text-decoration-none"
              >
                התחברו כאן
              </Link>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default RegisterPage;
