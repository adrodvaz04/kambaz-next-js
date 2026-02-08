import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { ListGroup, ListGroupItem } from "react-bootstrap";

import Link from "next/link";
export default function KambazNavigation() {
  return (
    <ListGroup
      className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2"
      style={{ width: 110 }}
      id="wd-kambaz-navigation"
    >
      <ListGroupItem
        className="bg-black border-0 text-center text-white"
        as="a"
        target="_blank"
        href="https://www.northeastern.edu/"
        id="wd-neu-link"
      >
        <img src="/images/NEU.png" width="75px" alt="Northeastern University" />
      </ListGroupItem>
      <ListGroupItem className="border-0 bg-black text-center">
        <Link
          href="/account"
          id="wd-account-link"
          className="text-white text-decoration-none"
        >
          <FaRegCircleUser className="fs-1 text-white" />
          <br />
          Account
        </Link>
      </ListGroupItem>
      <ListGroupItem className="border-0 bg-white text-center">
        <Link
          href="/dashboard"
          id="wd-dashboard-link"
          className="text-danger text-decoration-none"
        >
          <AiOutlineDashboard className="fs-1 text-danger" />
          <br />
          Dashboard
        </Link>
      </ListGroupItem>
      <ListGroupItem className="border-0 bg-black text-center">
        <Link
          href="/dashboard"
          id="wd-courses-link"
          className="text-danger text-decoration-none"
        >
          <LiaBookSolid className="fs-1" />
          <br />
          <span className="text-white">Courses</span>
        </Link>
      </ListGroupItem>
      <ListGroupItem className="border-0 bg-black text-center">
        <Link
          href="/dashboard"
          id="wd-courses-link"
          className="text-danger text-decoration-none"
        >
          <IoCalendarOutline className="fs-1" />
          <br />
          <span className="text-white">Calendar</span>
        </Link>
      </ListGroupItem>
      <ListGroupItem className="border-0 bg-black text-center">
        <Link
          href="/inbox"
          id="wd-inbox-link"
          className="text-danger text-decoration-none"
        >
          <FaInbox className="fs-1" />
          <br />
          <span className="text-white">Inbox</span>
        </Link>
      </ListGroupItem>
      <ListGroupItem className="border-0 bg-black text-center">
        <Link
          href="/labs"
          id="wd-inbox-link"
          className="text-danger text-decoration-none"
        >
          <LiaCogSolid className="fs-1" />
          <br />
          <span className="text-white">Labs</span>
        </Link>
      </ListGroupItem>
    </ListGroup>
  );
}
