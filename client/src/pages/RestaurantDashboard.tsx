import { useEffect, useState } from "react";
import {
  Container,
  Card,
  Badge,
  Spinner,
  ListGroup,
  Row,
  Col,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api, { getImageUrl } from "../api/axios";
import {
  FaUserCircle,
  FaPhone,
  FaEnvelope,
  FaBriefcase,
  FaCalendarAlt,
  FaCheck,
  FaTimes,
  FaCommentDots,
  FaUndo,
} from "react-icons/fa";
import { toast } from "react-toastify";

interface Cook {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  experienceYears?: number;
  specialty?: string;
  bio?: string;
  profileImage?: string;
}

interface Applicant {
  cookId: Cook | null;
  status: "pending" | "accepted" | "rejected";
}

interface JobWithApplicants {
  _id: string;
  title: string;
  shiftDate: string;
  isActive: boolean;
  applicants: Applicant[];
}

const RestaurantDashboard = () => {
  const [jobs, setJobs] = useState<JobWithApplicants[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCook, setSelectedCook] = useState<Cook | null>(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get(`/jobs/restaurant`);
        setJobs(res.data);
      } catch {
        toast.error("שגיאה בטעינת נתוני האזור האישי");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleStatusChange = async (
    jobId: string,
    cookId: string,
    newStatus: "pending" | "accepted" | "rejected",
  ) => {
    try {
      await api.put(`/jobs/${jobId}/applicants/${cookId}/status`, {
        status: newStatus,
      });
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId
            ? {
                ...job,
                applicants: job.applicants.map((app) =>
                  app.cookId?._id === cookId
                    ? { ...app, status: newStatus }
                    : app,
                ),
              }
            : job,
        ),
      );
      if (newStatus === "pending") {
        toast.info("ההחלטה בוטלה, המועמד חזר להמתנה");
      } else {
        toast.success(`הסטטוס עודכן בהצלחה`);
      }
    } catch {
      toast.error("שגיאה בעדכון הסטטוס");
    }
  };

  const handleToggleJobStatus = async (jobId: string) => {
    try {
      const res = await api.patch(`/jobs/${jobId}/toggle-status`, {});
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId ? { ...job, isActive: res.data.isActive } : job,
        ),
      );
      toast.success(res.data.message);
    } catch {
      toast.error("שגיאה בשינוי סטטוס המשרה");
    }
  };

  return (
    <Container className="mt-5 pb-5 dashboard-container text-right">
      <h2 className="mb-4 fw-bold text-brown border-bottom pb-3">
        ניהול משרות ומועמדים
      </h2>
      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" className="text-brown" />
        </div>
      ) : jobs.length === 0 ? (
        <Card className="border-0 bg-cream rounded-4 p-5 text-center shadow-sm">
          <Card.Body>
            <h4 className="text-brown fw-bold">אין עדיין משרות לניהול</h4>
            <p className="text-muted mb-4">
              לחץ על "פרסום משרה" בתפריט כדי להוסיף משרה חדשה
            </p>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {jobs.map((job) => (
            <Col key={job._id} xs={12} className="mb-5">
              <Card
                className={`border-0 rounded-4 shadow-sm ${!job.isActive ? "opacity-75" : ""}`}
              >
                <Card.Header className="bg-white d-flex flex-column flex-md-row justify-content-between align-items-md-center py-4 px-4 border-0 rounded-top-4 gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <h4 className="mb-0 fw-bold text-brown">{job.title}</h4>
                    <Badge
                      className={`px-3 py-2 rounded-pill ${job.isActive ? "badge-active" : "badge-inactive"}`}
                    >
                      {job.isActive ? "פעילה" : "סגורה"}
                    </Badge>
                  </div>
                  <div className="d-flex align-items-center gap-4">
                    <Form.Check
                      type="switch"
                      id={`switch-${job._id}`}
                      label={job.isActive ? "סגירת משרה" : "פתיחת משרה"}
                      checked={job.isActive}
                      onChange={() => handleToggleJobStatus(job._id)}
                      className="custom-switch fw-bold text-brown mb-0"
                    />
                    <Badge className="px-3 py-2 rounded-pill badge-date">
                      <FaCalendarAlt className="me-2" />{" "}
                      {new Date(job.shiftDate).toLocaleDateString("he-IL")}
                    </Badge>
                  </div>
                </Card.Header>
                <Card.Body className="px-4 pb-4">
                  <h6 className="candidates-title fs-5 mb-4">
                    מועמדים ({job.applicants.length}):
                  </h6>
                  {job.applicants.length === 0 ? (
                    <p className="text-muted">אין עדיין מועמדים למשרה זו</p>
                  ) : (
                    <ListGroup variant="flush" className="gap-3">
                      {job.applicants.map(
                        (app, idx) =>
                          app.cookId && (
                            <ListGroup.Item
                              key={idx}
                              className="px-4 py-4 border-0 bg-cream rounded-4 d-flex justify-content-between align-items-center flex-wrap shadow-sm"
                            >
                              <div
                                className="d-flex align-items-center gap-3"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  setSelectedCook(app.cookId);
                                  setShowModal(true);
                                }}
                              >
                                {app.cookId.profileImage ? (
                                  <img
                                    src={getImageUrl(app.cookId.profileImage)}
                                    alt={app.cookId.fullName}
                                    className="rounded-circle object-fit-cover shadow-sm"
                                    style={{ width: "50px", height: "50px" }}
                                  />
                                ) : (
                                  <FaUserCircle
                                    size={50}
                                    className="text-light-brown"
                                  />
                                )}
                                <span className="fw-bold text-brown fs-5">
                                  {app.cookId.fullName}
                                </span>
                              </div>
                              <div className="d-flex gap-2 align-items-center mt-3 mt-md-0">
                                <Button
                                  className="btn-mocha rounded-pill"
                                  onClick={() =>
                                    navigate(
                                      `/messages?userId=${app.cookId?._id}&userName=${app.cookId?.fullName}`,
                                    )
                                  }
                                >
                                  <FaCommentDots className="me-1" /> הודעה
                                </Button>
                                {app.status === "pending" ? (
                                  <>
                                    <Button
                                      variant="outline-success"
                                      className="rounded-pill"
                                      onClick={() =>
                                        handleStatusChange(
                                          job._id,
                                          app.cookId!._id,
                                          "accepted",
                                        )
                                      }
                                    >
                                      <FaCheck />
                                    </Button>
                                    <Button
                                      variant="outline-danger"
                                      className="rounded-pill"
                                      onClick={() =>
                                        handleStatusChange(
                                          job._id,
                                          app.cookId!._id,
                                          "rejected",
                                        )
                                      }
                                    >
                                      <FaTimes />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Badge
                                      className={`rounded-pill px-3 py-2 ${app.status === "accepted" ? "badge-accepted" : "badge-rejected"}`}
                                    >
                                      {app.status === "accepted"
                                        ? "אושר"
                                        : "נדחה"}
                                    </Badge>
                                    <Button
                                      variant="outline-secondary"
                                      size="sm"
                                      className="rounded-pill ms-2 d-flex align-items-center gap-1"
                                      onClick={() =>
                                        handleStatusChange(
                                          job._id,
                                          app.cookId!._id,
                                          "pending",
                                        )
                                      }
                                    >
                                      <FaUndo size={12} />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </ListGroup.Item>
                          ),
                      )}
                    </ListGroup>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton className="border-0 bg-cream">
          <Modal.Title className="text-brown fw-bold">פרופיל מועמד</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-right">
          {selectedCook && (
            <>
              <div className="d-flex align-items-center gap-4 mb-4 border-bottom pb-4">
                {selectedCook.profileImage ? (
                  <img
                    src={getImageUrl(selectedCook.profileImage)}
                    alt={selectedCook.fullName}
                    className="rounded-circle object-fit-cover shadow-sm border border-2"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderColor: "#8d623b",
                    }}
                  />
                ) : (
                  <FaUserCircle size={100} className="text-light-brown" />
                )}
                <h3 className="fw-bold text-brown mb-0">
                  {selectedCook.fullName}
                </h3>
              </div>
              <Row className="mb-4">
                <Col md={6}>
                  <p className="text-muted small fw-bold">התקשרות</p>
                  <div className="mb-2 text-brown">
                    <FaPhone className="me-2" /> {selectedCook.phone}
                  </div>
                  <div className="text-brown">
                    <FaEnvelope className="me-2" /> {selectedCook.email}
                  </div>
                </Col>
                <Col md={6}>
                  <p className="text-muted small fw-bold">ניסיון</p>
                  <div className="mb-2 text-brown">
                    <FaBriefcase className="me-2" />{" "}
                    {selectedCook.experienceYears || 0} שנים
                  </div>
                  <div className="text-brown">
                    <strong>התמחות:</strong> {selectedCook.specialty || "כללי"}
                  </div>
                </Col>
              </Row>
              <div className="bg-cream p-4 rounded-4">
                <p className="fw-bold text-brown mb-2">על עצמי:</p>
                <p className="text-brown">{selectedCook.bio || "אין תיאור"}</p>
              </div>
              <Button
                className="btn-brown-action w-100 mt-4 rounded-pill py-3 fw-bold border-0"
                style={{ backgroundColor: "#8d623b", color: "#fff" }}
                onClick={() =>
                  navigate(
                    `/messages?userId=${selectedCook._id}&userName=${selectedCook.fullName}`,
                  )
                }
              >
                שלח הודעה לטבח
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default RestaurantDashboard;
