import { Container, Row, Col, Card, Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../api/axios";
import {
  FaMapMarkerAlt,
  FaShekelSign,
  FaUtensils,
  FaHeart,
  FaRegHeart,
  FaThLarge,
  FaList,
  FaTrash,
  FaEdit,
  FaRegTimesCircle,
  FaCheckCircle,
  FaUserCircle,
} from "react-icons/fa";

interface Restaurant {
  _id: string;
  fullName: string;
  profileImage?: string;
}

interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  hourlyWage: number;
  shiftDate: string;
  isActive: boolean;
  restaurantId: Restaurant;
}

interface JobsSectionProps {
  filteredJobs: Job[];
  favorites: string[];
  viewMode: "grid" | "table";
  setViewMode: (mode: "grid" | "table") => void;
  userId?: string;
  userRole?: string;
  isAuthenticated?: boolean;
  onApply: (jobId: string) => void;
  onDelete: (jobId: string) => void;
  onToggleStatus: (jobId: string) => void;
  onToggleFavorite: (jobId: string) => void;
}

const JobsSection = ({
  filteredJobs,
  favorites,
  viewMode,
  setViewMode,
  userId,
  userRole,
  onApply,
  onDelete,
  onToggleStatus,
  onToggleFavorite,
}: JobsSectionProps) => {
  const navigate = useNavigate();

  return (
    <section className="py-5 my-5" id="hot-jobs">
      <Container>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
          <h2 className="fw-bold text-brown mb-0">משרות חמות מחכות לכם</h2>
          <div className="bg-cream p-1 rounded-pill d-flex shadow-sm">
            <Button
              variant={viewMode === "grid" ? "brown" : "link"}
              className={`rounded-pill px-4 py-2 d-flex align-items-center gap-2 ${viewMode === "grid" ? "text-white" : "text-brown text-decoration-none"}`}
              onClick={() => setViewMode("grid")}
            >
              <FaThLarge /> כרטיסים
            </Button>
            <Button
              variant={viewMode === "table" ? "brown" : "link"}
              className={`rounded-pill px-4 py-2 d-flex align-items-center gap-2 ${viewMode === "table" ? "text-white" : "text-brown text-decoration-none"}`}
              onClick={() => setViewMode("table")}
            >
              <FaList /> טבלה
            </Button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <Row className="g-4">
            {filteredJobs.map((job) => {
              const isFavorite = favorites.includes(job._id);
              const canManage =
                userRole === "admin" ||
                (userRole === "restaurant" &&
                  userId === job.restaurantId?._id);
              return (
                <Col lg={4} md={6} key={job._id}>
                  <Card
                    className={`card-custom h-100 shadow-sm border-0 position-relative ${job.isActive === false ? "opacity-75" : ""}`}
                    style={{ borderRadius: "30px", overflow: "hidden" }}
                  >
                    {job.isActive === false && (
                      <div
                        className="position-absolute top-50 start-50 translate-middle w-100 text-center py-2"
                        style={{
                          zIndex: 105,
                          backgroundColor: "rgba(220, 53, 69, 0.9)",
                          color: "white",
                          transform: "rotate(-15deg)",
                        }}
                      >
                        <h4 className="fw-bold m-0">המשרה אוישה</h4>
                      </div>
                    )}

                    {canManage && (
                      <div
                        className="position-absolute top-0 end-0 m-3 d-flex gap-2"
                        style={{ zIndex: 100 }}
                      >
                        <Button
                          variant={
                            job.isActive === false ? "success" : "warning"
                          }
                          size="sm"
                          className="rounded-circle shadow-sm text-white"
                          onClick={() => onToggleStatus(job._id)}
                          title={job.isActive === false ? "פתח משרה" : "סגור משרה"}
                        >
                          {job.isActive === false ? (
                            <FaCheckCircle />
                          ) : (
                            <FaRegTimesCircle />
                          )}
                        </Button>
                        <Button
                          variant="light"
                          size="sm"
                          className="rounded-circle shadow-sm"
                          onClick={() => navigate(`/edit-job/${job._id}`)}
                          title="עריכת משרה"
                        >
                          <FaEdit className="text-primary" />
                        </Button>
                        <Button
                          variant="light"
                          size="sm"
                          className="rounded-circle shadow-sm"
                          onClick={() => onDelete(job._id)}
                          title="מחיקת משרה"
                        >
                          <FaTrash className="text-danger" />
                        </Button>
                      </div>
                    )}

                    <div
                      style={{ height: "190px", position: "relative", cursor: "pointer" }}
                      onClick={() => navigate(`/job/${job._id}`)}
                    >
                      <img
                        src="/chefs.png"
                        className="w-100 h-100 object-fit-cover"
                        alt="צוות טבחים מקצועי במטבח"
                      />
                      <div
                        className="position-absolute top-0 start-0 m-3"
                        style={{ zIndex: 10, cursor: "pointer" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(job._id);
                        }}
                      >
                        {isFavorite ? (
                          <FaHeart className="text-danger fs-3 bg-white rounded-circle p-2 shadow-sm" />
                        ) : (
                          <FaRegHeart className="text-muted fs-3 bg-white rounded-circle p-2 shadow-sm opacity-75" />
                        )}
                      </div>
                    </div>

                    <Card.Body className="p-4 d-flex flex-column">
                      <h4 className="fw-bold text-brown mb-3">{job.title}</h4>
                      <div className="text-muted small fw-bold mb-3 d-flex align-items-center gap-2">
                        {job.restaurantId?.profileImage ? (
                          <img
                            src={getImageUrl(job.restaurantId.profileImage)}
                            alt={job.restaurantId.fullName}
                            className="rounded-circle object-fit-cover shadow-sm"
                            style={{ width: "30px", height: "30px" }}
                          />
                        ) : (
                          <FaUtensils className="text-light-brown fs-5" />
                        )}
                        {job.restaurantId?.fullName || "מסעדה"}
                      </div>
                      <span
                        className="bg-cream text-brown px-3 py-2 rounded-pill mb-3 align-self-start border d-inline-block"
                        style={{ fontSize: "0.85rem" }}
                      >
                        {new Date(job.shiftDate).toLocaleDateString("he-IL")}
                      </span>
                      <Card.Text
                        className="text-muted mb-4 flex-grow-1"
                        style={{ fontSize: "0.9rem", lineHeight: "1.5" }}
                      >
                        {job.description.substring(0, 100)}
                        {job.description.length > 100 ? "..." : ""}
                      </Card.Text>
                      <div
                        className="d-flex justify-content-between align-items-center mb-4 bg-cream p-3"
                        style={{ borderRadius: "20px" }}
                      >
                        <span className="fw-bold text-dark small">
                          <FaMapMarkerAlt className="text-light-brown me-1" />
                          {job.location}
                        </span>
                        <span className="fw-bold text-dark small">
                          <FaShekelSign className="text-light-brown me-1" />
                          {job.hourlyWage} / שעה
                        </span>
                      </div>
                      <Button
                        onClick={() => onApply(job._id)}
                        disabled={job.isActive === false}
                        className="btn-brown rounded-pill py-2 fw-bold w-100 mt-auto"
                      >
                        {job.isActive === false ? "המשרה נסגרה" : "הגש מועמדות"}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        ) : (
          <div className="table-responsive bg-white rounded-4 shadow-sm p-3">
            <Table hover className="align-middle mb-0">
              <thead className="bg-cream">
                <tr>
                  <th className="text-brown border-0">משרה</th>
                  <th className="text-brown border-0">מסעדה</th>
                  <th className="text-brown border-0">מיקום</th>
                  <th className="text-brown border-0 text-center">שכר</th>
                  <th className="text-brown border-0 text-center">פעולה</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr
                    key={job._id}
                    className={job.isActive === false ? "opacity-50" : ""}
                  >
                    <td className="fw-bold text-dark">
                      {job.title}{" "}
                      {job.isActive === false && (
                        <span className="badge bg-danger ms-2">אוישה</span>
                      )}
                    </td>
                    <td className="text-muted">
                      <div className="d-flex align-items-center gap-2">
                        {job.restaurantId?.profileImage ? (
                          <img
                            src={getImageUrl(job.restaurantId.profileImage)}
                            alt={job.restaurantId.fullName}
                            className="rounded-circle object-fit-cover shadow-sm"
                            style={{ width: "30px", height: "30px" }}
                          />
                        ) : (
                          <FaUserCircle className="text-light-brown fs-4" />
                        )}
                        <span>{job.restaurantId?.fullName}</span>
                      </div>
                    </td>
                    <td className="text-muted">{job.location}</td>
                    <td className="text-center fw-bold text-brown">
                      {job.hourlyWage} ₪
                    </td>
                    <td className="text-center">
                      <Button
                        onClick={() => onApply(job._id)}
                        size="sm"
                        disabled={job.isActive === false}
                        className="btn-brown rounded-pill px-3"
                      >
                        {job.isActive === false ? "סגור" : "הגשה"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Container>
    </section>
  );
};

export default JobsSection;
