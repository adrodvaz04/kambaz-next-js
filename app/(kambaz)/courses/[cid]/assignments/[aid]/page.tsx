"use client";

import { redirect, useParams } from "next/navigation";
import { assignments } from "@/app/(kambaz)/database";

import {
  Button,
  Form,
  FormControl,
  FormLabel,
  FormSelect,
  FormCheck,
  Table,
} from "react-bootstrap";

export default function AssignmentEditor() {
  const { aid } = useParams();
  const currentAssignment = assignments.filter((a) => a._id === aid)[0] || undefined;

  const onRedirect = () => {
    redirect("../assignments");
  }

  console.log(currentAssignment)
  return (
    <div id="wd-assignments-editor" className="ps-2 fs-5">
      <Form>
        <FormLabel htmlFor="wd-name"> Assignment Name </FormLabel>
        <FormControl
          id="wd-name"
          type="text"
          defaultValue={aid}
          size="lg"
        ></FormControl>
        <br />
        <FormControl
          id="wd-description"
          as="textarea"
          rows={5}
          size="lg"
          defaultValue={currentAssignment?.description}
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
                  defaultValue={currentAssignment?.points}
                  size="lg"
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
                  defaultValue={currentAssignment?.dueDate}
                  id="wd-due-date"
                  size="lg"
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
                          defaultValue={currentAssignment?.availableDate}
                          size="lg"
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
                          defaultValue={"2999-12-01"}
                          size="lg"
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
          <Button size="lg" variant="danger" className="me-2"
          onClick={onRedirect}>
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
