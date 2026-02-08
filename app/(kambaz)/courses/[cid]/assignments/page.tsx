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
    <div id="wd-assignments" className="me-2">
      <div className="d-flex mt-4">
        <InputGroup className="me-5 float-start">
          <InputGroupText className="text-secondary bg-white border-r-0">
            <FaMagnifyingGlass className="fs-5 me-2" />
            Search...
          </InputGroupText>
          <FormControl
            type="text"
            id="wd-search-assignment"
            className="border-l-0"
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
        <ListGroupItem className=" rounded-0 wd-module p-0 mb-5 fs-5 border-gray">
          <div className="p-3 ps-2 bg-secondary w-fit">
            <BsGripVertical className="me-2 fs-3" />
            <span className="font-bold me-2 fs-4"> Assignments </span>
            <div className="float-end">
              <span className="size-fit me-2" style={{borderRadius: "2px!important", borderColor: "black!important"}}> 40% of Total </span>
              <FaPlus />
            </div>
          </div>

          <ListGroup className="rounded-0">
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex">
              <div className="d-flex pt-3 pe-2">
                <BsGripVertical className="me-2 fs-3" />
                <MdOutlineAssignment className="me-2 fs-3" color="green" />
              </div>
              <Link
                href="/courses/001/assignments/001/"
                className="text-wrap text-black text-decoration-none me-4"
              >
                <b>A1</b> <br />
                <span className="text-danger"> Multiple Modules </span> |
                <b> Not available until </b>
                May 13th at 12:00am |<b> Due </b>
                May 20th at 11:59pm | 100pts
              </Link>
              <div className="pt-3">
                <LessonControlButtons />
              </div>
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex">
              <div className="d-flex pt-3 pe-2">
                <BsGripVertical className="me-2 fs-3" />
                <MdOutlineAssignment className="me-2 fs-3" color="green" />
              </div>
              <Link
                href="/courses/001/assignments/001/"
                className="text-wrap  text-black text-decoration-none me-4"
              >
                <b>A2</b> <br />
                <span className="text-danger"> Multiple Modules </span> |
                <b> Not available until </b>
                May 27th at 12:00am |<b> Due </b>
                June 10th at 11:59pm | 100pts
              </Link>
              <div className="pt-3">
                <LessonControlButtons />
              </div>
            </ListGroupItem>
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
