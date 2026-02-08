"use client";
import Link from "next/link";
import Image from "next/image";

import {
  Row,
  Col,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  Button,
} from "react-bootstrap";

export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
      <div id="wd-dashboard-courses">
        {/* <div className="wd-dashboard-course">
          <Link href="/courses/1234" className="wd-dashboard-course-link">
            <Image
              src="/images/reactjs.jpg"
              width={200}
              height={150}
              alt="reactjs"
            />
            <div>
              <h5> CS1234 React JS </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div> */}
        <div className="wd-dashboard-course">
          <Row xs={1} md={5} className="g-4">
            <Col className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card>
                <Link
                  href="/courses/1234/home"
                  className="wd-dashboard-course-link text-decoration-none text-dark"
                >
                  <CardImg
                    variant="top"
                    src="/images/reactjs.jpg"
                    width="100%"
                    height={160}
                  />
                  <CardBody>
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      CS1234 React JS
                    </CardTitle>
                    <CardText
                      className="wd-dashboard-course-description overflow-hidden"
                      style={{ height: "100px" }}
                    >
                      Full Stack software developer
                    </CardText>
                    <Button variant="primary">Go</Button>
                  </CardBody>
                </Link>
              </Card>
            </Col>
            <Col className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card>
                <Link
                  href="/courses/001"
                  className="wd-dashboard-course-link text-decoration-none text-dark"
                >
                  <CardImg
                    variant="top"
                    src="/images/science.jpeg"
                    width="100%"
                    height={160}
                    alt="scientific-thinking"
                  />
                  <CardBody>
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      EEMB1102: Principles of Scientific Thinking
                    </CardTitle>
                    <CardText
                      className="wd-dashboard-course-description overflow-hidden"
                      style={{ height: "100px" }}
                    >
                      Start your journey towards analytical praxis today
                    </CardText>
                    <Button variant="primary">Go</Button>
                  </CardBody>
                </Link>
              </Card>
            </Col>
            <Col className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card>
                <Link
                  href="/courses/002"
                  className="wd-dashboard-course-link text-decoration-none text-dark"
                >
                  <CardImg
                    variant="top"
                    src="/images/stock-market.jpeg"
                    width="100%"
                    height={160}
                    alt="stock-market"
                  />
                  <CardBody>
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      ECON5700: Stock Market Simulation
                    </CardTitle>
                    <CardText
                      className="wd-dashboard-course-description overflow-hidden"
                      style={{ height: "100px" }}
                    >
                      Graduate-level Course Requirement{" "}
                    </CardText>
                    <Button variant="primary">Go</Button>
                  </CardBody>
                </Link>
              </Card>
            </Col>
            <Col className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card>
                <Link
                  href="/courses/003"
                  className="wd-dashboard-course-link text-decoration-none text-dark"
                >
                  <CardImg
                    variant="top"
                    src="/images/ancient-phil.jpeg"
                    width="100%"
                    height={160}
                    alt="ancient-philosophy"
                  />
                  <CardBody>
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      PHIL3329: Recitation for Ancient Philosophy
                    </CardTitle>
                    <CardText
                      className="wd-dashboard-course-description overflow-hidden"
                      style={{ height: "100px" }}
                    >
                      Meeting times TBD
                    </CardText>
                    <Button variant="primary">Go</Button>
                  </CardBody>
                </Link>
              </Card>
            </Col>
            <Col className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card>
                <Link
                  href="/courses/004"
                  className="wd-dashboard-course-link text-decoration-none text-dark"
                >
                  <CardImg
                    variant="top"
                    src="/images/storytelling.jpeg"
                    width="100%"
                    height={160}
                    alt="storytelling"
                  />
                  <CardBody>
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      ENGW3000: Advanced Writing for Storytelling
                    </CardTitle>
                    <CardText
                      className="wd-dashboard-course-description overflow-hidden"
                      style={{ height: "100px" }}
                    >
                      Questions? Contact Professor Seuss at
                      seuss@northeastern.edu
                    </CardText>
                    <Button variant="primary">Go</Button>
                  </CardBody>
                </Link>
              </Card>
            </Col>
            <Col className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card>
                <Link
                  href="/courses/005"
                  className="wd-dashboard-course-link text-decoration-none text-dark"
                >
                  <CardImg
                    variant="top"
                    src="/images/science-lab.jpeg"
                    width="100%"
                    height={160}
                    alt="scientific-thinking-lab"
                  />
                  <CardBody>
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      EEMB1103: Lab for Principles of Scientific Thinking
                    </CardTitle>
                    <CardText
                      className="wd-dashboard-course-description overflow-hidden"
                      style={{ height: "100px" }}
                    >
                      Attendance is MANDATORY. Please don't forget to fill
                      out...
                    </CardText>
                    <Button variant="primary">Go</Button>
                  </CardBody>
                </Link>
              </Card>
            </Col>
            <Col className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card>
                <Link
                  href="/courses/006"
                  className="wd-dashboard-course-link text-decoration-none text-dark"
                >
                  <CardImg
                    variant="top"
                    src="/images/quantum.jpeg"
                    width="100%"
                    height={160}
                    alt="quantum-physics"
                  />
                  <CardBody>
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      PHYS4003: Quantum Analytics
                    </CardTitle>
                    <CardText
                      className="wd-dashboard-course-description overflow-hidden"
                      style={{ height: "100px" }}
                    >
                      Covers quantum cryptography, quantum algorithms, and its
                      applications.
                    </CardText>
                    <Button variant="primary">Go</Button>
                  </CardBody>
                </Link>
              </Card>
            </Col>
            <Col className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card>
                <Link
                  href="/courses/007"
                  className="wd-dashboard-course-link text-decoration-none text-dark"
                >
                  <CardImg
                    variant="top"
                    src="/images/anthropology.jpeg"
                    width="100%"
                    height={160}
                    alt="quantum-physics"
                  />
                  <CardBody>
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      SOCL1101: Anthropology for Beginners
                    </CardTitle>
                    <CardText
                      className="wd-dashboard-course-description overflow-hidden"
                      style={{ height: "100px" }}
                    >
                      Start your journey towards qualitative praxis today.
                    </CardText>
                    <Button variant="primary">Go</Button>
                  </CardBody>
                </Link>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
