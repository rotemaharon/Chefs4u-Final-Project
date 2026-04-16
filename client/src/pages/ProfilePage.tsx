import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Form,
  Button,
  Card,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import { useAppSelector } from "../store/hooks";
import { toast } from "react-toastify";
import api, { getImageUrl } from "../api/axios";
import {
  FaUserCircle,
  FaSave,
  FaIdCard,
  FaPhoneAlt,
  FaEnvelope,
  FaUtensils,
  FaBriefcase,
  FaCommentDots,
  FaCamera,
} from "react-icons/fa";

const ProfilePage = () => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [experienceYears, setExperienceYears] = useState<number | "">("");
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/auth/profile`);

        setFullName(res.data.fullName || "");
        setPhone(res.data.phone || "");
        setEmail(res.data.email || "");
        setExperienceYears(res.data.experienceYears || "");
        setSpecialty(res.data.specialty || "");
        setBio(res.data.bio || "");
        setProfileImage(res.data.profileImage || "");
      } catch {
        toast.error("שגיאה בטעינת הנתונים");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("גודל הקובץ חייב להיות עד 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", file);

    setUploadingImage(true);
    try {
      const res = await api.post(`/auth/profile/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfileImage(res.data.profileImage);
      toast.success("התמונה הועלתה בהצלחה!");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "שגיאה בהעלאת התמונה");
      } else {
        toast.error("שגיאה בהעלאת התמונה");
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updateData = {
        fullName,
        phone,
        experienceYears,
        specialty,
        bio,
      };

      await api.put(`/auth/profile`, updateData);
      toast.success("הפרופיל עודכן בהצלחה!");
    } catch {
      toast.error("שגיאה בעדכון הפרופיל");
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
    <Container className="auth-container py-5 text-right">
      <Card
        className="auth-card shadow-lg border-0 p-4 p-md-5 mx-auto"
        style={{ maxWidth: "800px", width: "100%" }}
      >
        <div className="text-center mb-5">
          <div className="d-inline-block position-relative mb-3">
            {profileImage ? (
              <img
                src={getImageUrl(profileImage)}
                alt="Profile"
                className="rounded-circle shadow-sm object-fit-cover"
                style={{ width: "120px", height: "120px" }}
              />
            ) : (
              <div
                className="bg-cream d-inline-flex justify-content-center align-items-center rounded-circle shadow-sm"
                style={{ width: "120px", height: "120px" }}
              >
                <FaUserCircle size={80} className="text-brown" />
              </div>
            )}
            <label
              htmlFor="imageUpload"
              className="position-absolute bottom-0 end-0 bg-white text-brown rounded-circle p-2 shadow border"
              style={{
                cursor: "pointer",
                transform: "translate(-5px, -5px)",
                borderColor: "#8d623b",
              }}
            >
              {uploadingImage ? (
                <Spinner size="sm" animation="border" />
              ) : (
                <FaCamera size={18} />
              )}
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              className="d-none"
              onChange={handleImageUpload}
              disabled={uploadingImage}
            />
          </div>
          <h2 className="fw-bold text-brown display-6 mb-2">הפרופיל שלי</h2>
          <p className="text-muted fs-5">
            עדכנו את הפרטים שלכם כדי להגדיל את סיכויי ההתאמה.
          </p>
        </div>

        <Form onSubmit={handleUpdate}>
          <h5 className="text-brown fw-bold mb-4 border-bottom pb-2">
            פרטים אישיים
          </h5>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-4" controlId="fullName">
                <Form.Label className="fw-bold text-brown ms-2 small">
                  <FaIdCard className="me-1" /> שם מלא
                </Form.Label>
                <Form.Control
                  type="text"
                  className="form-input-rounded"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-4" controlId="phone">
                <Form.Label className="fw-bold text-brown ms-2 small">
                  <FaPhoneAlt className="me-1" /> טלפון
                </Form.Label>
                <Form.Control
                  type="text"
                  className="form-input-rounded"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="הזינו מספר טלפון"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4" controlId="email">
            <Form.Label className="fw-bold text-brown ms-2 small opacity-75">
              <FaEnvelope className="me-1" /> אימייל (לא ניתן לשינוי)
            </Form.Label>
            <Form.Control
              type="email"
              className="form-input-rounded bg-light text-muted border-0 shadow-none"
              value={email}
              disabled
            />
          </Form.Group>

          {user?.role === "cook" && (
            <>
              <h5 className="text-brown fw-bold mt-5 mb-4 border-bottom pb-2">
                פרטים מקצועיים
              </h5>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4" controlId="experienceYears">
                    <Form.Label className="fw-bold text-brown ms-2 small">
                      <FaBriefcase className="me-1" /> שנות ניסיון
                    </Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      className="form-input-rounded"
                      value={experienceYears}
                      onChange={(e) =>
                        setExperienceYears(
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                      placeholder="כמה שנים אתם בתחום?"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-4" controlId="specialty">
                    <Form.Label className="fw-bold text-brown ms-2 small">
                      <FaUtensils className="me-1" /> התמחות עיקרית
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="form-input-rounded"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      placeholder="למשל: איטלקי, אסייתי, קונדיטוריה"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-4" controlId="bio">
                <Form.Label className="fw-bold text-brown ms-2 small">
                  <FaCommentDots className="me-1" /> קצת עליכם
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  className="form-input-rounded p-3"
                  style={{ borderRadius: "15px" }}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="ספרו קצת על הניסיון שלכם, המטבחים שעבדתם בהם ומה אתם מחפשים..."
                />
              </Form.Group>
            </>
          )}

          <div className="text-center mt-5">
            <Button
              type="submit"
              className="btn-brown rounded-pill py-3 px-5 fw-bold fs-5 shadow-sm d-flex align-items-center gap-2 mx-auto"
            >
              <FaSave /> שמירת כל השינויים
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default ProfilePage;
