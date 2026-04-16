import {
  Container,
  Row,
  Col,
  Button,
  Form,
  InputGroup,
} from "react-bootstrap";
import {
  FaSearch,
  FaShekelSign,
  FaFilter,
  FaArrowDown,
} from "react-icons/fa";

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  filterLocation: string;
  setFilterLocation: (val: string) => void;
  filterWage: number | "";
  setFilterWage: (val: number | "") => void;
  filteredJobsCount: number;
  scrollToJobs: () => void;
}

const HeroSection = ({
  searchQuery,
  setSearchQuery,
  filterLocation,
  setFilterLocation,
  filterWage,
  setFilterWage,
  filteredJobsCount,
  scrollToJobs,
}: HeroSectionProps) => {
  return (
    <section className="hero-section-kidibe">
      <Container className="text-center">
        <h1 className="hero-title-kidibe">מצאו את המשמרת הבאה שלכם</h1>
        <p className="fs-4 text-dark fw-bold mb-5 opacity-75">
          המקום שבו טבחים ומסעדות נפגשים בקליק.
        </p>

        <div
          className="bg-white p-3 rounded-4 shadow-lg mx-auto position-relative"
          style={{ maxWidth: "1000px" }}
        >
          <Row className="g-3 align-items-center">
            <Col lg={4} xs={12}>
              <InputGroup>
                <InputGroup.Text className="bg-transparent border-0 text-brown ms-2">
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="איזו משרה תרצו למצוא?"
                  className="border-0 shadow-none bg-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col lg={3} xs={12} className="border-lg-start">
              <InputGroup>
                <InputGroup.Text className="bg-transparent border-0 text-brown ms-2">
                  <FaFilter />
                </InputGroup.Text>
                <Form.Select
                  className="border-0 shadow-none bg-transparent text-muted"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                >
                  <option value="">כל הארץ</option>
                  <option value="צפון">צפון</option>
                  <option value="חיפה והקריות">חיפה והקריות</option>
                  <option value="השרון">השרון</option>
                  <option value="מרכז">מרכז</option>
                  <option value="השפלה">השפלה</option>
                  <option value="ירושלים והסביבה">ירושלים והסביבה</option>
                  <option value="דרום">דרום</option>
                </Form.Select>
              </InputGroup>
            </Col>
            <Col lg={3} xs={12} className="border-lg-start">
              <InputGroup>
                <InputGroup.Text className="bg-transparent border-0 text-brown ms-2">
                  <FaShekelSign />
                </InputGroup.Text>
                <Form.Control
                  type="number"
                  min="0"
                  placeholder="שכר שעתי מינימלי"
                  className="border-0 shadow-none bg-transparent"
                  value={filterWage}
                  onChange={(e) =>
                    setFilterWage(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                />
              </InputGroup>
            </Col>
            <Col lg={2} xs={12}>
              <Button
                className="btn-brown rounded-pill w-100 py-2 fw-bold"
                onClick={scrollToJobs}
              >
                חיפוש
              </Button>
            </Col>
          </Row>

          {searchQuery && filteredJobsCount > 0 && (
            <div
              onClick={scrollToJobs}
              className="position-absolute start-50 translate-middle-x mt-4 shadow-lg d-flex align-items-center justify-content-center"
              style={{
                top: "100%",
                backgroundColor: "#8d623b",
                color: "white",
                padding: "10px 20px",
                borderRadius: "50px",
                cursor: "pointer",
                zIndex: 100,
                whiteSpace: "nowrap",
                animation: "bounce 2s infinite",
              }}
            >
              <span className="me-2 text-wrap">
                נמצאו תוצאות עבור "{searchQuery}" - לחץ כאן
              </span>
              <FaArrowDown />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
