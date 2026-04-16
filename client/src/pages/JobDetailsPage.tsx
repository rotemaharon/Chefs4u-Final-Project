import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import api, { getImageUrl } from "../api/axios";
import { Container, Card, Button, Spinner, Badge } from "react-bootstrap";
import { useAppSelector } from "../store/hooks";
import {
  FaMapMarkerAlt,
  FaShekelSign,
  FaUtensils,
  FaArrowRight,
} from "react-icons/fa";
import { toast } from "react-toastify";

interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  hourlyWage: number;
  shiftDate: string;
  isActive: boolean;
  restaurantId: {
    _id: string;
    fullName: string;
    profileImage?: string;
  };
}

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
      } catch {
        toast.error("שגיאה בטעינת פרטי המשרה");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.info("יש להתחבר כדי להגיש מועמדות");
      navigate("/login");
      return;
    }
    if (user?.role !== "cook") {
      toast.error("רק טבחים יכולים להגיש מועמדות");
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/jobs/${job?._id}/apply`, {});
      toast.success("מועמדותך הוגשה בהצלחה!");
      navigate("/cook-dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "שגיאה בהגשת המועמדות");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" style={{ color: "#8d623b" }} />
      </div>
    );
  }

  if (!job) return null;

  return (
    <Container className="py-5 mt-4" style={{ maxWidth: "800px" }}>
      <Button
        variant="link"
        className="text-brown mb-4 text-decoration-none d-flex align-items-center gap-2 p-0"
        onClick={() => navigate(-1)}
      >
        <FaArrowRight /> חזרה למשרות
      </Button>

      <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
        <div style={{ height: "250px", backgroundColor: "#fdfbf7" }}>
          <img
            src="/chefs.png"
            className="w-100 h-100 object-fit-cover"
            alt="צוות טבחים מקצועי במטבח מסעדה"
          />
        </div>
        <Card.Body className="p-5">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h1 className="fw-bold text-brown display-5 mb-0">{job.title}</h1>
            {job.isActive === false && (
              <Badge bg="danger" className="fs-5 px-3 py-2">
                המשרה אוישה
              </Badge>
            )}
          </div>

          <h4 className="text-muted mb-4 d-flex align-items-center gap-2">
            {job.restaurantId?.profileImage ? (
              <img
                src={getImageUrl(job.restaurantId.profileImage)}
                alt={job.restaurantId.fullName}
                className="rounded-circle object-fit-cover"
                style={{ width: "40px", height: "40px" }}
              />
            ) : (
              <FaUtensils className="text-light-brown" />
            )}{" "}
            {job.restaurantId?.fullName || "מסעדה"}
          </h4>

          <div className="d-flex flex-wrap gap-4 mb-4 bg-cream p-4 rounded-4">
            <div className="d-flex align-items-center gap-2 fs-5">
              <FaMapMarkerAlt className="text-light-brown" />{" "}
              <strong>{job.location}</strong>
            </div>
            <div className="d-flex align-items-center gap-2 fs-5">
              <FaShekelSign className="text-light-brown" />{" "}
              <strong>{job.hourlyWage} / שעה</strong>
            </div>
            <div className="fs-5">
              <strong>תאריך משמרת:</strong>{" "}
              {new Date(job.shiftDate).toLocaleDateString("he-IL")}
            </div>
          </div>

          <h4 className="fw-bold text-dark mb-3">תיאור המשרה</h4>
          <Card.Text className="fs-5 text-muted lh-lg mb-5">
            {job.description}
          </Card.Text>

          {user?.role === "cook" && (
            <Button
              onClick={handleApply}
              disabled={job.isActive === false || submitting}
              className="btn-brown rounded-pill py-3 px-5 fw-bold fs-5 w-100 mt-auto shadow-sm"
            >
              {job.isActive === false
                ? "המשרה סגורה להגשות"
                : submitting
                  ? "שולח..."
                  : "הגש מועמדות למשרה זו"}
            </Button>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default JobDetailsPage;
