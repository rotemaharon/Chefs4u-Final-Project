import { useState } from "react";
import axios from "axios";
import api from "../api/axios";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { FaEnvelope, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post(`/auth/forgot-password`, { email });
      toast.success(res.data.message);
      setEmail("");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "שגיאה בשליחת הבקשה");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-section py-5" dir="rtl">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={5}>
            <Card className="p-5 shadow-lg border-0 rounded-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-brown h3 mb-3">איפוס סיסמה</h2>
                <p className="text-muted small">
                  הזינו את כתובת האימייל שלכם ונשלח לכם לינק לאיפוס הסיסמה.
                </p>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4 form-input-group position-relative">
                  <FaEnvelope className="input-icon" />
                  <Form.Control
                    type="email"
                    placeholder="אימייל"
                    className="form-input-rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading || !email}
                  className="btn-brown w-100 py-3 rounded-pill fw-bold fs-5 mb-3"
                >
                  {loading ? "שולח..." : "שלח לינק לאיפוס"}
                </Button>

                <div className="text-center mt-3">
                  <Link
                    to="/login"
                    className="text-brown text-decoration-none small fw-bold"
                  >
                    <FaArrowRight className="ms-2" /> חזרה להתחברות
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

export default ForgotPasswordPage;
