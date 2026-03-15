"use client";

import { useDispatch, useSelector } from "react-redux";
import { addNewCourse, deleteCourse, updateCourse } from "../courses/reducer";
import { RootState } from "../store";

import { FormControl } from "react-bootstrap";
import Link from "next/link";
import * as db from "../database";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
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
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );
  const { enrollments } = db;
  const dispatch = useDispatch();

  const [course, setCourse] = useState<any>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description",
  });

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h5>
        New Course
        <Button
          className="btn btn-warning float-end me-2"
          onClick={() => dispatch(updateCourse(course))}
          id="wd-update-course-click"
        >
          Update{" "}
        </Button>
        <Button
          className="btn btn-primary float-end me-3"
          id="wd-add-new-course-click"
          onClick={() => {
            const newCourse = { ...course, _id: uuidv4() };
            dispatch(addNewCourse(newCourse));
            setCourse({
              _id: "0",
              name: "New Course",
              number: "New Number",
              startDate: "2023-09-10",
              endDate: "2023-12-15",
              image: "/images/reactjs.jpg",
              description: "New Description",
            });
          }}
        >
          {" "}
          Add{" "}
        </Button>
      </h5>
      <br />
      <FormControl
        value={course.name}
        onChange={(e) => setCourse({ ...course, name: e.target.value })}
        className="mb-2"
      />
      <FormControl
        value={course.description}
        as="textarea"
        rows={3}
        onChange={(e) => setCourse({ ...course, description: e.target.value })}
      />
      <hr />
      <h2 id="wd-dashboard-published">
        Published Courses ({courses.length})
      </h2>{" "}
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {currentUser ? (
            courses
              .filter((course) =>
                enrollments.some(
                  (enrollment) =>
                    enrollment.user === currentUser._id &&
                    enrollment.course === course._id,
                ),
              )

              .map((course: any) => (
                <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                  <Card>
                    <Link
                      href={`/courses/${course._id}/home`}
                      className="wd-dashboard-course-link text-decoration-none text-dark"
                    >
                      <CardImg
                        src={`/images/${course.image}` || "images/reactjs.jpg"}
                        variant="top"
                        width="100%"
                        height={160}
                      />
                      <CardBody className="card-body">
                        <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                          {course.name}{" "}
                        </CardTitle>
                        <CardText
                          className="wd-dashboard-course-description overflow-hidden"
                          style={{ height: "100px" }}
                        >
                          {course.description}{" "}
                        </CardText>
                        <div className="d-flex">
                          <Button variant="primary"> Go </Button>
                          <Button
                            id="wd-edit-course-click"
                            onClick={(event) => {
                              event.preventDefault();
                              setCourse(course);
                            }}
                            className="btn btn-warning me-2 float-end ms-2"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={(event) => {
                              event.preventDefault();
                              dispatch(deleteCourse(course._id));
                            }}
                            className="btn btn-danger float-end"
                            id="wd-delete-course-click"
                          >
                            Delete
                          </Button>
                        </div>
                      </CardBody>
                    </Link>
                  </Card>
                </Col>
              ))
          ) : (
            <span className="p-2 w-fit text-nowrap">No courses available. Please sign in.</span>
          )}
        </Row>
      </div>
    </div>
  );
}
