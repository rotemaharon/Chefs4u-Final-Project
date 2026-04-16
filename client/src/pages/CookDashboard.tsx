import { useEffect, useState, useCallback } from "react";
import {
  Container,
  Card,
  Badge,
  Spinner,
  Row,
  Col,
  Button,
  ListGroup,
} from "react-bootstrap";
import { useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/axios";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaShekelSign,
  FaCommentDots,
  FaUtensils,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaTrashAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";

interface Restaurant {
  _id: string;
  fullName: string;
  phone: string;
}

interface Application {
  _id: string;
  title: string;
  location: string;
  hourlyWage: number;
  shiftDate: string;
  isActive: boolean;
  restaurantId: Restaurant;
  status: "pending" | "accepted" | "rejected";
}

const CookDashboard = () => {
  const { token, user } = useAppSelector((state) => state.auth);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyApplications = useCallback(async () => {
    try {
      const res = await api.get<Application[]>(`/jobs/my-applications`);
      setApplications(res.data);
    } catch {
      toast.error("שגיאה בטעינת המועמדויות");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token && user) {
      fetchMyApplications();
    }
  }, [token, user, fetchMyApplications]);

  const handleCancelApplication = async (jobId: string) => {
    const result = await Swal.fire({
      title: "ביטול מועמדות",
      text: "האם בטוח שברצונך לבטל את המועמדות?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8d623b",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "כן, בטל מועמדות",
      cancelButtonText: "השאר",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/jobs/${jobId}/apply`);
      toast.success("המועמדות בוטלה בהצלחה");
      setApplications((prev) => prev.filter((app) => app._id !== jobId));
    } catch {
      toast.error("שגיאה בביטול המועמדות");
    }
  };

  const stats = {
    total: applications.length,
    accepted: applications.filter((app) => app.status === "accepted").length,
    pending: applications.filter((app) => app.status === "pending").length,
    rejected: applications.filter((app) => app.status === "rejected").length,
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" style={{ color: "#8d623b" }} />
      </div>
    );
  }

  return (
    <Container className="py-5 text-right">
      <h2 className="fw-bold text-brown mb-4 fs-1">האזור האישי</h2>

      <Row className="g-4 mb-5">
        <Col md={3} xs={6}>
          <div
            className="bg-white p-4 rounded-4 shadow-sm text-center border-bottom border-4"
            style={{ borderColor: "#8d623b" }}
          >
            <h3 className="fw-bold text-brown fs-1">{stats.total}</h3>
            <p className="text-muted mb-0 small fw-bold">מועמדויות סה"כ</p>
          </div>
        </Col>
        <Col md={3} xs={6}>
          <div className="bg-white p-4 rounded-4 shadow-sm text-center border-bottom border-4 border-success">
            <h3 className="fw-bold text-success fs-1">{stats.accepted}</h3>
            <p className="text-muted mb-0 small fw-bold">משמרות שאושרו</p>
          </div>
        </Col>
        <Col md={3} xs={6}>
          <div className="bg-white p-4 rounded-4 shadow-sm text-center border-bottom border-4 border-warning">
            <h3 className="fw-bold text-warning fs-1">{stats.pending}</h3>
            <p className="text-muted mb-0 small fw-bold">ממתינות לתשובה</p>
          </div>
        </Col>
        <Col md={3} xs={6}>
          <div className="bg-white p-4 rounded-4 shadow-sm text-center border-bottom border-4 border-danger">
            <h3 className="fw-bold text-danger fs-1">{stats.rejected}</h3>
            <p className="text-muted mb-0 small fw-bold">לא התקבלו</p>
          </div>
        </Col>
      </Row>

      <h4 className="fw-bold text-brown mb-4">המועמדויות שלי</h4>

      {applications.length === 0 ? (
        <Card className="border-0 bg-cream rounded-4 p-5 text-center shadow-sm">
          <Card.Body>
            <FaUtensils
              size={50}
              className="text-light-brown mb-3 opacity-50"
            />
            <h4 className="text-brown fw-bold">
              עדיין לא הגשת מועמדות לאף משרה
            </h4>
            <p className="text-muted mb-4">זה הזמן למצוא את המשמרת הבאה שלך!</p>
            <Button
              onClick={() => navigate("/")}
              className="btn-brown rounded-pill px-5 py-2 fw-bold shadow-sm"
            >
              חפש משרות עכשיו
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {applications.map((app) => (
            <Col lg={6} key={app._id}>
              <Card className="card-custom h-100 shadow-sm border-0">
                <Card.Body className="p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h4 className="fw-bold text-brown mb-1">{app.title}</h4>
                      <div className="text-muted small fw-bold d-flex align-items-center gap-1">
                        <FaUtensils className="text-light-brown" />{" "}
                        {app.restaurantId?.fullName || "מסעדה"}
                      </div>
                    </div>
                    <Badge
                      bg={
                        app.status === "accepted"
                          ? "success"
                          : app.status === "rejected"
                            ? "danger"
                            : "warning"
                      }
                      text={app.status === "pending" ? "dark" : "white"}
                      className="px-3 py-2 rounded-pill d-flex align-items-center gap-2 fs-6 shadow-sm"
                    >
                      {app.status === "accepted" && <FaCheckCircle />}
                      {app.status === "pending" && <FaHourglassHalf />}
                      {app.status === "rejected" && <FaTimesCircle />}
                      {app.status === "accepted"
                        ? "התקבלת!"
                        : app.status === "pending"
                          ? "ממתין לתשובה"
                          : "לא הפעם"}
                    </Badge>
                  </div>

                  <ListGroup
                    variant="flush"
                    className="bg-cream rounded-4 mb-4"
                  >
                    <ListGroup.Item className="bg-transparent border-0 d-flex align-items-center gap-3 py-3">
                      <FaMapMarkerAlt className="text-light-brown fs-5" />
                      <span className="text-dark fw-semibold">
                        {app.location}
                      </span>
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent border-0 d-flex align-items-center gap-3 py-3">
                      <FaCalendarAlt className="text-light-brown fs-5" />
                      <span className="text-dark fw-semibold">
                        {new Date(app.shiftDate).toLocaleDateString("he-IL", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </ListGroup.Item>
                    <ListGroup.Item className="bg-transparent border-0 d-flex align-items-center gap-3 py-3">
                      <FaShekelSign className="text-light-brown fs-5" />
                      <span className="text-dark fw-semibold">
                        {app.hourlyWage} לשעה
                      </span>
                    </ListGroup.Item>
                  </ListGroup>

                  <div className="mt-auto d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      className="rounded-pill py-2 fw-bold d-flex justify-content-center align-items-center gap-2 custom-chat-btn w-100"
                      onClick={() =>
                        navigate(
                          `/messages?userId=${app.restaurantId?._id}&userName=${app.restaurantId?.fullName}`,
                        )
                      }
                    >
                      <FaCommentDots /> שלח הודעה
                    </Button>
                    {app.status === "pending" && (
                      <Button
                        variant="outline-danger"
                        className="rounded-pill py-2 fw-bold d-flex justify-content-center align-items-center gap-2 w-100"
                        onClick={() => handleCancelApplication(app._id)}
                      >
                        <FaTrashAlt /> ביטול מועמדות
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default CookDashboard;
