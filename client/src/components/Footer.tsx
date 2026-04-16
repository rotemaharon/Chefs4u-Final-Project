import { Container } from "react-bootstrap";
import {
  FaEnvelope,
  FaPhone,
  FaFacebook,
  FaInstagram,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="footer-section bg-cream border-top py-5"
      dir="rtl"
      style={{ backgroundColor: "#fdfbf7" }}
    >
      <Container>
        <div className="footer-columns-wrapper">
          <div className="footer-col">
            <h5 className="fw-bold text-brown mb-3">Chefs4u</h5>
            <p
              className="text-muted small lh-base mb-0"
              style={{ maxWidth: "250px" }}
            >
              הפלטפורמה המובילה לחיבור <br /> בין מסעדות לטבחים.
              <br />
              מציאת הצוות המושלם
              <br />
              והמשמרת הבאה בקלות ובמהירות.
            </p>
          </div>

          <div className="footer-col">
            <h5 className="fw-bold text-brown mb-3">ניווט</h5>
            <ul className="list-unstyled d-flex flex-column gap-2 p-0 m-0">
              <li>
                <Link to="/" className="text-muted text-decoration-none small">
                  דף הבית
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-muted text-decoration-none small"
                >
                  אודות
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-muted text-decoration-none small"
                >
                  הרשמה
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/972545437300"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted text-decoration-none small d-flex align-items-center gap-1"
                >
                  <FaWhatsapp className="text-success" /> יצירת קשר ב-WhatsApp
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h5 className="fw-bold text-brown mb-3">שעות פעילות</h5>
            <div className="text-muted small">
              <p className="mb-1 fw-bold text-dark">ימים א' - ה'</p>
              <p className="mb-2">10:00-18:00 </p>
              <p className="mb-1 fw-bold text-dark">יום שישי</p>
              <p className="mb-2">10:00-12:30</p>
              <p className="mb-0 fw-bold text-dark">שבת - סגור</p>
            </div>
          </div>

          <div className="footer-col">
            <h5 className="fw-bold text-brown mb-3">פרטי התקשרות</h5>
            <div className="d-flex flex-column gap-2 text-muted small">
              <div className="d-flex align-items-center gap-2">
                <FaPhone className="text-light-brown flex-shrink-0" />
                <a
                  href="tel:0545437300"
                  className="text-muted text-decoration-none"
                >
                  054-5437300
                </a>
              </div>
              <div className="d-flex align-items-center gap-2">
                <FaEnvelope className="text-light-brown flex-shrink-0" />
                <a
                  href="mailto:chefsemploy@gmail.com"
                  className="text-muted text-decoration-none"
                >
                  chefsemploy@gmail.com
                </a>
              </div>
              <div className="d-flex align-items-center gap-2">
                <FaMapMarkerAlt className="text-light-brown flex-shrink-0" />
                <span>רחוב כיכר קדומים 14, יפו</span>
              </div>
            </div>
          </div>

          <div className="footer-logo-wrapper">
            <div
              className="rounded-circle overflow-hidden shadow-sm d-inline-block"
              style={{
                width: "130px",
                height: "130px",
                border: "2px solid #8d623b",
              }}
            >
              <img
                src="/LOGO.png"
                alt="לוגו Chefs4u - הפלטפורמה לחיבור בין מסעדות לטבחים"
                className="w-100 h-100 object-fit-cover"
              />
            </div>
          </div>
        </div>

        <div className="text-center" style={{ marginTop: "50px" }}>
          <div className="d-flex justify-content-center gap-4 mb-3">
            <a
              href="https://www.facebook.com/profile.php?id=100063650810411"
              target="_blank"
              rel="noreferrer"
              className="text-light-brown fs-3"
            >
              <FaFacebook style={{ color: "#8d623b" }} />
            </a>
            <a
              href="https://www.instagram.com/_chefs4u_?igsh=eXZidDF1MXYzYmEw"
              target="_blank"
              rel="noreferrer"
              className="text-light-brown fs-3"
            >
              <FaInstagram style={{ color: "#8d623b" }} />
            </a>
          </div>
          <hr className="my-4 opacity-10" />
          <p className="text-muted small mb-0">
            עיצוב ובנייה: רותם אהרון | © {new Date().getFullYear()} Chefs4u. כל
            הזכויות שמורות.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
