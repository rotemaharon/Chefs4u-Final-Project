import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { logout } from "../store/authSlice";
import { toast } from "react-toastify";
import api from "../api/axios";
import {
  Navbar as BSNavbar,
  Nav,
  Container,
  Button,
  Badge,
} from "react-bootstrap";
import {
  FaEnvelope,
  FaUserCircle,
  FaSignOutAlt,
  FaHeart,
  FaUserShield,
} from "react-icons/fa";

const Navbar = () => {
  const [expanded, setExpanded] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get(`/messages/unread-count`);
      setUnreadMessages(res.data.unreadCount);
    } catch {
      setUnreadMessages(0);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchUnreadCount();

    const handleRefresh = () => fetchUnreadCount();
    window.addEventListener("refreshUnreadCount", handleRefresh);

    const interval = setInterval(fetchUnreadCount, 30000);

    return () => {
      window.removeEventListener("refreshUnreadCount", handleRefresh);
      clearInterval(interval);
    };
  }, [fetchUnreadCount, isAuthenticated]);

  const closeNav = () => setExpanded(false);

  const handleLogout = () => {
    closeNav();
    dispatch(logout());
    toast.info("התנתקת בהצלחה");
    navigate("/login");
  };

  return (
    <BSNavbar
      expanded={expanded}
      onToggle={setExpanded}
      bg="white"
      expand="lg"
      className="navbar-custom mb-3 mb-lg-5 py-3 shadow-sm sticky-top"
    >
      <Container>
        <BSNavbar.Brand
          as={Link}
          to="/"
          onClick={closeNav}
          className="fw-bold fs-2 text-brown d-flex align-items-center gap-3"
          style={{ letterSpacing: "-1px" }}
        >
          <img
            src="/LOGO.png"
            alt="logo Chefs4u"
            style={{
              width: "55px",
              height: "55px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #8d623b",
            }}
          />
          <span>Chefs4u</span>
        </BSNavbar.Brand>
        <BSNavbar.Toggle
          aria-controls="basic-navbar-nav"
          className="border-0 shadow-none"
        />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto gap-0 mt-2 mt-lg-0">
            {isAuthenticated &&
              (user?.role === "restaurant" || user?.role === "admin") && (
                <>
                  <Nav.Link
                    as={Link}
                    to="/dashboard"
                    onClick={closeNav}
                    className="text-brown fw-bold px-2"
                  >
                    ניהול משרות
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/create-job"
                    onClick={closeNav}
                    className="text-brown fw-bold px-2"
                  >
                    פרסום משרה
                  </Nav.Link>
                </>
              )}

            {isAuthenticated && user?.role === "cook" && (
              <Nav.Link
                as={Link}
                to="/cook-dashboard"
                onClick={closeNav}
                className="text-brown fw-bold px-2"
              >
                האזור האישי
              </Nav.Link>
            )}

            {isAuthenticated && user?.role === "admin" && (
              <Nav.Link
                as={Link}
                to="/admin-dashboard"
                onClick={closeNav}
                className="text-danger fw-bold px-2 d-flex align-items-center gap-1"
              >
                <FaUserShield /> פאנל ניהול
              </Nav.Link>
            )}

            {isAuthenticated && (
              <>
                <Nav.Link
                  as={Link}
                  to="/favorites"
                  onClick={closeNav}
                  className="text-brown fw-bold px-2 d-flex align-items-center gap-1"
                >
                  <FaHeart className="text-danger" /> מועדפים
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/messages"
                  onClick={closeNav}
                  className="text-brown fw-bold px-2 d-flex align-items-center gap-1 position-relative"
                >
                  <div className="position-relative d-inline-block">
                    <FaEnvelope />
                    {unreadMessages > 0 && (
                      <Badge
                        bg="danger"
                        pill
                        className="position-absolute translate-middle border border-light"
                        style={{
                          top: "0px",
                          left: "90%",
                          fontSize: "0.6rem",
                          padding: "0.25em 0.4em",
                        }}
                      >
                        {unreadMessages}
                      </Badge>
                    )}
                  </div>
                  <span className="ms-1">הודעות</span>
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/profile"
                  onClick={closeNav}
                  className="text-brown fw-bold px-2 d-flex align-items-center gap-1"
                >
                  <FaUserCircle /> הפרופיל שלי
                </Nav.Link>
              </>
            )}

            <Nav.Link
              as={Link}
              to="/about"
              onClick={closeNav}
              className="text-brown fw-bold px-2"
            >
              אודות
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto align-items-center gap-2 mt-3 mt-lg-0">
            {isAuthenticated ? (
              <>
                <div className="d-flex align-items-center bg-cream px-3 py-2 rounded-pill">
                  <span className="text-brown fw-bold small">
                    {user?.fullName}{" "}
                    <span className="text-muted fw-normal mx-1">|</span>
                    {user?.role === "admin"
                      ? " מנהל"
                      : user?.role === "cook"
                        ? " טבח"
                        : " מסעדה"}
                  </span>
                </div>
                <Button
                  onClick={handleLogout}
                  className="btn-brown rounded-pill px-4 py-2 border-0 shadow-sm d-flex align-items-center gap-2"
                >
                  <FaSignOutAlt /> התנתקות
                </Button>
              </>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  to="/login"
                  onClick={closeNav}
                  className="text-brown fw-bold px-2"
                >
                  התחברות
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/register"
                  onClick={closeNav}
                  className="p-0"
                >
                  <Button className="btn-brown rounded-pill px-3 py-2 border-0 shadow-sm">
                    הרשמה
                  </Button>
                </Nav.Link>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
