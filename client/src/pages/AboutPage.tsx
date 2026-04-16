import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaUtensils,
  FaUserTie,
  FaCheckCircle,
  FaSearch,
  FaHandshake,
} from "react-icons/fa";

const AboutPage = () => {
  return (
    <Container className="py-5 mt-4 text-right">
      <div className="text-center mb-5">
        <h1 className="fw-bold text-brown display-4 mb-3">אודות Chefs4u</h1>
        <p className="text-muted fs-5 mx-auto" style={{ maxWidth: "700px" }}>
          הפלטפורמה המהפכנית שמחברת בין מסעדות שמחפשות צוות מקצועי, לבין טבחים
          שרוצים למצוא את המשמרת הבאה שלהם במהירות ובקלות.
        </p>
      </div>

      <Row className="mb-5 align-items-stretch">
        <Col lg={6} className="mb-4 mb-lg-0 d-flex">
          <div
            className="bg-cream p-5 rounded-4 shadow-sm border-start border-4 w-100 h-100"
            style={{ borderColor: "#8d623b" }}
          >
            <h3 className="fw-bold text-brown mb-4">
              <FaUtensils className="me-2 text-light-brown" /> החזון שלנו
            </h3>
            <p className="fs-5 lh-lg text-dark">
              בעולם המסעדנות הדינמי, מציאת צוות אמין ומקצועי היא אתגר יומיומי.
              מנגד, טבחים רבים מחפשים גמישות, עבודה נוספת, או אפשרות להתנסות
              במטבחים חדשים.
              <strong> Chefs4u</strong> נולדה בדיוק כדי לפתור את הפער הזה.
            </p>
            <p className="fs-5 lh-lg text-dark mb-0">
              אנחנו מספקים זירת מסחר שקופה, יעילה ומהירה למשרות ומשמרות בעולם
              הקולינריה.
            </p>
          </div>
        </Col>
        <Col lg={6} className="d-flex">
          <img
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80"
            alt="טבחים בעבודה במטבח מקצועי"
            className="img-fluid rounded-4 shadow-lg object-fit-cover w-100 h-100"
            style={{ minHeight: "350px" }}
          />
        </Col>
      </Row>

      <div className="mb-5">
        <h2 className="text-center fw-bold text-brown mb-5">איך זה עובד?</h2>
        <Row className="g-4">
          <Col md={6}>
            <Card className="h-100 border-0 bg-white shadow-sm rounded-4 card-custom">
              <Card.Body className="p-5">
                <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                  <div className="bg-cream rounded-circle p-3 d-flex align-items-center justify-content-center">
                    <FaUserTie className="text-brown fs-3" />
                  </div>
                  <h3 className="fw-bold text-brown mb-0">למסעדות</h3>
                </div>
                <ul className="list-unstyled d-flex flex-column gap-3">
                  <li className="d-flex gap-3 align-items-start fs-5">
                    <FaCheckCircle className="text-success mt-1 flex-shrink-0" />
                    <span>
                      <strong>פרסום קל:</strong> העלו משרה בתוך דקות עם פרטים
                      מדויקים (שכר, שעות, התמחות).
                    </span>
                  </li>
                  <li className="d-flex gap-3 align-items-start fs-5">
                    <FaCheckCircle className="text-success mt-1 flex-shrink-0" />
                    <span>
                      <strong>ניהול מועמדים:</strong> דשבורד חכם המאפשר צפייה
                      בפרופילים, אישור או דחייה בלחיצת כפתור.
                    </span>
                  </li>
                  <li className="d-flex gap-3 align-items-start fs-5">
                    <FaCheckCircle className="text-success mt-1 flex-shrink-0" />
                    <span>
                      <strong>תקשורת ישירה:</strong> שלחו הודעות למועמדים דרך
                      הפלטפורמה בצורה מאובטחת.
                    </span>
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="h-100 border-0 bg-white shadow-sm rounded-4 card-custom">
              <Card.Body className="p-5">
                <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                  <div className="bg-cream rounded-circle p-3 d-flex align-items-center justify-content-center">
                    <FaUtensils className="text-brown fs-3" />
                  </div>
                  <h3 className="fw-bold text-brown mb-0">לטבחים</h3>
                </div>
                <ul className="list-unstyled d-flex flex-column gap-3">
                  <li className="d-flex gap-3 align-items-start fs-5">
                    <FaCheckCircle className="text-success mt-1 flex-shrink-0" />
                    <span>
                      <strong>פרופיל אישי:</strong> הציגו את הניסיון, ההתמחות
                      והרקע שלכם כדי לבלוט.
                    </span>
                  </li>
                  <li className="d-flex gap-3 align-items-start fs-5">
                    <FaCheckCircle className="text-success mt-1 flex-shrink-0" />
                    <span>
                      <strong>חיפוש חכם:</strong> מצאו משמרות שמתאימות ללוח
                      הזמנים שלכם ולציפיות השכר שלכם.
                    </span>
                  </li>
                  <li className="d-flex gap-3 align-items-start fs-5">
                    <FaCheckCircle className="text-success mt-1 flex-shrink-0" />
                    <span>
                      <strong>מעקב קל:</strong> אזור אישי למעקב אחרי המשרות
                      שהגשתם אליהן מועמדות וצפייה בסטטוס בזמן אמת.
                    </span>
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      <div
        className="rounded-4 p-5 text-center shadow-sm mb-5 border"
        style={{ backgroundColor: "#f5ece5", borderColor: "#e0d7d0" }}
      >
        <h2 className="fw-bold mb-3" style={{ color: "#4b3832" }}>
          מוכנים להתחיל?
        </h2>
        <p className="fs-5 mb-4" style={{ color: "#6c757d" }}>
          הצטרפו עוד היום לקהילת הקולינריה החכמה של ישראל.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link
            to="/register"
            className="btn btn-brown rounded-pill px-4 py-2 fw-bold"
          >
            <FaHandshake className="me-2" /> הצטרפו עכשיו
          </Link>
          <Link
            to="/"
            className="btn btn-outline-brown rounded-pill px-4 py-2 fw-bold"
          >
            <FaSearch className="me-2" /> צפו במשרות
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default AboutPage;
