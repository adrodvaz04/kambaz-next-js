"use client";
import React, { useState } from "react";
import { FormControl } from "react-bootstrap";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
export default function WorkingWithObjects() {
  const [assignment, setAssignment] = useState({
    id: 1,
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10",
    completed: false,
    score: 0,
  });
  const [module, setModule] = useState({
    id: 1,
    name: "on the way to vermont",
    description: "i have a tkd tournament",
    course: "taekwondo",
  });
  const ASSIGNMENT_API_URL = `${HTTP_SERVER}/lab5/assignment`;
  const MODULE_API_URL = `${HTTP_SERVER}/lab5/module`;

  return (
    <div id="wd-working-with-objects">
      <h3>Working With Objects</h3>
      <h4>Retrieving Objects</h4>
      <a
        id="wd-retrieve-assignments"
        className="btn btn-primary"
        href={`${HTTP_SERVER}/lab5/assignment`}
      >
        Get Assignment
      </a>
      <hr />
      <h4>Retrieving Properties</h4>
      <a
        id="wd-retrieve-assignment-title"
        className="btn btn-primary"
        href={`${HTTP_SERVER}/lab5/assignment/title`}
      >
        Get Title
      </a>
      <hr />

      <h4>Modifying Properties</h4>
      <a
        id="wd-update-assignment-title"
        className="btn btn-primary float-end"
        href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}
      >
        Update Title{" "}
      </a>
      <FormControl
        className="w-75"
        id="wd-assignment-title"
        defaultValue={assignment.title}
        onChange={(e) =>
          setAssignment({ ...assignment, title: e.target.value })
        }
      />

      <hr />
      <a
        href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}
        className="btn btn-primary float-end"
      >
        {" "}
        Set Assignment Score{" "}
      </a>
      <FormControl
        className="w-50"
        id="wd-assignment-score"
        defaultValue={assignment.score}
        onChange={(e) => {
          setAssignment({ ...assignment, score: parseInt(e.target.value) });
        }}
      ></FormControl>
      <hr />
      <a
        className="btn btn-primary float-end"
        href={`${MODULE_API_URL}/completed/${assignment.completed}`}
      >
        {" "}
        Update Assignment Completion{" "}
      </a>
      <input
        type="checkbox"
        checked={assignment.completed}
        onChange={() =>
          setAssignment({ ...assignment, completed: !assignment.completed })
        }
      ></input>

      <hr />
      <a
        id="wd-retrieve-module"
        className="btn btn-primary"
        href={`${MODULE_API_URL}`}
      >
        Get Module
      </a>
      <hr />
      <a
        id="wd-retrieve-module-name"
        className="btn btn-primary"
        href={`${MODULE_API_URL}/name`}
      >
        Get Module Name
      </a>
      <hr />
      <a
        id="wd-set-module-name"
        className="btn btn-primary float-end"
        href={`${MODULE_API_URL}/name/${module.name}`}
      >
        Set Module Name
      </a>
      <FormControl
        id="wd-set-module-name"
        className="w-50"
        type="text"
        onChange={(e) => {
          setModule({ ...module, name: e.target.value });
        }}
      ></FormControl>
      <hr />
    </div>
  );
}
