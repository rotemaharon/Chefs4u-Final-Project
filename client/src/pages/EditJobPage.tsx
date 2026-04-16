import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api/axios";
import { Container, Form, Button, Card, Spinner, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";

const getMinDateTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

const toDateTimeLocal = (isoDate: string): string => {
  const d = new Date(isoDate);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

const EditJobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    hourlyWage: 0,
    shiftDate: "",
    requiredWorkers: 1,
  });

  const [touched, setTouched] = useState({
    title: false,
    description: false,
    location: false,
    hourlyWage: false,
    shiftDate: false,
    requiredWorkers: false,
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        const job = res.data;
        setFormData({
          title: job.title,
          description: job.description,
          location: job.location,
          hourlyWage: job.hourlyWage,
          shiftDate: toDateTimeLocal(job.shiftDate),
          requiredWorkers: job.requiredWorkers || 1,
        });
      } catch {
        toast.error("שגיאה בטעינת נתוני המשרה");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

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
      touched.hourlyWage && formData.hourlyWage < 1
        ? "שכר שעתי חייב להיות לפחות 1"
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
      touched.requiredWorkers && formData.requiredWorkers < 1
        ? "מספר עובדים חייב להיות לפחות 1"
        : "",
  };

  const isFormValid =
    formData.title.length >= 2 &&
    formData.description.length >= 10 &&
    formData.location.length >= 2 &&
    formData.hourlyWage >= 1 &&
    formData.shiftDate !== "" &&
    isDateInFuture(formData.shiftDate) &&
    formData.requiredWorkers >= 1;

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      await api.put(`/jobs/${id}`, formData);
      toast.success("המשרה עודכנה בהצלחה");
      navigate("/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "שגיאה בעדכון המשרה");
      } else {
        toast.error("שגיאה בעדכון המשרה");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" style={{ color: "#8d623b" }} />
      </div>
    );

  return (
    <Container className="py-5">
      <Card
        className="auth-card border-0 shadow-lg mx-auto"
        style={{ maxWidth: "800px" }}
      >
        <Card.Body className="p-5 text-right">
          <h2 className="text-center fw-bold text-brown mb-4">עריכת משרה</h2>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-bold text-brown ms-2">
                    כותרת המשרה
                  </Form.Label>
                  <Form.Control
                    type="text"
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
                    תיאור
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    className="form-input-rounded"
                    style={{ borderRadius: "25px" }}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
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
                    מיקום
                  </Form.Label>
                  <Form.Control
                    type="text"
                    className="form-input-rounded"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    onBlur={() => handleBlur("location")}
                    isInvalid={!!errors.location}
                    isValid={touched.location && formData.location.length >= 2}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.location}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold text-brown ms-2">
                    שכר שעתי
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    className="form-input-rounded"
                    value={formData.hourlyWage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hourlyWage: Number(e.target.value),
                      })
                    }
                    onBlur={() => handleBlur("hourlyWage")}
                    isInvalid={!!errors.hourlyWage}
                    isValid={touched.hourlyWage && formData.hourlyWage >= 1}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.hourlyWage}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold text-brown ms-2">
                    תאריך ושעת המשמרת
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
                        requiredWorkers: Number(e.target.value),
                      })
                    }
                    onBlur={() => handleBlur("requiredWorkers")}
                    isInvalid={!!errors.requiredWorkers}
                    isValid={
                      touched.requiredWorkers && formData.requiredWorkers >= 1
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.requiredWorkers}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <div className="mt-4">
              <Button
                type="submit"
                disabled={!isFormValid || submitting}
                className="btn-brown w-100 rounded-pill py-2 fw-bold"
              >
                {submitting ? "שומר..." : "שמור שינויים"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditJobPage;
