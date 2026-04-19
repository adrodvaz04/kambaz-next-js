"use client";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCourses } from "../courses/reducer";
import { RootState } from "../store";

import Link from "next/link";
import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  FormControl,
  Row,
} from "react-bootstrap";
import * as coursesClient from "../courses/client";
import * as enrollmentsClient from "../enrollments/client";
import { setEnrollments } from "../enrollments/reducer";

export default function Dashboard() {
  const { courses } = useSelector((state: RootState) => state.coursesReducer);

  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  ) as any | null;

  const { enrollments } = useSelector(
    (state: RootState) => state.enrollmentsReducer,
  );

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

  const [enrollmentMode, setEnrollmentMode] = useState<boolean>(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // if no current user or in enrollment mode: fetch courses: else my courses
        const fetchedCourses =
          !currentUser || enrollmentMode
            ? await coursesClient.fetchAllCourses()
            : await coursesClient.findMyCourses();
        dispatch(setCourses(fetchedCourses));
      } catch (e) {
        console.error(e);
      }
    };
    const fetchEnrollments = async () => {
      try {
        const fetchedEnrollments = await enrollmentsClient.getEnrollments(
          currentUser._id,
        );
        dispatch(setEnrollments(fetchedEnrollments));
      } catch (e) {
        console.error(e);
      }
    };

    fetchCourses();
    if (currentUser) {
      fetchEnrollments();
    }

    // only re-run when user or callbacks change
  }, [dispatch, currentUser, enrollmentMode]);

  const isEnrolled = (courseId: string) =>
    enrollments.some((e: any) => e._id === courseId);

  const onAddNewCourse = async () => {
    const newCourse = await coursesClient.createCourse(course);
    dispatch(setCourses([...courses, newCourse]));
  };

  const onDeleteCourse = async (courseId: string) => {
    await coursesClient.deleteCourse(courseId);
    dispatch(
      setCourses(courses.filter((course) => (course as any)._id !== courseId)),
    );
  };

  const onUpdateCourse = async () => {
    await coursesClient.updateCourse(course);
    dispatch(
      setCourses(
        courses.map((c) => {
          if ((c as any)._id === course._id) {
            return course;
          } else {
            return c;
          }
        }),
      ),
    );
  };

  const onEnroll = async (courseId: string) => {
    if (!currentUser?._id) return;

    const newEnrollment = await enrollmentsClient.enrollUser(
      currentUser._id,
      courseId,
    );

    // note new enrollments will have the course populated.
    dispatch(setEnrollments([...enrollments, newEnrollment]));
  };

  const onUnenroll = async (courseId: string) => {
    if (!currentUser?._id) return;

    const unenrollment = await enrollmentsClient.unenrollUser(
      currentUser._id,
      courseId,
    );

    dispatch(
      setEnrollments(
        enrollments.filter((e: any) => e._id !== courseId),
      ),
    );
  };

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h5>
        New Course
        <Button
          className={`btn float-end me-2`}
          id="wd-show-enrollments-click"
          disabled={!currentUser}
          onClick={() => setEnrollmentMode(!enrollmentMode)}
        >
          {" "}
          Enrollments{" "}
        </Button>
        <Button
          className="btn btn-warning float-end me-2"
          onClick={onUpdateCourse}
          id="wd-update-course-click"
          hidden={!currentUser || currentUser.role !== "FACULTY"}
        >
          Update{" "}
        </Button>
        <Button
          onClick={onAddNewCourse}
          className="btn btn-primary float-end me-3"
          id="wd-add-new-course-click"
          hidden={!currentUser || currentUser.role !== "FACULTY"}
        >
          Add
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
          {courses.map((course: any) => (
            <Col
              key={course._id}
              className="wd-dashboard-course"
              style={{ width: "300px" }}
            >
              <Card>
                <Link
                  onNavigate={(e) => {
                    if (!(currentUser && isEnrolled(course._id))) {
                      e.preventDefault();
                    }
                  }}
                  href={`/courses/${course._id}/home`}
                  className={`wd-dashboard-course-link text-decoration-none text-dark`}
                >
                  <CardImg
                    src={`/images/${course.image ?? "reactjs.jpg"}`}
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
                  </CardBody>
                </Link>
                <CardBody>
                  <div className="d-flex text-wrap">
                    <Button
                      variant="primary"
                      href={`../courses/${course._id}/home`}
                    >
                      {" "}
                      Go{" "}
                    </Button>
                    <Button
                      id="wd-edit-course-click"
                      hidden={!currentUser || currentUser.role !== "FACULTY"}
                      onClick={(event) => {
                        event.preventDefault();
                        setCourse(course);
                      }}
                      className="btn btn-warning me-2 float-end ms-2"
                    >
                      Edit
                    </Button>
                    <Button
                      className="btn btn-danger float-end"
                      hidden={!currentUser || currentUser.role !== "FACULTY"}
                      onClick={(event) => {
                        event.preventDefault();
                        onDeleteCourse(course._id);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                  <br />
                  <div className="d-flex text-wrap" hidden={!enrollmentMode}>
                    <Button
                      variant="success"
                      hidden={
                        !enrollmentMode || // not in enrollment mode or
                        isEnrolled(course._id) // enrolled
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        onEnroll(course._id);
                      }}
                    >
                      {" "}
                      Enroll{" "}
                    </Button>
                    <Button
                      hidden={
                        !enrollmentMode || // not in enrollment mode or
                        !isEnrolled(course._id)
                        // already unenrolled
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        onUnenroll(course._id);
                      }}
                    >
                      {" "}
                      Unenroll{" "}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
