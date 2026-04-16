import { useEffect, useState } from "react";
import axios from "axios";
import api from "../api/axios";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaShekelSign,
  FaUtensils,
  FaHeartBroken,
  FaTrash,
} from "react-icons/fa";
import { toast } from "react-toastify";

interface Restaurant {
  _id: string;
  fullName: string;
}

interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  hourlyWage: number;
  shiftDate: string;
  restaurantId: Restaurant;
}

const FavoritesPage = () => {
  const [favoriteJobs, setFavoriteJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.get(`/auth/favorites`);
        setFavoriteJobs(res.data);
      } catch {
        toast.error("שגיאה בטעינת המועדפים");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchFavorites();
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const removeFavorite = async (jobId: string) => {
    try {
      await api.post(`/auth/favorites/${jobId}`, {});
      setFavoriteJobs((prevJobs) =>
        prevJobs.filter((job) => job._id !== jobId),
      );
      toast.info("המשרה הוסרה מהמועדפים");
    } catch {
      toast.error("שגיאה בהסרת המשרה");
    }
  };

  const handleApply = async (jobId: string) => {
    if (!isAuthenticated) {
      toast.info("יש להתחבר כדי להגיש מועמדות");
      navigate("/login");
      return;
    }
    if (user?.role !== "cook") {
      toast.warning("רק טבחים יכולים להגיש מועמדות למשרות");
      return;
    }

    try {
      await api.post(`/jobs/${jobId}/apply`, {});
      toast.success("מועמדותך הוגשה בהצלחה! 👨‍🍳");
      navigate("/cook-dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "שגיאה בהגשת המועמדות");
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" style={{ color: "#8d623b" }} />
      </div>
    );
  }

  return (
    <Container className="py-5 text-right min-vh-100">
      <div className="mb-5 border-bottom pb-3">
        <h2 className="fw-bold text-brown display-5">המשרות המועדפות שלי</h2>
        <p className="text-muted fs-5">
          כל המשמרות ששמרת במקום אחד, מוכנות להגשת מועמדות.
        </p>
      </div>

      {favoriteJobs.length === 0 ? (
        <div className="text-center py-5 mt-5">
          <FaHeartBroken
            size={80}
            className="text-light-brown opacity-50 mb-4"
          />
          <h3 className="fw-bold text-brown">אין לך משרות מועדפות כרגע</h3>
          <p className="text-muted fs-5 mb-4">
            חזור לדף הבית ולחץ על הלב כדי לשמור משרות שמעניינות אותך.
          </p>
          <Button
            onClick={() => navigate("/")}
            className="btn-brown rounded-pill px-5 py-3 fw-bold fs-5 shadow-sm"
          >
            חפש משרות עכשיו
          </Button>
        </div>
      ) : (
        <Row className="g-4">
          {favoriteJobs.map((job) => (
            <Col md={6} lg={4} key={job._id}>
              <Card
                className="card-custom h-100 shadow-sm border-0 position-relative"
                style={{ borderRadius: "30px" }}
              >
                <Button
                  variant="light"
                  className="position-absolute top-0 start-0 m-3 rounded-circle p-2 shadow-sm border-0 text-danger hover-opacity-100"
                  style={{ zIndex: 10, opacity: 0.8 }}
                  onClick={() => removeFavorite(job._id)}
                  title="הסר ממועדפים"
                >
                  <FaTrash />
                </Button>

                <Card.Body className="p-4 d-flex flex-column mt-3">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h4 className="fw-bold text-brown mb-0 ms-4">
                      {job.title}
                    </h4>
                  </div>
                  <div className="text-muted small fw-bold mb-3 d-flex align-items-center gap-1">
                    <FaUtensils className="text-light-brown" />{" "}
                    {job.restaurantId?.fullName || "מסעדה לא ידועה"}
                  </div>

                  <span
                    className="bg-cream text-brown px-3 py-2 rounded-pill mb-3 align-self-start border d-inline-block"
                    style={{
                      borderColor: "rgba(141, 98, 59, 0.2)",
                      fontSize: "0.85rem",
                    }}
                  >
                    {new Date(job.shiftDate).toLocaleDateString("he-IL")}
                  </span>

                  <div
                    className="d-flex justify-content-between align-items-center mb-4 bg-cream p-3 mt-auto"
                    style={{ borderRadius: "20px" }}
                  >
                    <span className="fw-bold text-dark d-flex align-items-center gap-2">
                      <FaMapMarkerAlt className="text-light-brown" />{" "}
                      {job.location}
                    </span>
                    <span className="fw-bold text-dark d-flex align-items-center gap-2">
                      <FaShekelSign className="text-light-brown" />{" "}
                      {job.hourlyWage} / שעה
                    </span>
                  </div>

                  {user?.role === "cook" && (
                    <Button
                      onClick={() => handleApply(job._id)}
                      className="btn-brown rounded-pill py-3 fw-bold w-100 shadow-sm fs-5"
                    >
                      הגש מועמדות למשרה
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default FavoritesPage;
