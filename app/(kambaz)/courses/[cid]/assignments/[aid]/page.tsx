"use client";

import { redirect, useParams, usePathname } from "next/navigation";
import { useState } from "react";

import {
  Button,
  Form,
  FormCheck,
  FormControl,
  FormLabel,
  FormSelect,
  Table,
} from "react-bootstrap";
import * as client from "./client";
import { useSelector, useDispatch } from "react-redux";
import { addAssignment, setAssignments, updateAssignment } from "../reducer";
import { RootState } from "../../../../store";

export default function AssignmentEditor() {
  const dispatch = useDispatch();
  const { assignments } = useSelector(
    (state: RootState) => state.assignmentsReducer,
  );
  const { cid, aid } = useParams();

  // YYYY-MM-DD = 10 chars
  const formattedDate = new Date().toISOString().substring(0, 10);

  // if /assignments/new, create the assignment to edit, else retrieve (undefined if error in querying)
  const [assignment, setAssignment] = useState<any>(
    usePathname().endsWith("new")
      ? {
          _id: "new",
          course: cid,
          title: "New Assignment",
          points: 0,
          description: "Description",
          dueDate: formattedDate,
          availableFromDate: formattedDate,
          availableUntilDate: formattedDate,
        }
      : assignments.filter((a: any) => a._id === aid)[0] || undefined,
  );

  const onRedirect = () => {
    redirect("../assignments");
  };

  const onSave = async () => {
    // if new assignment
    if (assignment._id === "new") {
      const newAssignment = await client.createAssignment(assignment);
      dispatch(setAssignments([...assignments, newAssignment]));
    } else {
      const updatedAssignment = await client.updateAssignment(assignment);
      dispatch(updateAssignment(updatedAssignment));
    }
    onRedirect();
  };

  return (
    <div id="wd-assignments-editor" className="ps-2 fs-5">
      <Form>
        <FormLabel htmlFor="wd-name"> Assignment Name </FormLabel>
        <FormControl
          id="wd-name"
          type="text"
          defaultValue={assignment.title}
          size="lg"
          onChange={(e) =>
            setAssignment({ ...assignment, title: e.target.value })
          }
        ></FormControl>
        <br />
        <FormControl
          id="wd-description"
          as="textarea"
          rows={5}
          size="lg"
          defaultValue={assignment?.description}
          onChange={(e) =>
            setAssignment({ ...assignment, description: e.target.value })
          }
        ></FormControl>
        <br />

        <Table borderless>
          <tbody>
            <tr>
              <td align="right" valign="top">
                <FormLabel htmlFor="wd-points"> Points </FormLabel>
              </td>
              <td>
                <FormControl
                  type="text"
                  id="wd-points"
                  defaultValue={assignment?.points}
                  size="lg"
                  onChange={(e) => {
                    setAssignment({ ...assignment, points: e.target.value });
                  }}
                />
              </td>
            </tr>
            <tr>
              <td align="right" valign="top">
                <FormLabel htmlFor="wd-assignment-group">
                  {" "}
                  Assignment Group{" "}
                </FormLabel>
              </td>
              <td>
                <FormSelect
                  name="assignment-group"
                  id="wd-assignment-group"
                  size="lg"
                >
                  <option value="assignments" defaultChecked>
                    {" "}
                    ASSIGNMENTS
                  </option>
                  <option value="bonus"> BONUS PROJECTS </option>
                </FormSelect>
              </td>
            </tr>
            <tr>
              <td align="right" valign="top">
                <FormLabel htmlFor="wd-grade-display">
                  Display Grade as
                </FormLabel>
              </td>
              <td>
                <FormSelect
                  name="grade-display"
                  id="wd-grade-display"
                  defaultValue={"percentage"}
                  size="lg"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fraction"> Fraction </option>
                </FormSelect>
              </td>
            </tr>
            <tr>
              <td align="right" valign="top">
                <FormLabel htmlFor="wd-submission-type">
                  {" "}
                  Submission Type{" "}
                </FormLabel>
              </td>
              <td>
                <FormSelect
                  name="submission-type"
                  id="wd-submission-type"
                  defaultValue="online"
                  size="lg"
                >
                  <option value="online">Online</option>
                  <option value="in-person"> In Person </option>
                </FormSelect>
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <FormLabel htmlFor="wd-online-entry-options">
                  <b>Online Entry Options</b>
                </FormLabel>
                <br />
                <FormCheck
                  type="checkbox"
                  name="online-entry"
                  id="wd-online-entry-checkbox-text"
                  label="Text Entry"
                />
                <br />
                <FormCheck
                  type="checkbox"
                  name="online-entry"
                  id="wd-online-entry-checkbox-url"
                  label="Website URL"
                />
                <br />
                <FormCheck
                  type="checkbox"
                  name="online-entry"
                  id="wd-online-entry-checkbox-recording"
                  label="Media Recordings"
                />
                <br />
                <FormCheck
                  type="checkbox"
                  name="online-entry"
                  id="wd-online-entry-checkbox-annotation"
                  label="Student Annotation"
                />
                <br />
                <FormCheck
                  type="checkbox"
                  name="online-entry"
                  id="wd-online-entry-checkbox-file"
                  label="File Uploads"
                />
              </td>
            </tr>
            <tr>
              <td align="right" valign="top">
                Assign
              </td>
              <td>
                <FormLabel htmlFor="wd-assign-to">
                  {" "}
                  <b>Assign to</b>{" "}
                </FormLabel>
                <br />
                <FormControl type="text" defaultValue="Everyone" size="lg" />
                <br />
                <FormLabel htmlFor="wd-due-date"> Due</FormLabel>
                <br />
                <FormControl
                  type="date"
                  defaultValue={assignment?.dueDate}
                  id="wd-due-date"
                  size="lg"
                  onChange={(e) =>
                    setAssignment({ ...assignment, dueDate: e.target.value })
                  }
                />
                <br /> <br />
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <FormLabel htmlFor="wd-available-from-date">
                          Available from
                        </FormLabel>
                        <br />
                        <FormControl
                          type="date"
                          id="wd-available-from-date"
                          defaultValue={assignment?.availableFromDate}
                          size="lg"
                          onChange={(e) =>
                            setAssignment({
                              ...assignment,
                              availableFromDate: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <FormLabel htmlFor="wd-available-until-date">
                          {" "}
                          Until{" "}
                        </FormLabel>
                        <br />
                        <FormControl
                          type="date"
                          id="wd-available-until-date"
                          defaultValue={assignment.availableUntilDate}
                          size="lg"
                          onChange={(e) =>
                            setAssignment({
                              ...assignment,
                              availableUntilDate: e.target.value,
                            })
                          }
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </Table>
        <div className="d-flex flex-row-reverse gap-2 fs-5">
          <Button size="lg" variant="danger" className="me-2" onClick={onSave}>
            {" "}
            Save{" "}
          </Button>
          <Button size="lg" variant="secondary" onClick={onRedirect}>
            {" "}
            Cancel{" "}
          </Button>
        </div>
      </Form>
    </div>
  );
}
