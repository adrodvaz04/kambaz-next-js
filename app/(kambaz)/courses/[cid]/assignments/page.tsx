"use client";
import {
  Row,
  Col,
  Button,
  FormControl,
  InputGroup,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { FaPlus } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { BsGripVertical } from "react-icons/bs";
import LessonControlButtons from "../modules/LessonControlButtons";
import { MdOutlineAssignment } from "react-icons/md";
import Link from "next/link";

export default function Assignments() {
  return (
    <div id="wd-assignments">
      <div className="d-flex mt-4">
        <InputGroup className="me-5 float-start">
          <InputGroupText className="text-secondary">
            <FaMagnifyingGlass className="fs-5 me-2" />
            Search...
          </InputGroupText>
          <FormControl
            type="text"
            id="wd-search-assignment"
            className=""
          ></FormControl>
        </InputGroup>

        <Button
          size="lg"
          variant="secondary"
          id="wd-add-assignment-group"
          className="me-2 text-nowrap float-end"
        >
          <FaPlus className="fs-5 me-2 m-1" /> Group
        </Button>
        <Button
          size="lg"
          id="wd-add-assignment"
          variant="danger"
          className="me-2 text-nowrap float-end"
        >
          <FaPlus
            className="position-relative me-2"
            style={{ bottom: "1px" }}
          />
          Assignment{" "}
        </Button>
      </div>

      <br />
      <br />
      <ListGroup>
        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="d-flex p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-2 fs-3" />
            <span className="font-bold me-2"> Assignments </span>
            <span className="size-fit me-2"> 40% of Total </span>
            <FaPlus
              className="position-relative me-2"
              style={{ bottom: "1px" }}
            />
          </div>
          <ListGroup className="rounded-0">
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex">
              <div className="d-flex px-2">
                <BsGripVertical className="me-2 fs-3" />
                <MdOutlineAssignment className="me-2 fs-3" color="green" />
              </div>
              <Link href="/courses/001/assignments/001/" className="text-wrap text-black text-decoration-none">
                <b>A1</b> <br />
                <span className="text-danger"> Multiple Modules </span> |
                <b> Not available until </b>
                May 13th at 12:00am |<b> Due </b>
                May 20th at 11:59pm | 100pts
              </Link>
              <div className="px-2">
                <LessonControlButtons />
              </div>
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex">
              <div className="d-flex px-2">
                <BsGripVertical className="me-2 fs-3" />
                <MdOutlineAssignment className="me-2 fs-3" color="green" />
              </div>
              <Link href="/courses/001/assignments/001/" className="text-wrap  text-black text-decoration-none">
                <b>A2</b> <br />
                <span className="text-danger"> Multiple Modules </span> |
                <b> Not available until </b>
                May 27th at 12:00am |<b> Due </b>
                June 10th at 11:59pm | 100pts
              </Link>
              <div className="px-2">
                <LessonControlButtons />
              </div>
            </ListGroupItem>
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
