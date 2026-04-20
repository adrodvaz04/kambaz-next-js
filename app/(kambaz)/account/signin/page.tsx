"use client";
import * as client from "../client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import {
  FormControl,
  Button,
  Card,
  CardHeader,
  CardBody,
} from "react-bootstrap";

export default function Signin() {
  const [credentials, setCredentials] = useState<any>({});
  const dispatch = useDispatch();
  const signin = async () => {
    const user = await client.signin(credentials);
    if (!user) return;
    dispatch(setCurrentUser(user));
    redirect("/dashboard");
  };
  return (
    <div id="wd-signin-screen">
      <h1>Sign in</h1>
      <FormControl
        defaultValue={credentials.username}
        onChange={(e) =>
          setCredentials({ ...credentials, username: e.target.value })
        }
        className="mb-2"
        placeholder="username"
        id="wd-username"
      />
      <FormControl
        defaultValue={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
        className="mb-2"
        placeholder="password"
        type="password"
        id="wd-password"
      />
      <Button onClick={signin} id="wd-signin-btn" className="w-100">
        {" "}
        Sign in{" "}
      </Button>
      <Link id="wd-signup-link" href="/account/signup">
        {" "}
        Sign up{" "}
      </Link>

      <br />
      <br />
      <br />
      <Card>
        <CardHeader className="fs-3">Final Project Submission</CardHeader>
        <CardBody className="fs-4">
          Team: Adrian Rodriguez (adrodvaz04), Madison Seal (madisonseal) 
          <br />
          Section: Online Async 
          <br />
          Prof. Annunziato
          <br />
          <Link href={"https://github.com/adrodvaz04/kambaz-next-js"}>
            {" "}
            FE Link{" "}
          </Link>
          <br />
          <Link href={"https://github.com/adrodvaz04/kambaz-node-server-app"}>
            {" "}
            BE Link
          </Link>
        </CardBody>
      </Card>
    </div>
  );
}
