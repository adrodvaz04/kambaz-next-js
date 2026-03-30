"use client";
import { RootState } from "@/app/(kambaz)/store";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import {
  Button,
  FormControl,
  InputGroup,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { BsGripVertical } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { FaMagnifyingGlass, FaTrash } from "react-icons/fa6";
import { MdOutlineAssignment } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import LessonControlButtons from "../modules/LessonControlButtons";

import * as client from "./[aid]/client";

import { useEffect, useState } from "react";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { setAssignments } from "./reducer";

export default function Assignments() {
  const { cid } = useParams();

  const { assignments } = useSelector(
    (state: RootState) => state.assignmentsReducer,
  );

  const fetchAssignments = async () => {
    const retrievedAssignments = await client.getAssignmentsByCourse(cid as string);
    dispatch(setAssignments(retrievedAssignments));
  };

  const dispatch = useDispatch();

  const [aidToDelete, setAidToDelete] = useState<string | undefined>(undefined);

  const handleClose = () => setAidToDelete(undefined);
  const handleShow = (assignmentId: string) => setAidToDelete(assignmentId);

  const onAssignmentDelete = async () => {
    await client.deleteAssignment(aidToDelete as string);
    dispatch(setAssignments(assignments.filter((a) => a._id !== aidToDelete)));
  };

  useEffect(() => {
    fetchAssignments();
  });

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
          onClick={() => redirect(`/courses/${cid}/assignments/new`)}
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
              <span
                className="size-fit me-2"
                style={{
                  borderRadius: "2px!important",
                  borderColor: "black!important",
                }}
              >
                {" "}
                40% of Total{" "}
              </span>
              <FaPlus />
            </div>
          </div>

          {assignments
            .filter((assignment: any) => assignment.course === cid)
            .map((assignment: any) => (
              <ListGroup className="rounded-0" key={assignment._id}>
                <ListGroupItem className="wd-lesson p-3 ps-1 d-flex">
                  <div className="d-flex pt-3 pe-2">
                    <BsGripVertical className="me-2 fs-3" />
                    <MdOutlineAssignment className="me-2 fs-3" color="green" />
                  </div>
                  <Link
                    href={`/courses/${assignment.course}/assignments/${assignment._id}/`}
                    className="text-wrap text-black text-decoration-none me-4"
                  >
                    <b>{assignment._id}</b> <br />
                    <span className="text-danger"> {assignment.title} </span> |
                    <b> Not available until </b>
                    {assignment.availableFromDate} at 12:00am |<b> Due </b>
                    {assignment.dueDate} at 11:59pm | {assignment.points}pts
                  </Link>
                  <div className="d-flex float-end pt-3">
                    <span className="m-1">
                      <LessonControlButtons />
                    </span>
                    <FaTrash
                      className="m-1 text-danger"
                      onClick={() => handleShow(assignment._id)}
                    ></FaTrash>
                  </div>
                </ListGroupItem>
              </ListGroup>
            ))}
        </ListGroupItem>
      </ListGroup>
      <DeleteConfirmModal
        show={aidToDelete !== undefined}
        handleClose={handleClose}
        deleteOperation={onAssignmentDelete}
        dialogTitle={"Delete Assignment"}
        bodyText={"Are you sure you want to delete this assignment?"}
      ></DeleteConfirmModal>
    </div>
  );
}
