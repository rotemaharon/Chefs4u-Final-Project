import { useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import api from "../api/axios";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const getMinDateTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

const CreateJobPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    hourlyWage: "",
    shiftDate: "",
    requiredWorkers: "1",
  });

  const [touched, setTouched] = useState({
    title: false,
    description: false,
    location: false,
    hourlyWage: false,
    shiftDate: false,
    requiredWorkers: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const isDateInFuture = (dateStr: string): boolean => {
    if (!dateStr) return false;
    return new Date(dateStr).getTime() > Date.now();
  };

  const errors = {
    title:
      touched.title && formData.title.length > 0 && formData.title.length < 2
        ? "כותרת חייבת להכיל לפחות 2 תווים"
        : touched.title && formData.title.length === 0
          ? "שדה חובה"
          : "",
    description:
      touched.description &&
      formData.description.length > 0 &&
      formData.description.length < 10
        ? "תיאור חייב להכיל לפחות 10 תווים"
        : touched.description && formData.description.length === 0
          ? "שדה חובה"
          : "",
    location:
      touched.location &&
      formData.location.length > 0 &&
      formData.location.length < 2
        ? "מיקום חייב להכיל לפחות 2 תווים"
        : touched.location && formData.location.length === 0
          ? "שדה חובה"
          : "",
    hourlyWage:
      touched.hourlyWage &&
      formData.hourlyWage !== "" &&
      Number(formData.hourlyWage) < 1
        ? "שכר שעתי חייב להיות לפחות 1"
        : touched.hourlyWage && formData.hourlyWage === ""
          ? "שדה חובה"
          : "",
    shiftDate:
      touched.shiftDate && formData.shiftDate === ""
        ? "שדה חובה"
        : touched.shiftDate &&
            formData.shiftDate !== "" &&
            !isDateInFuture(formData.shiftDate)
          ? "תאריך המשמרת חייב להיות בעתיד"
          : "",
    requiredWorkers:
      touched.requiredWorkers &&
      (formData.requiredWorkers === "" || Number(formData.requiredWorkers) < 1)
        ? "מספר עובדים חייב להיות לפחות 1"
        : "",
  };

  const isFormValid =
    formData.title.length >= 2 &&
    formData.description.length >= 10 &&
    formData.location.length >= 2 &&
    formData.hourlyWage !== "" &&
    Number(formData.hourlyWage) >= 1 &&
    formData.shiftDate !== "" &&
    isDateInFuture(formData.shiftDate) &&
    formData.requiredWorkers !== "" &&
    Number(formData.requiredWorkers) >= 1;

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({
      title: true,
      description: true,
      location: true,
      hourlyWage: true,
      shiftDate: true,
      requiredWorkers: true,
    });
    if (!isFormValid) return;

    setSubmitting(true);
    try {
      await api.post(`/jobs`, {
        ...formData,
        hourlyWage: Number(formData.hourlyWage),
        requiredWorkers: Number(formData.requiredWorkers),
      });
      toast.success("המשרה פורסמה בהצלחה!");
      navigate("/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "שגיאה בפרסום המשרה");
      } else {
        toast.error("שגיאה בפרסום המשרה");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <Container>
        <Card
          className="auth-card border-0 shadow-lg mx-auto"
          style={{ maxWidth: "800px" }}
        >
          <Card.Body className="p-5">
            <h2 className="text-center fw-bold mb-2 text-brown fs-1">
              פרסום משרה חדשה
            </h2>
            <p className="text-center text-muted mb-5">
              מלאו את פרטי המשמרת כדי למצוא את הטבח המתאים
            </p>

            <Form onSubmit={handleSubmit}>
              <Row className="g-4">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="fw-bold text-brown ms-2">
                      כותרת המשרה
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="לדוגמה: טבח פס חם למשמרת ערב"
                      className="form-input-rounded"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      onBlur={() => handleBlur("title")}
                      isInvalid={!!errors.title}
                      isValid={touched.title && formData.title.length >= 2}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.title}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="fw-bold text-brown ms-2">
                      תיאור התפקיד
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="ספרו קצת על המשרה, הדרישות והאווירה במסעדה..."
                      className="form-input-rounded"
                      style={{ borderRadius: "25px" }}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      onBlur={() => handleBlur("description")}
                      isInvalid={!!errors.description}
                      isValid={
                        touched.description && formData.description.length >= 10
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.description}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold text-brown ms-2">
                      מיקום (עיר/אזור)
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="לדוגמה: תל אביב, שרונה"
                      className="form-input-rounded"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      onBlur={() => handleBlur("location")}
                      isInvalid={!!errors.location}
                      isValid={
                        touched.location && formData.location.length >= 2
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.location}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold text-brown ms-2">
                      שכר שעתי (₪)
                    </Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="לדוגמה: 65"
                      className="form-input-rounded"
                      value={formData.hourlyWage}
                      onChange={(e) =>
                        setFormData({ ...formData, hourlyWage: e.target.value })
                      }
                      onBlur={() => handleBlur("hourlyWage")}
                      isInvalid={!!errors.hourlyWage}
                      isValid={
                        touched.hourlyWage &&
                        formData.hourlyWage !== "" &&
                        Number(formData.hourlyWage) >= 1
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.hourlyWage}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold text-brown ms-2">
                      תאריך ושעה
                    </Form.Label>
                    <Form.Control
                      type="datetime-local"
                      min={getMinDateTime()}
                      className="form-input-rounded"
                      value={formData.shiftDate}
                      onChange={(e) =>
                        setFormData({ ...formData, shiftDate: e.target.value })
                      }
                      onBlur={() => handleBlur("shiftDate")}
                      isInvalid={!!errors.shiftDate}
                      isValid={
                        touched.shiftDate &&
                        formData.shiftDate !== "" &&
                        isDateInFuture(formData.shiftDate)
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.shiftDate}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold text-brown ms-2">
                      מספר עובדים דרושים
                    </Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      className="form-input-rounded"
                      value={formData.requiredWorkers}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requiredWorkers: e.target.value,
                        })
                      }
                      onBlur={() => handleBlur("requiredWorkers")}
                      isInvalid={!!errors.requiredWorkers}
                      isValid={
                        touched.requiredWorkers &&
                        formData.requiredWorkers !== "" &&
                        Number(formData.requiredWorkers) >= 1
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.requiredWorkers}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <div className="text-center mt-5">
                <Button
                  type="submit"
                  disabled={!isFormValid || submitting}
                  className="btn-brown px-5 py-3 fs-5 fw-bold shadow-sm rounded-pill w-100"
                >
                  {submitting ? "מפרסם..." : "פרסום המשרה עכשיו"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default CreateJobPage;
