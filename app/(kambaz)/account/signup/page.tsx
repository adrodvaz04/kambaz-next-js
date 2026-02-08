import Link from "next/link";
import { FormControl } from "react-bootstrap";

export default function Signup() {
  return (
    <div id="wd-signup-screen">
      <h1>Sign up</h1>
      <FormControl placeholder="username" className="wd-username mb-2" />
      <FormControl
        placeholder="password"
        type="password"
        className="wd-password mb-2"
      />
      <FormControl
        placeholder="verify password"
        type="password"
        className="wd-password-verify mb-2"
      />
      <Link href="profile" className="btn btn-primary w-100 mb-2">
        Sign up
      </Link>
      <br />
      <Link href="signin"> Sign in </Link>
    </div>
  );
}
