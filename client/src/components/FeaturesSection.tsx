import { Container, Row, Col } from "react-bootstrap";

const FeaturesSection = () => {
  return (
    <section className="py-5 bg-cream mt-5">
      <Container>
        <h2 className="text-center fw-bold text-brown mb-5 display-5">
          למה Chefs4u?
        </h2>
        <Row className="g-4">
          <Col md={4}>
            <div className="feature-card-kidibe shadow-sm">
              <div
                className="rounded-4 mb-3 overflow-hidden"
                style={{ height: "180px" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?q=80&w=500&auto=format&fit=crop"
                  className="w-100 h-100 object-fit-cover"
                  alt="טבח מקצועי מבשל במטבח מסעדה"
                />
              </div>
              <h4 className="fw-bold text-brown">חיבור ישיר</h4>
              <p className="text-muted">
                אנו דואגים לך לכל התהליך ומחברים אותך ישירות עם המסעדות.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="feature-card-kidibe shadow-sm">
              <div
                className="rounded-4 mb-3 overflow-hidden"
                style={{ height: "180px" }}
              >
                <img
                  src="/cc.jpg"
                  className="w-100 h-100 object-fit-cover"
                  alt="מטבח מסעדה מקצועי עם ציוד בישול"
                />
              </div>
              <h4 className="fw-bold text-brown">גמישות מלאה</h4>
              <p className="text-muted">
                אתם קובעים מתי ואיפה. ניהול לוח זמנים שמתאים לכם.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="feature-card-kidibe shadow-sm">
              <div
                className="rounded-4 mb-3 overflow-hidden"
                style={{ height: "180px" }}
              >
                <img
                  src="/panipuri.jpg"
                  className="w-100 h-100 object-fit-cover"
                  alt="מנה מוגמרת מוכנה להגשה"
                />
              </div>
              <h4 className="fw-bold text-brown">שקט נפשי</h4>
              <p className="text-muted">
                ניהול מועדפים ומעקב אחרי פניות בצורה מסודרת.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default FeaturesSection;
