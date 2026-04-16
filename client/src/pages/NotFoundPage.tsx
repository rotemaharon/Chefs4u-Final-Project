import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container className="text-center py-5 mt-5">
      <h1 className="display-1 fw-bold text-brown mb-4">404</h1>
      <h2 className="mb-4 text-dark opacity-75">אופס! העמוד שחיפשת לא נמצא.</h2>
      <p className="mb-5 text-muted">
        יכול להיות שהכתובת שגויה או שהעמוד הוסר.
      </p>
      <Button
        onClick={() => navigate("/")}
        className="btn-brown rounded-pill px-5 py-2 fw-bold text-white fs-5"
      >
        חזרה לדף הבית
      </Button>
    </Container>
  );
};

export default NotFoundPage;
